import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

function generateCode(userId) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  // deterministic-ish from userId but also add some randomness
  const base = userId
    .toString()
    .replace(/-/g, "")
    .substring(0, 6)
    .toUpperCase();
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `MONTY-${base.substring(0, 4)}${suffix}`.toUpperCase();
}

// GET — fetch or create referral code for current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Ensure profile exists
    const profiles =
      await sql`SELECT * FROM user_profiles WHERE id = ${userId} LIMIT 1`;
    let profile = profiles?.[0];

    if (!profile) {
      const inserted = await sql`
        INSERT INTO user_profiles (id, is_subscriber, conversations_count)
        VALUES (${userId}, false, 0) RETURNING *
      `;
      profile = inserted[0];
    }

    if (profile.referral_code) {
      return Response.json({
        code: profile.referral_code,
        referral_count: profile.referral_count || 0,
      });
    }

    // Generate a unique referral code
    let code = generateCode(userId);
    let attempts = 0;
    while (attempts < 5) {
      try {
        await sql`UPDATE user_profiles SET referral_code = ${code} WHERE id = ${userId}`;
        break;
      } catch (_) {
        code = generateCode(userId);
        attempts++;
      }
    }

    return Response.json({ code, referral_count: 0 });
  } catch (err) {
    console.error("GET /api/referral error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST — apply a referral code at signup
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code)
      return Response.json({ error: "No code provided" }, { status: 400 });

    const userId = session.user.id;
    const cleanCode = code.trim().toUpperCase();

    // Find the referrer
    const referrers =
      await sql`SELECT id FROM user_profiles WHERE referral_code = ${cleanCode} LIMIT 1`;
    if (!referrers.length) {
      return Response.json({ error: "Invalid referral code" }, { status: 404 });
    }

    const referrerId = referrers[0].id;
    if (referrerId === userId) {
      return Response.json({ error: "Cannot refer yourself" }, { status: 400 });
    }

    // Check user hasn't already used a referral code
    const userProfile =
      await sql`SELECT referred_by FROM user_profiles WHERE id = ${userId} LIMIT 1`;
    if (userProfile?.[0]?.referred_by) {
      return Response.json(
        { error: "Already used a referral code" },
        { status: 400 },
      );
    }

    // Apply referral
    await sql.transaction([
      sql`UPDATE user_profiles SET referred_by = ${cleanCode} WHERE id = ${userId}`,
      sql`UPDATE user_profiles SET referral_count = COALESCE(referral_count, 0) + 1 WHERE id = ${referrerId}`,
    ]);

    return Response.json({ success: true });
  } catch (err) {
    console.error("POST /api/referral error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
