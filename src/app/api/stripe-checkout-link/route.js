import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import Stripe from "stripe";

const TIER_CONFIG = {
  remembers: {
    name: "Monty Remembers",
    description: "Unlimited conversations with full memory of your situation",
    unit_amount: 900, // €9.00
  },
  manages: {
    name: "Monty Manages",
    description:
      "Full memory plus personal finance dashboard and monthly nudge",
    unit_amount: 1900, // €19.00
  },
};

export const POST = async (request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { redirectURL, tier = "remembers" } = await request.json();
    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.remembers;
    const userId = session.user.id;
    const email = session.user.email;

    // Get or create Stripe customer
    const profiles =
      await sql`SELECT stripe_customer_id FROM user_profiles WHERE id = ${userId} LIMIT 1`;
    let stripeCustomerId = profiles?.[0]?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ email });
      stripeCustomerId = customer.id;
      await sql`UPDATE user_profiles SET stripe_customer_id = ${stripeCustomerId} WHERE id = ${userId}`;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: tierConfig.name,
              description: tierConfig.description,
            },
            recurring: { interval: "month" },
            unit_amount: tierConfig.unit_amount,
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        metadata: { tier },
      },
      success_url: `${redirectURL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: redirectURL,
    });

    return Response.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
