import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, country, preferred_contact, interest_type, budget_range, message } = body;

    if (!full_name || !email || !phone || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("vip_leads").insert({
      full_name,
      email,
      phone,
      country,
      preferred_contact,
      interest_type,
      budget_range,
      message,
      status: "new",
    });

    if (error) throw error;

    // Send notification email via Resend (optional, graceful fail)
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Lemure Blue <noreply@lemurebleu.com>",
        to: email,
        subject: "Your Lemure Blue VIP Request Has Been Received",
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px; background: #F8F3EA;">
            <h1 style="font-size: 28px; font-weight: 300; color: #151515; margin-bottom: 16px;">Welcome, ${full_name}</h1>
            <p style="color: #003F4F; letter-spacing: 0.1em; font-size: 11px; text-transform: uppercase; margin-bottom: 24px;">Lemure Blue · Private Jewellery Maison</p>
            <p style="color: #555; line-height: 1.8; margin-bottom: 24px;">
              Thank you for requesting private access to Lemure Blue. Our concierge will review your request and contact you shortly.
            </p>
            <p style="color: #888; font-size: 12px; margin-top: 40px; border-top: 1px solid #D8D2C8; padding-top: 20px;">
              Lemurebleu.com · Singapore
            </p>
          </div>
        `,
      });

      await resend.emails.send({
        from: "Lemure Blue System <noreply@lemurebleu.com>",
        to: process.env.ADMIN_EMAIL || "admin@lemurebleu.com",
        subject: `New VIP Lead: ${full_name}`,
        html: `<p>New VIP lead: <strong>${full_name}</strong> (${email})<br>Interest: ${interest_type}<br>Budget: ${budget_range}</p>`,
      });
    } catch {
      // Email failure is non-critical
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VIP register error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
