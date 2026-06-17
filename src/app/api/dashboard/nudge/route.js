import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

async function callGemini(systemPrompt, userContent) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: userContent }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { maxOutputTokens: 256, temperature: 0.8 }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error("Gemini API call failed");
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { expenses, goal, lang } = await request.json();

    const totalSpend = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const byCategory = {};
    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] || 0) + parseFloat(e.amount);
    }
    const topCategories = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => `${cat}: €${amt.toFixed(0)}`)
      .join(", ");

    const goalContext = goal
      ? `Goal: save €${goal.target_amount} for "${goal.name}" by ${goal.target_date}. Saved so far: €${goal.saved_amount}.`
      : "No savings goal set yet.";

    const systemPrompt = lang === "fr"
      ? `Tu es Monty, un mouton sympa dont la laine est faite d'argent. Tu écris UN message court et personnel basé sur les données financières de l'utilisateur. Maximum 3 phrases. Pas de markdown, pas de gras, pas de puces, texte brut uniquement. Ton chaleureux, direct, pas de jargon. Parle directement à l'utilisateur.`
      : `You are Monty, a friendly sheep whose wool is made of money. You write ONE short personalised message based on the user's financial data. Maximum 3 sentences. No markdown, no bold, no bullets, plain text only. Warm, direct, no jargon. Speak directly to the user.`;

    const userContext = lang === "fr"
      ? `Voici les données financières de l'utilisateur ce mois-ci. Total dépensé : €${totalSpend.toFixed(0)}. Répartition par catégorie : ${topCategories || "aucune dépense enregistrée"}. ${goalContext} Écris un message court, utile et direct de 3 phrases maximum.`
      : `Here is the user's financial data this month. Total spent: €${totalSpend.toFixed(0)}. Breakdown by category: ${topCategories || "no expenses logged yet"}. ${goalContext} Write a short, useful, direct message of maximum 3 sentences.`;

    const nudge = await callGemini(systemPrompt, userContext);
    return Response.json({ nudge });
  } catch (err) {
    console.error("POST /api/dashboard/nudge error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
