import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, preorder_tier } = body;

    if (!full_name || !email || !preorder_tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("preorders").insert({
      full_name,
      email,
      phone: phone || null,
      preorder_tier,
      amount: preorder_tier === "blue_entry" ? 300 : preorder_tier === "maison" ? 1000 : 3000,
      currency: "SGD",
      payment_status: "pending_contact",
      allocation_status: "pending",
    });

    if (error) throw error;

    const tierLabels: Record<string, string> = {
      blue_entry: "Blue Entry Allocation — SGD 300",
      maison: "Maison Allocation — SGD 1,000",
      legacy: "Legacy Allocation — SGD 3,000",
    };

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Lemure Bleu <noreply@lemurebleu.com>",
        to: email,
        subject: "Your Lemure Bleu VIP Preorder Interest Has Been Received",
        html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F8F3EA;"><h1 style="font-size:28px;font-weight:300;color:#151515;margin-bottom:16px;">Thank you, ${full_name}</h1><p style="color:#555;line-height:1.8;margin-bottom:16px;">Your preorder interest for the <strong>${tierLabels[preorder_tier]}</strong> has been received.</p><p style="color:#555;line-height:1.8;margin-bottom:24px;">Our concierge will contact you within 48 hours to confirm availability and provide payment details.</p><p style="color:#888;font-size:11px;margin-top:40px;border-top:1px solid #D8D2C8;padding-top:20px;">This registration does not guarantee financial return or gemstone appreciation.</p><p style="color:#888;font-size:12px;margin-top:12px;">Lemure Bleu · Lemurebleu.com</p></div>`,
      });
      await resend.emails.send({
        from: "Lemure Bleu System <noreply@lemurebleu.com>",
        to: process.env.ADMIN_EMAIL || "admin@lemurebleu.com",
        subject: `New Preorder Interest: ${full_name} — ${tierLabels[preorder_tier]}`,
        html: `<p>New preorder interest:<br><strong>Name:</strong> ${full_name}<br><strong>Email:</strong> ${email}<br><strong>Phone:</strong> ${phone || "Not provided"}<br><strong>Tier:</strong> ${tierLabels[preorder_tier]}</p><p>Contact this client to arrange payment.</p>`,
      });
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Preorder interest error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
