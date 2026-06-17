import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ user: null });
    }

    const userId = session.user.id;
    const rows =
      await sql`SELECT * FROM user_profiles WHERE id = ${userId} LIMIT 1`;
    const profile = rows?.[0] || null;

    return Response.json({
      user: {
        ...session.user,
        ...profile,
      },
    });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
