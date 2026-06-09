import { NextRequest, NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabaseConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, preorder_tier } = body;

    if (!full_name || !email || !preorder_tier) {
      return NextResponse.json({ error: "Please fill in Name, Email and select a tier." }, { status: 400 });
    }

    const amounts: Record<string, number> = { blue_entry: 300, maison: 1000, legacy: 3000 };
    const tierLabels: Record<string, string> = {
      blue_entry: "Blue Entry Allocation — SGD 300",
      maison: "Maison Allocation — SGD 1,000",
      legacy: "Legacy Allocation — SGD 3,000",
    };

    await supabaseInsert("preorders", {
      full_name, email,
      phone: phone || null,
      preorder_tier,
      amount: amounts[preorder_tier] || 0,
      currency: "SGD",
      payment_status: "pending_contact",
      allocation_status: "pending",
    });

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const promises = [
          resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: email,
            subject: "Your Lemure Bleu VIP Preorder Has Been Received",
            html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;"><h1 style="font-size:26px;font-weight:300;color:#1C3D35;margin-bottom:12px;">Thank you, ${full_name}</h1><p style="color:#555;line-height:1.8;margin-bottom:16px;">Your preorder interest for the <strong>${tierLabels[preorder_tier]}</strong> has been received.</p><p style="color:#555;line-height:1.8;">Our concierge will contact you within 48 hours with payment details.</p><p style="color:#aaa;font-size:11px;margin-top:40px;border-top:1px solid #CFC8BC;padding-top:16px;">This does not guarantee financial return or gemstone appreciation.</p></div>`,
          }),
        ];
        if (process.env.ADMIN_EMAIL) {
          promises.push(resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: process.env.ADMIN_EMAIL,
            subject: `New Preorder: ${full_name} — ${tierLabels[preorder_tier]}`,
            html: `<p><b>New preorder on lemurebleu.com</b></p><p>Name: ${full_name}<br>Email: ${email}<br>Phone: ${phone||"N/A"}<br>Tier: ${tierLabels[preorder_tier]}</p><p><a href="https://lemurebleu.com/admin/preorders">View in Admin →</a></p>`,
          }));
        }
        await Promise.allSettled(promises);
      }
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Preorder error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to save: ${msg}` }, { status: 500 });
  }
}
