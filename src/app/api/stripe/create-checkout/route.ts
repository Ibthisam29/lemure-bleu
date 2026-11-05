import { NextRequest, NextResponse } from "next/server";
import { getStripe, TIERS } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, phone, preorder_tier, billing } = await req.json();
    const tier = TIERS[preorder_tier];
    if (!tier || !full_name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    const subscription = billing === "monthly";
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://lemurebleu.com";
    const meta = {
      full_name: String(full_name).slice(0, 200),
      phone: String(phone || "").slice(0, 50),
      preorder_tier,
      billing: subscription ? "monthly" : "one_time",
    };

    const session = await getStripe().checkout.sessions.create({
      mode: subscription ? "subscription" : "payment",
      customer_email: email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "sgd",
          unit_amount: tier.amount * 100,
          product_data: { name: `Lemure Bleu — ${tier.label}` },
          ...(subscription ? { recurring: { interval: "month" as const } } : {}),
        },
      }],
      metadata: meta,
      ...(subscription
        ? { subscription_data: { metadata: meta } }
        : { payment_intent_data: { metadata: meta } }),
      success_url: `${origin}/thank-you-preorder?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/preorder-cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[create-checkout]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Payment could not be started. Please contact hello@lemurebleu.com." },
      { status: 500 }
    );
  }
}
