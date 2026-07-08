import { NextRequest, NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabaseConfig";

const TIERS: Record<string, { label: string; amount: number }> = {
  blue_entry: { label: "Blue Entry Allocation — SGD 300",  amount: 300  },
  maison:     { label: "Maison Allocation — SGD 1,000",    amount: 1000 },
  legacy:     { label: "Legacy Allocation — SGD 3,000",    amount: 3000 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, preorder_tier } = body;

    if (!full_name || !email || !preorder_tier) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const tier = TIERS[preorder_tier] || { label: preorder_tier, amount: 0 };

    await supabaseInsert("preorders", {
      full_name, email,
      phone: phone || null,
      preorder_tier,
      amount: tier.amount,
      currency: "SGD",
      payment_status: "pending_contact",
      allocation_status: "pending",
    });

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const tasks = [
          resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: email,
            subject: "Your VIP Preorder Interest — Lemure Bleu",
            html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;"><h1 style="font-size:26px;font-weight:300;color:#1C3D35;margin-bottom:12px;">Thank you, ${full_name}</h1><p style="color:#555;line-height:1.8;">Your interest in the <strong>${tier.label}</strong> has been received.</p><p style="color:#555;line-height:1.8;">Our concierge will contact you within 48 hours with payment details and next steps.</p><p style="font-size:11px;color:#aaa;margin-top:32px;border-top:1px solid #CFC8BC;padding-top:16px;">This does not constitute a financial guarantee. Lemure Bleu · lemurebleu.com</p></div>`,
          }),
        ];
        if (process.env.ADMIN_EMAIL) {
          tasks.push(resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: process.env.ADMIN_EMAIL,
            subject: `New Preorder: ${full_name} — ${tier.label}`,
            html: `<p><b>New preorder interest</b><br>Name: ${full_name}<br>Email: ${email}<br>Phone: ${phone || "—"}<br>Tier: ${tier.label}</p><p><a href="https://lemurebleu.com/admin/preorders">View in Admin →</a></p>`,
          }));
        }
        await Promise.allSettled(tasks);
      }
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Submission failed";
    console.error("[preorder-interest]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
