import { NextResponse } from "next/server";

// STUB — Stripe not yet configured.
// Replace this file once STRIPE_SECRET_KEY is set in environment.
export async function POST() {
  return NextResponse.json(
    { error: "Payment processing not yet configured. Please contact hello@lemurebleu.com to arrange your deposit." },
    { status: 503 }
  );
}
