import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, country, preferred_contact, interest_type, budget_range, message } = body;

    if (!full_name || !email || !phone || !country) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error("Missing Supabase env vars");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    // Direct REST API call — bypasses any RLS/client issues
    const res = await fetch(`${url}/rest/v1/vip_leads`, {
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
        phone,
        country,
        preferred_contact: preferred_contact || null,
        interest_type: interest_type || null,
        budget_range: budget_range || null,
        message: message || null,
        status: "new",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase REST error:", res.status, errText);
      return NextResponse.json({ error: "Failed to save your request. Please try again." }, { status: 500 });
    }

    // Email — graceful fail, never blocks success
    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await Promise.all([
          resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: email,
            subject: "Your Lemure Bleu VIP Request Has Been Received",
            html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;"><h1 style="font-size:26px;font-weight:300;color:#1C3D35;margin-bottom:12px;">Welcome, ${full_name}</h1><p style="color:#C4965A;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:20px;">Lemure Bleu · Private Jewellery Maison</p><p style="color:#555;line-height:1.8;margin-bottom:20px;">Thank you for requesting private access. Our concierge will review your request and contact you shortly.</p><p style="color:#aaa;font-size:12px;margin-top:40px;border-top:1px solid #CFC8BC;padding-top:20px;">Lemurebleu.com · Singapore</p></div>`,
          }),
          process.env.ADMIN_EMAIL ? resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: process.env.ADMIN_EMAIL,
            subject: `🔔 New VIP Lead: ${full_name}`,
            html: `<p><strong>New VIP lead submitted on lemurebleu.com</strong></p><table><tr><td><b>Name:</b></td><td>${full_name}</td></tr><tr><td><b>Email:</b></td><td>${email}</td></tr><tr><td><b>Phone:</b></td><td>${phone}</td></tr><tr><td><b>Country:</b></td><td>${country}</td></tr><tr><td><b>Interest:</b></td><td>${interest_type}</td></tr><tr><td><b>Budget:</b></td><td>${budget_range}</td></tr></table><p><a href="https://lemurebleu.com/admin/leads">View in Admin Dashboard →</a></p>`,
          }) : Promise.resolve(),
        ]);
      }
    } catch (emailErr) {
      console.error("Email error (non-critical):", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VIP register error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
