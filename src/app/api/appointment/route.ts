import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, preferred_date, preferred_time, appointment_type, budget_range, message } = body;

    if (!full_name || !email || !preferred_date || !appointment_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("appointments").insert({
      full_name, email, phone: phone || null,
      preferred_date, preferred_time: preferred_time || null,
      appointment_type, budget_range: budget_range || null,
      message: message || null,
      status: "pending",
    });

    if (error) {
      console.error("Appointment insert error:", JSON.stringify(error));
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Lemure Bleu <noreply@lemurebleu.com>",
          to: email,
          subject: "Your Private Appointment Request Has Been Received",
          html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;"><h1 style="font-size:26px;font-weight:300;color:#1C3D35;margin-bottom:12px;">Thank you, ${full_name}</h1><p style="color:#555;line-height:1.8;margin-bottom:20px;">Your private appointment request has been received. Our concierge will contact you shortly to confirm availability.</p><p style="color:#aaa;font-size:12px;margin-top:40px;border-top:1px solid #CFC8BC;padding-top:20px;">Lemure Bleu · Lemurebleu.com</p></div>`,
        });
      }
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Appointment error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
