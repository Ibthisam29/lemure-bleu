import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, preferred_date, preferred_time, appointment_type, budget_range, message } = body;

    if (!full_name || !email || !preferred_date || !appointment_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("appointments").insert({
      full_name,
      email,
      phone,
      preferred_date,
      preferred_time,
      appointment_type,
      budget_range,
      message,
      status: "pending",
    });

    if (error) throw error;

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Lemure Bleu <noreply@lemurebleu.com>",
        to: email,
        subject: "Your Private Appointment Request Has Been Received",
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px; background: #F8F3EA;">
            <h1 style="font-size: 28px; font-weight: 300; color: #151515; margin-bottom: 16px;">Thank you, ${full_name}</h1>
            <p style="color: #555; line-height: 1.8; margin-bottom: 24px;">
              Your private appointment request has been received. Our concierge will contact you shortly to confirm availability.
            </p>
            <p style="color: #888; font-size: 12px; margin-top: 40px; border-top: 1px solid #D8D2C8; padding-top: 20px;">
              Lemure Bleu · Lemurebleu.com
            </p>
          </div>
        `,
      });
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Appointment error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
