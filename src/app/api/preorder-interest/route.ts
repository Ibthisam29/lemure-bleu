import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, preorder_tier } = body;

    if (!full_name || !email || !preorder_tier) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const amounts: Record<string, number> = { blue_entry: 300, maison: 1000, legacy: 3000 };
    const tierLabels: Record<string, string> = {
      blue_entry: "Blue Entry Allocation — SGD 300",
      maison: "Maison Allocation — SGD 1,000",
      legacy: "Legacy Allocation — SGD 3,000",
    };

    const res = await fetch(`${url}/rest/v1/preorders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        full_name,
        email,
        phone: phone || null,
        preorder_tier,
        amount: amounts[preorder_tier] || 0,
        currency: "SGD",
        payment_status: "pending_contact",
        allocation_status: "pending",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase preorder error:", res.status, errText);
      return NextResponse.json({ error: "Failed to save your request. Please try again." }, { status: 500 });
    }

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await Promise.all([
          resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: email,
            subject: "Your Lemure Bleu VIP Preorder Interest Has Been Received",
            html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;"><h1 style="font-size:26px;font-weight:300;color:#1C3D35;margin-bottom:12px;">Thank you, ${full_name}</h1><p style="color:#555;line-height:1.8;margin-bottom:16px;">Your preorder interest for the <strong>${tierLabels[preorder_tier]}</strong> has been received.</p><p style="color:#555;line-height:1.8;margin-bottom:20px;">Our concierge will contact you within 48 hours with payment details.</p><p style="color:#aaa;font-size:11px;margin-top:40px;border-top:1px solid #CFC8BC;padding-top:16px;">This does not guarantee financial return or gemstone appreciation. Lemure Bleu · Lemurebleu.com</p></div>`,
          }),
          process.env.ADMIN_EMAIL ? resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: process.env.ADMIN_EMAIL,
            subject: `💎 New Preorder: ${full_name} — ${tierLabels[preorder_tier]}`,
            html: `<p><strong>New preorder interest on lemurebleu.com</strong></p><table><tr><td><b>Name:</b></td><td>${full_name}</td></tr><tr><td><b>Email:</b></td><td>${email}</td></tr><tr><td><b>Phone:</b></td><td>${phone||"N/A"}</td></tr><tr><td><b>Tier:</b></td><td>${tierLabels[preorder_tier]}</td></tr></table><p><a href="https://lemurebleu.com/admin/preorders">View in Admin Dashboard →</a></p>`,
          }) : Promise.resolve(),
        ]);
      }
    } catch (emailErr) {
      console.error("Email error (non-critical):", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Preorder error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
