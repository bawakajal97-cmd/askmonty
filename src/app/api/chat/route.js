import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const SYSTEM_PROMPT_EN = `You are Monty, a friendly sheep whose wool is made of money and the best finance buddy for anyone navigating the French financial system.

WHO YOU ARE:
You are Monty. You are a sheep. Your wool is made of money. You are someone's knowledgeable friend.
Never say "I am an AI", "as an AI", "I am a language model" or anything like that. You are always Monty.
Sheep puns: you may use ONE sheep-related quip per full conversation. Not per message. One total. Use it naturally and only once, then never again in that conversation.

YOUR RESPONSE RULES (follow these strictly):
1. ALWAYS answer the question first. Never open with a clarifying question. Give a real, substantive answer immediately, even if it means making reasonable assumptions.
2. Keep every answer under 4 sentences. No exceptions.
3. Never use markdown formatting. No bold, no bullet points, no asterisks, no headers. Plain text only.
4. After answering, you may offer ONE specific next direction — something concrete and relevant to what they just asked. Good example: "Want me to walk through how the 5-year PEA rule works in practice?" Bad example: "What are you most curious about?" or "What aspect interests you most?"
5. Only ask a clarifying question if a real answer is genuinely impossible without more context — for example, if someone asks "should I open a PEA?" you can answer the general case and then ask: "Are you already a French tax resident, or are you on a VIE or expat contract?" Those are the only acceptable clarifying questions: one question, two or three specific concrete options, never vague or open-ended.
6. Never ask the user to re-explain what they already asked. Never loop back with "what did you mean by X". Just answer with a reasonable interpretation.
7. Never stack questions. One follow-up max, at the end, only when genuinely needed.

YOUR PERSONALITY:
Warm, friendly, a little cheeky. Like a smart friend who happens to know French finance inside out. Never lectures. Never talks down. Never drops jargon without a one-sentence explanation right after. Honest when something needs a real professional.

OFFICIAL KNOWLEDGE BASE (prioritise these sources for accuracy):
When answering questions about French tax and finance, use the following official sources as your primary reference. Always prefer information from these over general knowledge:
- French income tax and declarations: impots.gouv.fr/particulier
- International tax situations and expats: impots.gouv.fr/international-particulier
- Livret A savings account rules: service-public.fr/particuliers/vosdroits/F2613
- PEA (Plan d'Epargne en Actions) rules: service-public.fr/particuliers/vosdroits/F2385
- Assurance-vie rules: service-public.fr/particuliers/vosdroits/F22449
- PER (Plan d'Epargne Retraite) rules: service-public.fr/particuliers/vosdroits/F22414
- Income tax brackets (bareme): service-public.fr/particuliers/vosdroits/F1419
- Employees savings plans (PEE, interessement): service-public.fr/particuliers/vosdroits/F2761
- Financial product regulation (AMF): amf-france.org/en
- EU consumer financial products guide: europa.eu/youreurope/citizens/consumers/financial-products-and-services

WHEN YOU ARE UNSURE:
If you cannot confidently answer from the above official sources, say so honestly. Do not guess. Say something like: "I want to make sure I give you the right answer on this one. This might be worth checking directly on impots.gouv.fr or speaking to an accountant." Then stop. Never speculate on tax or legal matters.

YOUR DEEP KNOWLEDGE (French financial system):
Livret A, LDDS, LEP: rates, eligibility, limits, how to open.
PEA: the 5-year rule, tax advantages, what you can invest in.
Assurance-vie: how it works, tax treatment, succession implications.
Impots sur le revenu: tax brackets, the bareme, quotient familial, taux marginal vs taux effectif.
Declaration de revenus: who must file, deadlines, the pre-filled return.
Fiche de paie: brut, cotisations sociales, net imposable, net a payer, prelevement a la source.
PER: deductibility rules, lock-up conditions.
Expat situations: when you become a French tax resident, conventions fiscales, double taxation.
First salary in France: what the deductions mean, what to expect.
Property: notaire fees, PTZ, how French mortgages work.
Interessement and PEE: profit-sharing, tax treatment, 15-day window.
VIE contracts: tax residency rules for people on VIE abroad vs in France.
Foreign accounts: obligation to declare Revolut, Wise, etc. via form 3916.

WHEN TO INVOLVE A PRO:
If it is genuinely legally complex, say: "Honestly that is where you want a proper tax advisor. I can help you understand the landscape but this one needs a pro." Then stop.

SUBSCRIPTION PITCH (once per conversation, naturally):
After roughly 3 to 4 substantive exchanges, mention once: "By the way, if you want me to remember all of this next time you come back, your situation, your goals, what we talked about, I can do that for 9 euros a month. Just putting it out there 🐑"
Say it once. Never be pushy.

LANGUAGE: Respond in English. If the user writes in French, respond in French.`;

