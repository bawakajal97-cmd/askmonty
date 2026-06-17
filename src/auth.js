import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Pool } from "@neondatabase/serverless";
import { hash, verify } from "argon2";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function Adapter(client) {
  return {
    async createUser(user) {
      const { name, email, emailVerified, image } = user;
      const result = await client.query(
        `INSERT INTO auth_users (name, email, "emailVerified", image)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, "emailVerified", image`,
        [name, email, emailVerified, image]
      );
      return result.rows[0];
    },
    async getUser(id) {
      try {
        const result = await client.query("SELECT * FROM auth_users WHERE id = $1", [id]);
        return result.rowCount === 0 ? null : result.rows[0];
      } catch { return null; }
    },
    async getUserByEmail(email) {
      const result = await client.query("SELECT * FROM auth_users WHERE email = $1", [email]);
      if (result.rowCount === 0) return null;
      const userData = result.rows[0];
      const accountsData = await client.query(
        'SELECT * FROM auth_accounts WHERE "userId" = $1', [userData.id]
      );
      return { ...userData, accounts: accountsData.rows };
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await client.query(
        `SELECT u.* FROM auth_users u JOIN auth_accounts a ON u.id = a."userId"
         WHERE a.provider = $1 AND a."providerAccountId" = $2`,
        [provider, providerAccountId]
      );
      return result.rowCount !== 0 ? result.rows[0] : null;
    },
    async updateUser(user) {
      const query1 = await client.query("SELECT * FROM auth_users WHERE id = $1", [user.id]);
      const oldUser = query1.rows[0];
      const newUser = { ...oldUser, ...user };
      const { id, name, email, emailVerified, image } = newUser;
      const query2 = await client.query(
        `UPDATE auth_users SET name=$2, email=$3, "emailVerified"=$4, image=$5
         WHERE id=$1 RETURNING name, id, email, "emailVerified", image`,
        [id, name, email, emailVerified, image]
      );
      return query2.rows[0];
    },
    async linkAccount(account) {
      const result = await client.query(
        `INSERT INTO auth_accounts ("userId", provider, type, "providerAccountId", password)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [account.userId, account.provider, account.type, account.providerAccountId, account.extraData?.password]
      );
      return result.rows[0];
    },
    async createSession({ sessionToken, userId, expires }) {
      const result = await client.query(
        `INSERT INTO auth_sessions ("userId", expires, "sessionToken")
         VALUES ($1, $2, $3) RETURNING id, "sessionToken", "userId", expires`,
        [userId, expires, sessionToken]
      );
      return result.rows[0];
    },
    async getSessionAndUser(sessionToken) {
      if (!sessionToken) return null;
      const r1 = await client.query('SELECT * FROM auth_sessions WHERE "sessionToken" = $1', [sessionToken]);
      if (r1.rowCount === 0) return null;
      const session = r1.rows[0];
      const r2 = await client.query("SELECT * FROM auth_users WHERE id = $1", [session.userId]);
      if (r2.rowCount === 0) return null;
      return { session, user: r2.rows[0] };
    },
    async updateSession(session) {
      const { sessionToken } = session;
      const r1 = await client.query('SELECT * FROM auth_sessions WHERE "sessionToken" = $1', [sessionToken]);
      if (r1.rowCount === 0) return null;
      const newSession = { ...r1.rows[0], ...session };
      await client.query('UPDATE auth_sessions SET expires=$2 WHERE "sessionToken"=$1', [newSession.sessionToken, newSession.expires]);
      return newSession;
    },
    async deleteSession(sessionToken) {
      await client.query('DELETE FROM auth_sessions WHERE "sessionToken" = $1', [sessionToken]);
    },
    async deleteUser(userId) {
      await client.query("DELETE FROM auth_users WHERE id = $1", [userId]);
      await client.query('DELETE FROM auth_sessions WHERE "userId" = $1', [userId]);
      await client.query('DELETE FROM auth_accounts WHERE "userId" = $1', [userId]);
    },
  };
}

const adapter = Adapter(pool);

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    Credentials({
      id: "credentials-signin",
      name: "Sign In",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) return null;
        const user = await adapter.getUserByEmail(email);
        if (!user) return null;
        const matchingAccount = user.accounts?.find(a => a.provider === "credentials");
        if (!matchingAccount?.password) return null;
        const isValid = await verify(matchingAccount.password, password);
        if (!isValid) return null;
        return user;
      },
    }),
    Credentials({
      id: "credentials-signup",
      name: "Sign Up",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const { email, password, name } = credentials;
        if (!email || !password) return null;
        const existing = await adapter.getUserByEmail(email);
        if (existing) return null;
        const newUser = await adapter.createUser({ email, name: name || null, emailVerified: null, image: null });
        await adapter.linkAccount({
          extraData: { password: await hash(password) },
          type: "credentials",
          userId: newUser.id,
          providerAccountId: newUser.id,
          provider: "credentials",
        });
        return newUser;
      },
    }),
  ],
  pages: {
    signIn: "/account/signin",
    signOut: "/account/logout",
  },
  session: { strategy: "database" },
  secret: process.env.AUTH_SECRET,
});
