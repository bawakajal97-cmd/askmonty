import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import Stripe from "stripe";

// Derive tier from subscription metadata or unit_amount fallback
function getTierFromSub(sub) {
  if (sub.metadata?.tier) return sub.metadata.tier;
  const amount = sub.items?.data?.[0]?.price?.unit_amount;
  if (amount >= 1900) return "manages";
  if (amount >= 900) return "remembers";
  return "remembers";
}

export const POST = async (request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ status: "unauthenticated" });
  }

  try {
    let forceRefresh = false;
    try {
      const body = await request.json();
      forceRefresh = !!body?.forceRefresh;
    } catch (_) {}

    const userId = session.user.id;
    const rows =
      await sql`SELECT stripe_customer_id, is_subscriber, subscription_tier, updated_at FROM user_profiles WHERE id = ${userId} LIMIT 1`;

    if (rows.length === 0)
      return Response.json({ status: "none", tier: "free" });

    const { stripe_customer_id, is_subscriber, subscription_tier, updated_at } =
      rows[0];

    // Refresh from Stripe if: forced, stale (>1hr), or no cached status
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const isStale = !updated_at || new Date(updated_at) < oneHourAgo;

    if (stripe_customer_id && (isStale || forceRefresh)) {
      const customer = await stripe.customers.retrieve(stripe_customer_id, {
        expand: ["subscriptions"],
      });

      const subs = customer?.subscriptions?.data ?? [];

      // Find highest active subscription (manages > remembers)
      // A sub is "active" if status is active OR (status is active and cancel_at_period_end is true — still valid until period ends)
      const activeSub = subs
        .filter((s) => s.status === "active")
        .sort((a, b) => {
          const tierOrder = { manages: 2, remembers: 1 };
          return (
            (tierOrder[getTierFromSub(b)] ?? 0) -
            (tierOrder[getTierFromSub(a)] ?? 0)
          );
        })[0];

      const isActive = !!activeSub;
      const detectedTier = isActive ? getTierFromSub(activeSub) : "free";

      await sql`
        UPDATE user_profiles
        SET is_subscriber = ${isActive},
            subscription_tier = ${detectedTier},
            updated_at = NOW()
        WHERE id = ${userId}
      `;

      return Response.json({
        status: isActive ? "active" : "none",
        tier: detectedTier,
      });
    }

    return Response.json({
      status: is_subscriber ? "active" : "none",
      tier: subscription_tier || "free",
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
