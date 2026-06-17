import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "@neondatabase/serverless";
import { hash, verify } from "argon2";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getUserByEmail(email) {
  const result = await pool.query("SELECT * FROM auth_users WHERE email = $1", [email]);
  if (result.rowCount === 0) return null;
  const userData = result.rows[0];
  const accountsData = await pool.query(
    'SELECT * FROM auth_accounts WHERE "userId" = $1', [userData.id]
  );
  return { ...userData, accounts: accountsData.rows };
}

async function createUser(email, password, name) {
  const userResult = await pool.query(
    `INSERT INTO auth_users (name, email, "emailVerified", image)
     VALUES ($1, $2, NULL, NULL)
     RETURNING id, name, email`,
    [name || null, email]
  );
  const newUser = userResult.rows[0];
  const hashedPassword = await hash(password);
  await pool.query(
    `INSERT INTO auth_accounts ("userId", provider, type, "providerAccountId", password)
     VALUES ($1, 'credentials', 'credentials', $1, $2)`,
    [newUser.id, hashedPassword]
  );
  return newUser;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials-signin",
      name: "Sign In",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignUp: { label: "Is Sign Up", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const { email, password, isSignUp, name } = credentials;
        if (!email || !password) return null;

        if (isSignUp === "true") {
          const existing = await getUserByEmail(email);
          if (existing) throw new Error("Email already registered");
          const newUser = await createUser(email, password, name);
          return { id: newUser.id, email: newUser.email, name: newUser.name };
        }

        const user = await getUserByEmail(email);
        if (!user) throw new Error("No account found");
        const matchingAccount = user.accounts?.find(a => a.provider === "credentials");
        if (!matchingAccount?.password) throw new Error("Invalid credentials");
        const isValid = await verify(matchingAccount.password, password);
        if (!isValid) throw new Error("Invalid credentials");
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/account/signin",
    signOut: "/account/logout",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);