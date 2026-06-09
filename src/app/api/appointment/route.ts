import { NextRequest, NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabaseConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, preferred_date, preferred_time, appointment_type, budget_range, message } = body;

    if (!full_name || !email || !preferred_date || !appointment_type) {
      return NextResponse.json({ error: "Please fill in Name, Email, Date and Appointment Type." }, { status: 400 });
    }

    await supabaseInsert("appointments", {
      full_name, email,
      phone: phone || null,
      preferred_date,
      preferred_time: preferred_time || null,
      appointment_type,
      budget_range: budget_range || null,
      message: message || null,
      status: "pending",
    });

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const promises = [
          resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: email,
            subject: "Your Private Appointment Request Has Been Received",
            html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;"><h1 style="font-size:26px;font-weight:300;color:#1C3D35;margin-bottom:12px;">Thank you, ${full_name}</h1><p style="color:#555;line-height:1.8;">Your private appointment request has been received. Our concierge will contact you shortly to confirm.</p><p style="color:#aaa;font-size:12px;margin-top:40px;border-top:1px solid #CFC8BC;padding-top:20px;">Lemure Bleu · Lemurebleu.com</p></div>`,
          }),
        ];
        if (process.env.ADMIN_EMAIL) {
          promises.push(resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: process.env.ADMIN_EMAIL,
            subject: `New Appointment: ${full_name} — ${appointment_type}`,
            html: `<p><b>New appointment on lemurebleu.com</b></p><p>Name: ${full_name}<br>Email: ${email}<br>Phone: ${phone||"N/A"}<br>Date: ${preferred_date} ${preferred_time||""}<br>Type: ${appointment_type}<br>Budget: ${budget_range||"N/A"}</p><p><a href="https://lemurebleu.com/admin/appointments">View in Admin →</a></p>`,
          }));
        }
        await Promise.allSettled(promises);
      }
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Appointment error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to save: ${msg}` }, { status: 500 });
  }
}
