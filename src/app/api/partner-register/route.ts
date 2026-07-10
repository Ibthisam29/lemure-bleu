import { NextRequest, NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabaseConfig";

const JOTFORM_PARTNER_ID = "261891125675060";

async function submitToJotform(formId: string, data: Record<string, string>) {
  try {
    const body = new URLSearchParams();
    // Map our fields → Jotform question names (order-based)
    const map: Record<string, string> = {
      full_name:          "q2_fullName",
      company_name:       "q3_companyBrand",
      role_title:         "q4_roleTitle",
      email:              "q5_email",
      phone:              "q6_mobileWhatsapp",
      website:            "q7_websiteInstagram",
      country_city:       "q8_countryCity",
      partner_category:   "q9_partnerCategory",
      products_services:  "q10_productsOr",
      interest_areas:     "q11_interestAreas",
      gemstones_represented: "q12_whatGemstones",
      has_certification:  "q13_certificationOr",
      price_range:        "q14_estimatedCommercial",
      partnership_model:  "q15_preferredPartnership",
      message:            "q16_shortMessage",
    };
    for (const [k, jKey] of Object.entries(map)) {
      if (data[k]) body.append(`submission[${jKey}]`, data[k]);
    }
    await fetch(`https://api.jotform.com/form/${formId}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "APIKEY": process.env.JOTFORM_API_KEY || "" },
      body: body.toString(),
    });
  } catch (e) {
    console.warn("[partner] Jotform submit failed (non-critical):", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: Record<string, string> = await req.json();
    const { full_name, email, phone, country_city, partner_category } = data;

    if (!full_name || !email || !phone || !country_city || !partner_category) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    // 1. Save to Supabase (primary)
    await supabaseInsert("partners", {
      full_name, email, phone,
      company_name:           data.company_name        || null,
      role_title:             data.role_title           || null,
      website:                data.website              || null,
      country_city,
      partner_category,
      products_services:      data.products_services    || null,
      interest_areas:         data.interest_areas       || null,
      gemstones_represented:  data.gemstones_represented|| null,
      has_certification:      data.has_certification    || null,
      price_range:            data.price_range          || null,
      partnership_model:      data.partnership_model    || null,
      message:                data.message              || null,
      status: "new",
    });

    // 2. Mirror to Jotform (secondary — for their notifications)
    await submitToJotform(JOTFORM_PARTNER_ID, data);

    // 3. Admin email (optional)
    try {
      if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
        const { Resend } = await import("resend");
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: "Lemuré Bleu <noreply@lemurebleu.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `New Partner Registration: ${full_name} — ${partner_category}`,
          html: `<p><b>New partner registration</b><br>Name: ${full_name}<br>Company: ${data.company_name||"—"}<br>Email: ${email}<br>Phone: ${phone}<br>Category: ${partner_category}<br>Country: ${country_city}<br>Interest: ${data.interest_areas||"—"}<br>Model: ${data.partnership_model||"—"}</p><p><a href="https://lemurebleu.com/admin/partners">View in Admin →</a></p>`,
        });
      }
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Submission failed";
    console.error("[partner-register]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
