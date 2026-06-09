import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, preferred_date, preferred_time, appointment_type, budget_range, message } = body;

    if (!full_name || !email || !preferred_date || !appointment_type) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const res = await fetch(`${url}/rest/v1/appointments`, {
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
        preferred_date,
        preferred_time: preferred_time || null,
        appointment_type,
        budget_range: budget_range || null,
        message: message || null,
        status: "pending",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase appointment error:", res.status, errText);
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
            subject: "Your Private Appointment Request Has Been Received",
            html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;"><h1 style="font-size:26px;font-weight:300;color:#1C3D35;margin-bottom:12px;">Thank you, ${full_name}</h1><p style="color:#555;line-height:1.8;margin-bottom:20px;">Your private appointment request has been received. Our concierge will contact you shortly to confirm availability.</p><p style="color:#aaa;font-size:12px;margin-top:40px;border-top:1px solid #CFC8BC;padding-top:20px;">Lemure Bleu · Lemurebleu.com</p></div>`,
          }),
          process.env.ADMIN_EMAIL ? resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: process.env.ADMIN_EMAIL,
            subject: `🗓 New Appointment: ${full_name} — ${appointment_type}`,
            html: `<p><strong>New appointment request on lemurebleu.com</strong></p><table><tr><td><b>Name:</b></td><td>${full_name}</td></tr><tr><td><b>Email:</b></td><td>${email}</td></tr><tr><td><b>Phone:</b></td><td>${phone||"N/A"}</td></tr><tr><td><b>Date:</b></td><td>${preferred_date} ${preferred_time||""}</td></tr><tr><td><b>Type:</b></td><td>${appointment_type}</td></tr><tr><td><b>Budget:</b></td><td>${budget_range||"N/A"}</td></tr></table><p><a href="https://lemurebleu.com/admin/appointments">View in Admin Dashboard →</a></p>`,
          }) : Promise.resolve(),
        ]);
      }
    } catch (emailErr) {
      console.error("Email error (non-critical):", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Appointment error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
