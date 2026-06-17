import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    // Current month expenses
    const expenses = await sql`
      SELECT id, amount, category, label, expense_date
      FROM dashboard_expenses
      WHERE user_id = ${userId}
        AND DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', CURRENT_DATE)
      ORDER BY expense_date DESC, created_at DESC
    `;
    return Response.json({ expenses });
  } catch (err) {
    console.error("GET /api/dashboard/expenses error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const { amount, category, label, expense_date } = await request.json();
    if (!amount || !category || !expense_date) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const rows = await sql`
      INSERT INTO dashboard_expenses (user_id, amount, category, label, expense_date)
      VALUES (${userId}, ${amount}, ${category}, ${label || ""}, ${expense_date})
      RETURNING id, amount, category, label, expense_date
    `;
    return Response.json({ expense: rows[0] });
  } catch (err) {
    console.error("POST /api/dashboard/expenses error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

    await sql`DELETE FROM dashboard_expenses WHERE id = ${id} AND user_id = ${userId}`;
    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/dashboard/expenses error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
