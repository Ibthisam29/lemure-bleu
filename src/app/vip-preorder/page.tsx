"use client";
import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const TIERS = [
  {
    id: "blue_entry",
    name: "Blue Entry Allocation",
    price: "SGD 300",
    description:
      "Priority access to entry-level gemstone jewellery preorder. For clients beginning their rare stone journey.",
    features: [
      "Priority waitlist position",
      "Entry-level gemstone allocation",
      "Curated selection preview",
      "Concierge introduction",
    ],
  },
  {
    id: "maison",
    name: "Maison Allocation",
    price: "SGD 1,000",
    description:
      "Priority access to rare gemstone jewellery and bespoke consultation. For discerning collectors.",
    features: [
      "Priority access to rare stones",
      "Bespoke jewellery consultation",
      "Private stone preview session",
      "Dedicated client manager",
      "Certificate of provenance",
    ],
    featured: true,
  },
  {
    id: "legacy",
    name: "Legacy Allocation",
    price: "SGD 3,000",
    description:
      "Priority access to premium rare stones, private sourcing, and bespoke heirloom planning.",
    features: [
      "Premium rare stone priority",
      "Private sourcing service",
      "Bespoke heirloom planning",
      "In-person private viewing",
      "Certificate of authenticity",
      "First refusal on future drops",
    ],
  },
];

export default function VipPreorderPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!selected || !agreed || !form.full_name || !form.email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/preorder-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, preorder_tier: selected }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please contact us directly at hello@lemurebleu.com");
    } finally {
      setLoading(false);
    }
  }

  const selectedTier = TIERS.find(t => t.id === selected);

  if (submitted) {
    return (
      <main>
        <Navigation />
        <section
          className="min-h-screen flex items-center justify-center"
          style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}
        >
          <div className="max-w-xl mx-auto px-6 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 mb-8 mx-auto"
              style={{ border: "1px solid rgba(184,138,114,0.4)", background: "rgba(184,138,114,0.1)" }}
            >
              <span className="heading-display text-xl" style={{ color: "var(--champagne)" }}>✓</span>
            </div>
            <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.9)" }}>Interest Registered</p>
            <h1 className="heading-display mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--ivory)" }}>
              Your Preorder Interest Has Been Received
            </h1>
            <div className="divider-champagne mx-auto mb-8" />
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(248,243,234,0.65)" }}>
              Thank you for your interest in the <strong style={{ color: "var(--champagne)" }}>{selectedTier?.name}</strong>.
              Our concierge will contact you within 48 hours with payment details to confirm your reservation.
            </p>
            <p className="text-xs leading-relaxed mb-10" style={{ color: "rgba(248,243,234,0.4)" }}>
              Payment will be arranged securely once our concierge confirms availability.
              This preorder does not guarantee financial return or gemstone appreciation.
            </p>
            <a href="/" className="btn-outline">Return to Maison</a>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navigation />

      <section
        className="pt-40 pb-20 text-center"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.9)" }}>VIP Preorder</p>
          <h1 className="heading-display mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "var(--ivory)" }}>
            Reserve Priority Access to the
            <br /><em>Lemure Blue Stone Vault</em>
          </h1>
          <div className="divider-champagne mx-auto mb-8" />
          <p className="text-base" style={{ color: "rgba(248,243,234,0.65)" }}>
            Register your interest. Our concierge will contact you to arrange payment securely.
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          {/* Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelected(tier.id)}
                className="relative cursor-pointer transition-all duration-300"
                style={{
                  background: selected === tier.id ? "var(--emerald)" : "var(--ivory)",
                  border: `1px solid ${selected === tier.id ? "var(--champagne)" : tier.featured ? "rgba(184,138,114,0.4)" : "var(--stone)"}`,
                  transform: selected === tier.id ? "translateY(-4px)" : "none",
                  boxShadow: selected === tier.id ? "0 20px 60px rgba(0,63,79,0.3)" : "none",
                }}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 py-2 text-center label-luxury"
                    style={{ background: "var(--champagne)", color: "var(--ivory)", fontSize: "0.55rem" }}>
                    Most Popular
                  </div>
                )}
                <div className={`p-8 ${tier.featured ? "mt-8" : ""}`}>
                  <h3 className="heading-display text-2xl mb-2"
                    style={{ color: selected === tier.id ? "var(--ivory)" : "var(--charcoal)" }}>
                    {tier.name}
                  </h3>
                  <p className="heading-display text-4xl mb-4"
                    style={{ color: selected === tier.id ? "var(--champagne)" : "var(--emerald)" }}>
                    {tier.price}
                  </p>
                  <p className="text-sm leading-relaxed mb-6"
                    style={{ color: selected === tier.id ? "rgba(248,243,234,0.7)" : "rgba(21,21,21,0.6)" }}>
                    {tier.description}
                  </p>
                  <div className="space-y-2">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: selected === tier.id ? "var(--champagne)" : "var(--emerald)" }} />
                        <span className="text-xs"
                          style={{ color: selected === tier.id ? "rgba(248,243,234,0.8)" : "rgba(21,21,21,0.65)" }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form + agreement */}
          <div className="max-w-xl mx-auto">

            {/* How it works banner */}
            <div className="p-5 mb-6 flex items-start gap-4"
              style={{ background: "rgba(0,63,79,0.06)", border: "1px solid rgba(0,63,79,0.15)" }}>
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--emerald)" }} />
              <p className="text-xs leading-relaxed" style={{ color: "rgba(21,21,21,0.65)" }}>
                <strong style={{ color: "var(--emerald)" }}>How this works:</strong> Submit your details below.
                Our concierge will contact you within 48 hours to confirm availability and arrange a secure bank transfer or payment link for your deposit.
              </p>
            </div>

            {/* Contact fields */}
            <div className="space-y-3 mb-6">
              <input
                placeholder="Full Name *"
                value={form.full_name}
                onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                className="input-luxury"
              />
              <input
                placeholder="Email Address *"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-luxury"
              />
              <input
                placeholder="Phone / WhatsApp"
                type="tel"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="input-luxury"
              />
            </div>

            {/* Disclaimer */}
            <div className="p-6 mb-6" style={{ background: "#FBF7F0", border: "1px solid var(--stone)" }}>
              <p className="label-luxury mb-3" style={{ color: "var(--champagne)" }}>Important Disclaimer</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(21,21,21,0.6)" }}>
                Lemure Blue does not guarantee gemstone appreciation, resale value, profit, or investment return.
                Preorders provide priority access to future collectible gemstone or jewellery allocations subject
                to availability, sourcing, quality, and client approval.
              </p>
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3 mb-6">
              <input type="checkbox" id="agree" checked={agreed}
                onChange={e => setAgreed(e.target.checked)} className="mt-1 accent-champagne" />
              <label htmlFor="agree" className="text-xs leading-relaxed cursor-pointer"
                style={{ color: "rgba(21,21,21,0.6)" }}>
                I have read and agree to the{" "}
                <a href="/terms" className="underline">Terms & Conditions</a>,{" "}
                <a href="/refund-policy" className="underline">Refund Policy</a>,
                and understand this preorder does not constitute a financial investment.
              </label>
            </div>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!selected || !agreed || !form.full_name || !form.email || loading}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." :
                !selected ? "Select a Preorder Tier" :
                !form.full_name || !form.email ? "Enter Your Details" :
                !agreed ? "Please Accept Terms" :
                "Register Preorder Interest"}
            </button>

            <p className="text-center text-xs mt-4" style={{ color: "rgba(21,21,21,0.4)" }}>
              Payment arranged by concierge · No card details required now
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
