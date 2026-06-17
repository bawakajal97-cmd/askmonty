import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const rows =
      await sql`SELECT * FROM dashboard_goals WHERE user_id = ${userId} LIMIT 1`;
    return Response.json({ goal: rows[0] || null });
  } catch (err) {
    console.error("GET /api/dashboard/goal error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const { name, target_amount, saved_amount, target_date } =
      await request.json();
    if (!name || !target_amount || !target_date) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const rows = await sql`
      INSERT INTO dashboard_goals (user_id, name, target_amount, saved_amount, target_date)
      VALUES (${userId}, ${name}, ${target_amount}, ${saved_amount || 0}, ${target_date})
      ON CONFLICT (user_id) DO UPDATE SET
        name = EXCLUDED.name,
        target_amount = EXCLUDED.target_amount,
        saved_amount = EXCLUDED.saved_amount,
        target_date = EXCLUDED.target_date,
        updated_at = NOW()
      RETURNING *
    `;
    return Response.json({ goal: rows[0] });
  } catch (err) {
    console.error("POST /api/dashboard/goal error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const { saved_amount } = await request.json();
    if (saved_amount === undefined)
      return Response.json({ error: "Missing saved_amount" }, { status: 400 });

    const rows = await sql`
      UPDATE dashboard_goals
      SET saved_amount = ${saved_amount}, updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING *
    `;
    return Response.json({ goal: rows[0] || null });
  } catch (err) {
    console.error("PATCH /api/dashboard/goal error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
