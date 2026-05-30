"use client";
import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/appointment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch { setError("Something went wrong. Please contact hello@lemurebleu.com"); }
    finally { setLoading(false); }
  }

  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 text-center relative overflow-hidden" style={{ background: "var(--emerald)" }}>
        <div className="container relative z-10">
          <p className="eyebrow mb-6" style={{ color: "rgba(196,150,90,0.8)" }}>Private Consultation</p>
          <h1 className="display mb-2" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", color: "var(--ivory)" }}>Book a Private</h1>
          <h1 className="display-italic mb-8" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", color: "var(--champ-lt)" }}>Appointment</h1>
          <span className="rule-champagne mx-auto block mb-6" style={{ opacity: 0.5 }} />
          <p className="text-sm" style={{ color: "rgba(247,242,232,0.5)", fontWeight: 300 }}>Our concierge confirms within 24 hours.</p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="container">
          <div className="max-w-xl mx-auto">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rotate-45 mx-auto mb-8" style={{ border: "1px solid rgba(196,150,90,0.4)", background: "rgba(196,150,90,0.06)" }}>
                  <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                    <span style={{ color: "var(--champagne)", fontSize: "1.3rem" }}>✓</span>
                  </div>
                </div>
                <h2 className="display text-3xl mb-4" style={{ color: "var(--emerald)" }}>Request Received</h2>
                <p className="text-sm leading-loose" style={{ color: "var(--warm-grey)", fontWeight: 300 }}>
                  Your private appointment request has been received. Our concierge will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input name="full_name" required placeholder="Full Name" className="input-field" />
                  <input name="email" type="email" required placeholder="Email Address" className="input-field" />
                  <input name="phone" type="tel" placeholder="Phone / WhatsApp" className="input-field" />
                  <input name="preferred_date" type="date" required className="input-field" />
                  <input name="preferred_time" type="time" className="input-field" />
                  <select name="appointment_type" required className="input-field" style={{ background: "transparent", cursor: "pointer" }}>
                    <option value="">Appointment Type</option>
                    <option value="bespoke">Bespoke Jewellery</option>
                    <option value="bridal">Bridal Jewellery</option>
                    <option value="gemstone_sourcing">Rare Gemstone Sourcing</option>
                    <option value="heirloom">Heirloom Redesign</option>
                    <option value="vip_preorder">VIP Preorder Consultation</option>
                    <option value="private_auction">Private Auction / Trade</option>
                  </select>
                  <select name="budget_range" required className="input-field" style={{ background: "transparent", cursor: "pointer" }}>
                    <option value="">Budget Range</option>
                    <option value="below_1k">Below SGD 1,000</option>
                    <option value="1k_3k">SGD 1,000 – 3,000</option>
                    <option value="3k_10k">SGD 3,000 – 10,000</option>
                    <option value="10k_50k">SGD 10,000 – 50,000</option>
                    <option value="50k_plus">SGD 50,000+</option>
                  </select>
                </div>
                <textarea name="message" rows={3} placeholder="Tell us about your vision (optional)"
                  className="input-field" style={{ resize: "none", display: "block", width: "100%" }} />
                {error && <p className="text-sm" style={{ color: "#e07070" }}>{error}</p>}
                <button type="submit" disabled={loading} className="btn-gold w-full" style={{ opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Submitting..." : "Request Private Appointment"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
