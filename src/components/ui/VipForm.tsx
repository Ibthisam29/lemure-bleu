"use client";
import { useState } from "react";

export default function VipForm({ dark = false }: { dark?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Styles based on dark/light context
  const fieldBase: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 0.75rem",
    fontFamily: "Jost, sans-serif",
    fontSize: "0.83rem",
    fontWeight: 300,
    outline: "none",
    transition: "border-color 0.25s",
    borderRadius: 0,
    WebkitAppearance: "none",
    appearance: "none",
  };

  const lightField: React.CSSProperties = {
    ...fieldBase,
    background: "var(--ivory)",
    border: "1px solid var(--stone)",
    color: "var(--emerald)",
  };

  const darkField: React.CSSProperties = {
    ...fieldBase,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(247,242,232,0.18)",
    color: "var(--ivory)",
  };

  const f = dark ? darkField : lightField;
  const placeholderColor = dark ? "rgba(247,242,232,0.38)" : "var(--warm-grey)";

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.52rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: dark ? "rgba(247,242,232,0.45)" : "var(--warm-grey)",
    fontWeight: 300,
    marginBottom: "0.4rem",
    fontFamily: "Jost, sans-serif",
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
      if (!res.ok) throw new Error(json.error || "Failed");
      setSubmitted(true);
    } catch (err) {
      setError("Submission failed. Please email hello@lemurebleu.com directly.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <div style={{ width: "48px", height: "48px", transform: "rotate(45deg)", border: "1px solid rgba(196,150,90,0.5)", background: "rgba(196,150,90,0.1)", margin: "0 auto 1.5rem", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-45deg)", color: "var(--champagne)", fontSize: "1.1rem" }}>✓</div>
        </div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem", fontWeight: 300, color: dark ? "var(--ivory)" : "var(--emerald)", marginBottom: "0.75rem" }}>
          Welcome to the Private Circle
        </h3>
        <p style={{ fontSize: "0.82rem", color: dark ? "rgba(247,242,232,0.55)" : "var(--warm-grey)", fontWeight: 300, lineHeight: 1.8 }}>
          Your request has been received.<br />Our concierge will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        .vf-input::placeholder { color: ${placeholderColor}; }
        .vf-input option { background: #1C3D35; color: #F7F2E8; }
        .vf-input:focus { border-color: var(--champagne) !important; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem 1.5rem" }}>
        {/* Full name */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Full Name *</label>
          <input name="full_name" required placeholder="Your full name" className="vf-input" style={f} />
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email *</label>
          <input name="email" type="email" required placeholder="your@email.com" className="vf-input" style={f} />
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}>Phone / WhatsApp *</label>
          <input name="phone" type="tel" required placeholder="+65 xxxx xxxx" className="vf-input" style={f} />
        </div>

        {/* Country */}
        <div>
          <label style={labelStyle}>Country *</label>
          <input name="country" required placeholder="Country of residence" className="vf-input" style={f} />
        </div>

        {/* Preferred contact */}
        <div>
          <label style={labelStyle}>Preferred Contact</label>
          <select name="preferred_contact" className="vf-input" style={{ ...f, cursor: "pointer" }}>
            <option value="">Select method</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        {/* Interest type */}
        <div>
          <label style={labelStyle}>Interest Type</label>
          <select name="interest_type" className="vf-input" style={{ ...f, cursor: "pointer" }}>
            <option value="">Select interest</option>
            <option value="bespoke">Bespoke Jewellery</option>
            <option value="vip_preorder">VIP Preorder</option>
            <option value="rare_stone">Rare Stone Collection</option>
            <option value="heirloom">Heirloom Redesign</option>
            <option value="private_auction">Private Auction</option>
            <option value="trade">Trade / Consignment</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label style={labelStyle}>Budget Range</label>
          <select name="budget_range" className="vf-input" style={{ ...f, cursor: "pointer" }}>
            <option value="">Select budget</option>
            <option value="below_1k">Below SGD 1,000</option>
            <option value="1k_3k">SGD 1,000 – 3,000</option>
            <option value="3k_10k">SGD 3,000 – 10,000</option>
            <option value="10k_50k">SGD 10,000 – 50,000</option>
            <option value="50k_plus">SGD 50,000+</option>
          </select>
        </div>

        {/* Message */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Message (optional)</label>
          <textarea name="message" rows={3} placeholder="Tell us about your interest..." className="vf-input"
            style={{ ...f, resize: "none", display: "block" }} />
        </div>

        {/* Consent */}
        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <input type="checkbox" name="consent" id="vf_consent" required
            style={{ marginTop: "3px", flexShrink: 0, accentColor: "var(--champagne)", width: "14px", height: "14px" }} />
          <label htmlFor="vf_consent" style={{ ...labelStyle, fontSize: "0.7rem", letterSpacing: "0.04em", textTransform: "none", cursor: "pointer", lineHeight: 1.7 }}>
            I consent to receive private-client updates from Lemure Bleu in accordance with the{" "}
            <a href="/privacy-policy" style={{ color: "var(--champagne)", textDecoration: "underline" }}>Privacy Policy</a>.
          </label>
        </div>

        {/* Error */}
        {error && (
          <div style={{ gridColumn: "1 / -1", padding: "0.75rem 1rem", background: "rgba(224,112,112,0.1)", border: "1px solid rgba(224,112,112,0.3)" }}>
            <p style={{ fontSize: "0.75rem", color: "#e07070", fontWeight: 300 }}>{error}</p>
          </div>
        )}

        {/* Submit */}
        <div style={{ gridColumn: "1 / -1" }}>
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "1rem", background: "var(--champagne)", color: "var(--ivory)", fontFamily: "Jost, sans-serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, transition: "all 0.3s" }}>
            {loading ? "Submitting…" : "Request VIP Access"}
          </button>
        </div>
      </div>
    </form>
  );
}
