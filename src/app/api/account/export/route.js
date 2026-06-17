import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";

    // Fetch all user data
    const [expenses, goals, chatHistory, profile] = await sql.transaction([
      sql`SELECT amount, category, label, expense_date FROM dashboard_expenses WHERE user_id = ${userId} ORDER BY expense_date DESC`,
      sql`SELECT name, target_amount, saved_amount, target_date FROM dashboard_goals WHERE user_id = ${userId}`,
      sql`SELECT role, content, created_at FROM chat_history WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 200`,
      sql`SELECT email, conversations_count, is_subscriber, subscription_tier, created_at FROM user_profiles LEFT JOIN auth_users ON auth_users.id::text = user_profiles.id::text WHERE user_profiles.id = ${userId} LIMIT 1`,
    ]);

    if (format === "csv") {
      const lines = [];
      lines.push("=== AskMonty Data Export ===");
      lines.push(`Exported: ${new Date().toISOString()}`);
      lines.push("");

      lines.push("=== EXPENSES ===");
      lines.push("Date,Category,Label,Amount");
      for (const e of expenses) {
        lines.push(
          `${e.expense_date},${e.category},"${e.label || ""}",${e.amount}`,
        );
      }
      lines.push("");

      lines.push("=== SAVINGS GOAL ===");
      lines.push("Name,Target Amount,Saved Amount,Target Date");
      for (const g of goals) {
        lines.push(
          `"${g.name}",${g.target_amount},${g.saved_amount},${g.target_date}`,
        );
      }
      lines.push("");

      lines.push("=== CHAT HISTORY (last 200 messages) ===");
      lines.push("Date,Role,Message");
      for (const c of chatHistory) {
        const msg = c.content.replace(/"/g, '""');
        lines.push(`${c.created_at},${c.role},"${msg}"`);
      }

      const csv = lines.join("\n");
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="askmonty-export-${Date.now()}.csv"`,
        },
      });
    }

    return Response.json({ error: "Unsupported format" }, { status: 400 });
  } catch (err) {
    console.error("GET /api/account/export error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
