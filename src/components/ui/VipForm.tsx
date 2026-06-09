"use client";
import { useState } from "react";

export default function VipForm({ dark = false }: { dark?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const f: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 0.85rem",
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 300,
    outline: "none",
    borderRadius: 0,
    WebkitAppearance: "none",
    appearance: "none",
    backgroundColor: dark ? "rgba(255,255,255,0.09)" : "#FFFFFF",
    border: dark ? "1px solid rgba(247,242,232,0.2)" : "1px solid #CFC8BC",
    color: dark ? "#F7F2E8" : "#1C3D35",
    transition: "border-color .2s",
  };

  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: "0.5rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: dark ? "rgba(247,242,232,0.5)" : "#8C857A",
    fontWeight: 400,
    marginBottom: "0.35rem",
    fontFamily: "'Jost', sans-serif",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/vip-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "Submission failed. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
        <div style={{ width: "44px", height: "44px", transform: "rotate(45deg)", border: "1px solid rgba(196,150,90,0.5)", background: "rgba(196,150,90,0.1)", margin: "0 auto 1.5rem", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-45deg)", color: "#C4965A", fontSize: "1.1rem" }}>✓</div>
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 300, color: dark ? "#F7F2E8" : "#1C3D35", marginBottom: "0.75rem" }}>
          Welcome to the Private Circle
        </h3>
        <p style={{ fontSize: "0.82rem", color: dark ? "rgba(247,242,232,0.55)" : "#8C857A", fontWeight: 300, lineHeight: 1.8 }}>
          Your request has been received.<br />Our concierge will contact you shortly.
        </p>
      </div>
    );
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        .vf input::placeholder, .vf textarea::placeholder, .vf select { 
          color: ${dark ? "rgba(247,242,232,0.35)" : "#8C857A"}; 
          font-family: 'Jost', sans-serif;
        }
        .vf input:focus, .vf textarea:focus, .vf select:focus {
          border-color: #C4965A !important;
        }
        .vf select option { 
          background: #1C3D35; 
          color: #F7F2E8; 
        }
      `}</style>

      <div className="vf" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem 1.25rem" }}>

        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Full Name *">
            <input name="full_name" required placeholder="Your full name" style={f} />
          </Field>
        </div>

        <Field label="Email Address *">
          <input name="email" type="email" required placeholder="your@email.com" style={f} />
        </Field>

        <Field label="Phone / WhatsApp *">
          <input name="phone" type="tel" required placeholder="+65 xxxx xxxx" style={f} />
        </Field>

        <Field label="Country *">
          <input name="country" required placeholder="Country of residence" style={f} />
        </Field>

        <Field label="Preferred Contact">
          <select name="preferred_contact" style={{ ...f, cursor: "pointer" }}>
            <option value="">Select method</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </Field>

        <Field label="Interest Type">
          <select name="interest_type" style={{ ...f, cursor: "pointer" }}>
            <option value="">Select interest</option>
            <option value="bespoke">Bespoke Jewellery</option>
            <option value="vip_preorder">VIP Preorder</option>
            <option value="rare_stone">Rare Stone Collection</option>
            <option value="heirloom">Heirloom Redesign</option>
            <option value="private_auction">Private Auction</option>
            <option value="trade">Trade / Consignment</option>
          </select>
        </Field>

        <Field label="Budget Range">
          <select name="budget_range" style={{ ...f, cursor: "pointer" }}>
            <option value="">Select budget</option>
            <option value="below_1k">Below SGD 1,000</option>
            <option value="1k_3k">SGD 1,000 – 3,000</option>
            <option value="3k_10k">SGD 3,000 – 10,000</option>
            <option value="10k_50k">SGD 10,000 – 50,000</option>
            <option value="50k_plus">SGD 50,000+</option>
          </select>
        </Field>

        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Message (optional)">
            <textarea name="message" rows={3} placeholder="Tell us about your interest…" style={{ ...f, resize: "none", display: "block" }} />
          </Field>
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
          <input type="checkbox" name="consent" id="vf_consent" required
            style={{ marginTop: "3px", flexShrink: 0, accentColor: "#C4965A", width: "14px", height: "14px" }} />
          <label htmlFor="vf_consent" style={{ ...lbl, marginBottom: 0, textTransform: "none", letterSpacing: "0.02em", fontSize: "0.7rem", lineHeight: 1.7, cursor: "pointer" }}>
            I consent to receive private-client updates from Lemure Bleu in accordance with the{" "}
            <a href="/privacy-policy" style={{ color: "#C4965A", textDecoration: "underline" }}>Privacy Policy</a>.
          </label>
        </div>

        {error && (
          <div style={{ gridColumn: "1 / -1", padding: "0.75rem 1rem", background: "rgba(139,48,48,0.08)", border: "1px solid rgba(139,48,48,0.25)" }}>
            <p style={{ fontSize: "0.75rem", color: "#8B3030", fontWeight: 300, fontFamily: "'Jost', sans-serif" }}>{error}</p>
          </div>
        )}

        <div style={{ gridColumn: "1 / -1" }}>
          <button type="submit" disabled={loading} style={{
            width: "100%",
            padding: "1rem",
            background: "#C4965A",
            color: "#F7F2E8",
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.65 : 1,
            transition: "all .3s",
            fontWeight: 400,
          }}>
            {loading ? "Submitting…" : "Request VIP Access"}
          </button>
        </div>
      </div>
    </form>
  );
}
