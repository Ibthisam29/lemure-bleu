"use client";
import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const f: React.CSSProperties = {
  width: "100%", padding: "0.75rem 0.85rem",
  fontFamily: "'Jost',sans-serif", fontSize: "0.82rem", fontWeight: 300,
  outline: "none", borderRadius: 0, WebkitAppearance: "none",
  backgroundColor: "#FFFFFF", border: "1px solid #CFC8BC", color: "#1C3D35",
  transition: "border-color .2s",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "0.5rem", letterSpacing: "0.18em",
  textTransform: "uppercase", color: "#8C857A", fontWeight: 400,
  marginBottom: "0.35rem", fontFamily: "'Jost',sans-serif",
};
const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label style={lbl}>{label}</label>{children}</div>
);

export default function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || json.error) { setError(json.error || "Submission failed. Please try again."); return; }
      setSubmitted(true);
    } catch { setError("Network error. Please check your connection and try again."); }
    finally { setLoading(false); }
  }

  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 text-center relative overflow-hidden" style={{ background: "linear-gradient(160deg,#1C3D35 0%,#0D2020 100%)" }}>
        <div className="container relative z-10">
          <p className="eyebrow mb-6" style={{ color: "rgba(196,150,90,0.8)" }}>Private Consultation</p>
          <h1 className="display mb-2" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", color: "#F7F2E8" }}>Book a Private</h1>
          <h1 className="display-italic mb-8" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", color: "#D4AA7A" }}>Appointment</h1>
          <span className="rule-champagne mx-auto block mb-6" style={{ opacity: 0.5 }} />
          <p style={{ color: "rgba(247,242,232,0.5)", fontSize: "0.82rem", fontWeight: 300 }}>Our concierge confirms within 24 hours.</p>
        </div>
      </section>

      <section className="section" style={{ background: "#EDE6D6" }}>
        <div className="container" style={{ maxWidth: "640px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", background: "#FFFFFF", border: "1px solid #CFC8BC" }}>
              <div style={{ width: "48px", height: "48px", transform: "rotate(45deg)", border: "1px solid rgba(196,150,90,0.4)", background: "rgba(196,150,90,0.06)", margin: "0 auto 1.5rem", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-45deg)", color: "#C4965A", fontSize: "1.3rem" }}>✓</div>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", fontWeight: 300, color: "#1C3D35", marginBottom: "0.75rem" }}>Request Received</h2>
              <p style={{ fontSize: "0.82rem", color: "#8C857A", fontWeight: 300, lineHeight: 1.8 }}>
                Your private appointment request has been received.<br />Our concierge will contact you shortly.
              </p>
            </div>
          ) : (
            <div style={{ background: "#FFFFFF", border: "1px solid #CFC8BC", padding: "2.5rem" }}>
              <form onSubmit={handleSubmit}>
                <style>{`.af input:focus,.af textarea:focus,.af select:focus{border-color:#C4965A!important}.af select option{background:#1C3D35;color:#F7F2E8}`}</style>
                <div className="af" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

                  <F label="Full Name *"><input name="full_name" required placeholder="Your full name" style={f} /></F>
                  <F label="Email Address *"><input name="email" type="email" required placeholder="your@email.com" style={f} /></F>
                  <F label="Phone / WhatsApp"><input name="phone" type="tel" placeholder="+65 xxxx xxxx" style={f} /></F>
                  <F label="Preferred Date *"><input name="preferred_date" type="date" required style={f} /></F>
                  <F label="Preferred Time">
                    <select name="preferred_time" style={{ ...f, cursor: "pointer" }}>
                      <option value="">Any time</option>
                      {["10:00","11:00","12:00","14:00","15:00","16:00","17:00"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </F>
                  <F label="Appointment Type *">
                    <select name="appointment_type" required style={{ ...f, cursor: "pointer" }}>
                      <option value="">Select type</option>
                      <option value="bespoke">Bespoke Jewellery</option>
                      <option value="bridal">Bridal Jewellery</option>
                      <option value="gemstone_sourcing">Rare Gemstone Sourcing</option>
                      <option value="heirloom">Heirloom Redesign</option>
                      <option value="vip_preorder">VIP Preorder Consultation</option>
                      <option value="private_auction">Private Auction / Trade</option>
                    </select>
                  </F>
                  <F label="Budget Range">
                    <select name="budget_range" style={{ ...f, cursor: "pointer" }}>
                      <option value="">Select budget</option>
                      <option value="below_1k">Below SGD 1,000</option>
                      <option value="1k_3k">SGD 1,000 – 3,000</option>
                      <option value="3k_10k">SGD 3,000 – 10,000</option>
                      <option value="10k_50k">SGD 10,000 – 50,000</option>
                      <option value="50k_plus">SGD 50,000+</option>
                    </select>
                  </F>
                  <div style={{ gridColumn: "1/-1" }}>
                    <F label="Message (optional)">
                      <textarea name="message" rows={3} placeholder="Tell us about your vision…" style={{ ...f, resize: "none", display: "block" }} />
                    </F>
                  </div>

                  {error && (
                    <div style={{ gridColumn: "1/-1", padding: "0.75rem 1rem", background: "rgba(139,48,48,0.08)", border: "1px solid rgba(139,48,48,0.25)" }}>
                      <p style={{ fontSize: "0.75rem", color: "#8B3030", fontWeight: 300, fontFamily: "'Jost',sans-serif" }}>{error}</p>
                    </div>
                  )}

                  <div style={{ gridColumn: "1/-1" }}>
                    <button type="submit" disabled={loading} style={{
                      width: "100%", padding: "1rem", background: "#C4965A", color: "#F7F2E8",
                      fontFamily: "'Jost',sans-serif", fontSize: "0.62rem", letterSpacing: "0.25em",
                      textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.65 : 1, fontWeight: 400,
                    }}>
                      {loading ? "Submitting…" : "Request Private Appointment"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
