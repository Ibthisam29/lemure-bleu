import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, TIERS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function record(row: {
  full_name: string; email: string; phone?: string; tier: string;
  amount: number; customer?: string | null; intent?: string | null; session?: string | null;
}) {
  const db = createAdminClient();
  // idempotency: skip if this payment already recorded
  const key = row.intent ? ["stripe_payment_intent_id", row.intent] : ["stripe_checkout_session_id", row.session];
  if (key[1]) {
    const { data } = await db.from("preorders").select("id").eq(key[0] as string, key[1] as string).limit(1);
    if (data && data.length) return;
  }
  const { error } = await db.from("preorders").insert({
    full_name: row.full_name, email: row.email, phone: row.phone || null,
    preorder_tier: row.tier, amount: row.amount, currency: "SGD",
    payment_status: "paid", allocation_status: "pending",
    stripe_customer_id: row.customer || null,
    stripe_payment_intent_id: row.intent || null,
    stripe_checkout_session_id: row.session || null,
  });
  if (error) throw new Error(error.message);
}

async function email(to: string, name: string, tier: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const tasks = [resend.emails.send({
      from: "Lemure Bleu <noreply@lemurebleu.com>", to,
      subject: "Payment Confirmed — Lemure Bleu",
      html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;"><h1 style="font-size:26px;font-weight:300;color:#1C3D35;">Thank you, ${name}</h1><p style="color:#555;line-height:1.8;">Your payment for the <strong>${tier}</strong> is confirmed. Our concierge will contact you within 48 hours.</p></div>`,
    })];
    if (process.env.ADMIN_EMAIL) tasks.push(resend.emails.send({
      from: "Lemure Bleu <noreply@lemurebleu.com>", to: process.env.ADMIN_EMAIL,
      subject: `Payment received: ${name} — ${tier}`,
      html: `<p>${name} (${to}) paid for ${tier}. <a href="https://lemurebleu.com/admin/preorders">View in Admin</a></p>`,
    }));
    await Promise.allSettled(tasks);
  } catch { /* non-critical */ }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "Not configured" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.payment_status === "paid" || s.mode === "subscription") {
        const m = s.metadata || {};
        const tier = TIERS[m.preorder_tier || ""];
        const intent = typeof s.payment_intent === "string" ? s.payment_intent : null;
        await record({
          full_name: m.full_name || s.customer_details?.name || "Customer",
          email: s.customer_details?.email || s.customer_email || "",
          phone: m.phone, tier: m.preorder_tier || "unknown",
          amount: (s.amount_total ?? 0) / 100,
          customer: typeof s.customer === "string" ? s.customer : null,
          intent, session: intent ? null : s.id,
        });
        await email(s.customer_details?.email || s.customer_email || "", m.full_name || "", tier?.label || "Allocation");
      }
    } else if (event.type === "invoice.paid") {
      // subscription renewals only (first invoice handled by checkout.session.completed)
      const inv = event.data.object as Stripe.Invoice;
      if (inv.billing_reason === "subscription_cycle") {
        const m = inv.subscription_details?.metadata || {};
        await record({
          full_name: m.full_name || inv.customer_name || "Customer",
          email: inv.customer_email || "", phone: m.phone,
          tier: m.preorder_tier || "unknown", amount: (inv.amount_paid ?? 0) / 100,
          customer: typeof inv.customer === "string" ? inv.customer : null,
          intent: null, session: `inv_${inv.id}`,
        });
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe-webhook]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
