import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import Stripe from "stripe";

export const POST = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const rows =
      await sql`SELECT stripe_customer_id FROM user_profiles WHERE id = ${userId} LIMIT 1`;

    if (!rows.length || !rows[0].stripe_customer_id) {
      return Response.json({ error: "No subscription found" }, { status: 404 });
    }

    const stripeCustomerId = rows[0].stripe_customer_id;

    // Retrieve the customer with their active subscriptions
    const customer = await stripe.customers.retrieve(stripeCustomerId, {
      expand: ["subscriptions"],
    });

    const activeSub = customer?.subscriptions?.data?.find(
      (s) => s.status === "active",
    );

    if (!activeSub) {
      return Response.json(
        { error: "No active subscription" },
        { status: 404 },
      );
    }

    // Cancel at period end — user keeps access until billing cycle ends
    const updated = await stripe.subscriptions.update(activeSub.id, {
      cancel_at_period_end: true,
    });

    // Mark in DB that cancellation is scheduled; keep is_subscriber true until period ends
    await sql`
      UPDATE user_profiles
      SET updated_at = NOW()
      WHERE id = ${userId}
    `;

    const cancelDate = new Date(updated.cancel_at * 1000).toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "long", year: "numeric" },
    );

    return Response.json({ success: true, cancelDate });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
