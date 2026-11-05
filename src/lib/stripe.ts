import Stripe from "stripe";

export const TIERS: Record<string, { label: string; amount: number }> = {
  blue_entry: { label: "Blue Entry Allocation", amount: 300 },
  maison:     { label: "Maison Allocation",     amount: 1000 },
  legacy:     { label: "Legacy Allocation",     amount: 3000 },
};

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key);
}
