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
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please contact us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Navigation />

      <section
        className="pt-40 pb-20 text-center"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.9)" }}>
            Private Consultation
          </p>
          <h1
            className="heading-display mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "var(--ivory)" }}
          >
            Book a Private
            <br />
            <em>Appointment</em>
          </h1>
          <div className="divider-champagne mx-auto mb-6" />
          <p style={{ color: "rgba(248,243,234,0.65)" }} className="text-sm">
            Our concierge will confirm your appointment within 24 hours.
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-2xl mx-auto px-6 lg:px-12">
          {submitted ? (
            <div className="text-center py-16">
              <div className="divider-champagne mx-auto mb-8" />
              <h2 className="heading-display text-3xl mb-4" style={{ color: "var(--charcoal)" }}>
                Request Received
              </h2>
              <p style={{ color: "rgba(21,21,21,0.6)" }} className="text-sm leading-relaxed">
                Your private appointment request has been received. Our concierge will contact you shortly to confirm availability.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="full_name" required placeholder="Full Name" className="input-luxury" />
              <input name="email" type="email" required placeholder="Email Address" className="input-luxury" />
              <input name="phone" type="tel" required placeholder="Phone / WhatsApp" className="input-luxury" />
              <input name="preferred_date" type="date" required className="input-luxury" />
              <input name="preferred_time" type="time" className="input-luxury" />

              <select name="appointment_type" required className="input-luxury">
                <option value="">Appointment Type</option>
                <option value="bespoke">Bespoke Jewellery Consultation</option>
                <option value="bridal">Bridal Jewellery Consultation</option>
                <option value="gemstone_sourcing">Rare Gemstone Sourcing</option>
                <option value="heirloom">Heirloom Redesign</option>
                <option value="vip_preorder">VIP Preorder Consultation</option>
                <option value="private_auction">Private Auction / Trade</option>
              </select>

              <select name="budget_range" required className="input-luxury">
                <option value="">Budget Range</option>
                <option value="below_1k">Below SGD 1,000</option>
                <option value="1k_3k">SGD 1,000 – 3,000</option>
                <option value="3k_10k">SGD 3,000 – 10,000</option>
                <option value="10k_50k">SGD 10,000 – 50,000</option>
                <option value="50k_plus">SGD 50,000+</option>
              </select>

              <textarea
                name="message"
                rows={4}
                placeholder="Tell us about your vision (optional)"
                className="input-luxury md:col-span-2 resize-none"
              />

              {error && <p className="md:col-span-2 text-sm text-red-500">{error}</p>}

              <div className="md:col-span-2">
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Submitting..." : "Request Private Appointment"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