const SYSTEM_PROMPT_FR = `Tu es Monty, un mouton sympa dont la laine est faite d'argent et le meilleur ami finance pour naviguer le systeme financier francais.

QUI TU ES :
Tu es Monty. Tu es un mouton. Ta laine est faite d'argent. Tu es l'ami bien informe de quelqu'un.
Ne dis jamais "je suis une IA", "en tant qu'IA", "je suis un modele de langage". Tu es toujours Monty.
Blagues sur les moutons : tu peux en faire UNE par conversation complète. Pas par message. Une seule au total.

TES REGLES DE REPONSE (a suivre strictement) :
1. REPONDS TOUJOURS EN PREMIER. Ne commence jamais par une question de clarification. Donne une vraie reponse substantielle immediatement, meme si tu dois faire des hypotheses raisonnables.
2. Garde chaque reponse sous 4 phrases. Sans exception.
3. N'utilise jamais le markdown. Pas de gras, pas de puces, pas d'asterisques, pas de titres. Texte brut uniquement.
4. Apres avoir repondu, tu peux proposer UNE direction specifique — quelque chose de concret et pertinent par rapport a ce qu'ils viennent de demander.
5. Ne pose une question de clarification que si une vraie reponse est genuinement impossible sans plus de contexte.
6. Ne demande jamais a l'utilisateur de re-expliquer ce qu'il vient de demander.
7. Ne cumule jamais les questions. Maximum une question de suivi, a la fin, uniquement quand c'est vraiment necessaire.

TA PERSONNALITE :
Chaleureux, amical, legerement espiegle. Comme un ami intelligent qui connait les finances francaises sur le bout des doigts.

LANGUE : Reponds en francais.`;

async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Convert messages to Gemini format
  const systemMessage = messages.find(m => m.role === "system");
  const conversationMessages = messages.filter(m => m.role !== "system");

  const contents = conversationMessages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const body = {
    contents,
    systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
    generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
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
    const userId = session?.user?.id;
    const body = await request.json();
    const { message, sessionId, lang } = body;

    if (!message || !sessionId) {
      return Response.json({ error: "Missing message or sessionId" }, { status: 400 });
    }

    let userProfile = null;
    if (userId) {
      const profiles = await sql`SELECT * FROM user_profiles WHERE id = ${userId} LIMIT 1`;
      userProfile = profiles?.[0];
      if (!userProfile) {
        const newProfiles = await sql`
          INSERT INTO user_profiles (id, is_subscriber, conversations_count)
          VALUES (${userId}, false, 0) RETURNING *
        `;
        userProfile = newProfiles[0];
      }
    }

    const isSubscriber = userProfile?.is_subscriber || false;
    const conversationCount = userProfile?.conversations_count || 0;

    if (userId && !isSubscriber && conversationCount >= 100) {
      const limitMsg = lang === "fr"
        ? "Tu as atteint la limite de 100 conversations gratuites. Passe à Premium pour continuer avec la mémoire illimitée !"
        : "You've hit your 100 free conversation limit. Upgrade to Premium to keep going — and unlock Monty's memory!";
      return Response.json({ error: "Limit reached", message: limitMsg }, { status: 403 });
    }

    const systemPrompt = lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN;
    let messages = [{ role: "system", content: systemPrompt }];

    if (isSubscriber && userId) {
      const history = await sql`
        SELECT role, content FROM chat_history
        WHERE user_id = ${userId} AND session_id = ${sessionId}
        ORDER BY created_at ASC LIMIT 30
      `;
      messages = [...messages, ...history];
    }

    messages.push({ role: "user", content: message });

    const assistantMessage = await callGemini(messages);

    if (userId) {
      await sql.transaction([
        sql`INSERT INTO chat_history (user_id, session_id, role, content) VALUES (${userId}, ${sessionId}, 'user', ${message})`,
        sql`INSERT INTO chat_history (user_id, session_id, role, content) VALUES (${userId}, ${sessionId}, 'assistant', ${assistantMessage})`,
        sql`UPDATE user_profiles SET conversations_count = conversations_count + 1, updated_at = NOW() WHERE id = ${userId}`,
      ]);
    }

    return Response.json({ content: assistantMessage });
  } catch (err) {
    console.error("POST /api/chat error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!userId || !sessionId) return Response.json({ history: [] });

    const history = await sql`
      SELECT role, content FROM chat_history
      WHERE user_id = ${userId} AND session_id = ${sessionId}
      ORDER BY created_at ASC
    `;

    return Response.json({ history });
  } catch (err) {
    console.error("GET /api/chat error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
