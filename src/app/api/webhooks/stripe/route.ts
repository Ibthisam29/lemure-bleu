import { NextResponse } from "next/server";

// STUB — Stripe webhook not yet configured.
export async function POST() {
  return NextResponse.json({ received: false, note: "Stripe not configured" }, { status: 200 });
}
