"use client";
import { useState } from "react";

const P = {
  ivory: "#F7F2E8", ivoryDeep: "#EDE6D6", stone: "#CFC8BC",
  champagne: "#C4965A", emerald: "#1C3D35", warmGrey: "#8C857A", white: "#FFFFFF",
};

const label: React.CSSProperties = {
  display: "block", fontFamily: "Jost,sans-serif", fontSize: "0.5rem",
  letterSpacing: "0.2em", textTransform: "uppercase", color: P.warmGrey,
  fontWeight: 400, marginBottom: "0.45rem",
};
const field: React.CSSProperties = {
  width: "100%", padding: "0.85rem 0.9rem", fontFamily: "Jost,sans-serif",
  fontSize: "0.82rem", fontWeight: 300, color: P.emerald,
  background: P.white, border: `1px solid ${P.stone}`, outline: "none",
  borderRadius: 0, transition: "border-color 0.2s", boxSizing: "border-box",
};

const CATEGORIES = ["Gemstone Dealer / Broker","Jewellery Artisan / Atelier","Gallery / Art House","Luxury Brand / Retailer","Investment / Family Office","Media / PR / Stylist","Technology / Platform","Other"];
const INTERESTS  = ["Private Sales","Consignment","Co-creation / Bespoke","Event Collaboration","Wholesale Supply","Investment Partnership","Media Feature","Other"];
const MODELS     = ["Commission-based","Consignment","Fixed Supply Agreement","Exclusive Partnership","Event Collaboration","Open to Discussion"];

export default function PartnerForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [err, setErr]         = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setErr("");
    const fd   = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    try {
      const res = await fetch("/api/partner-register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Submission failed. Please try again.");
    } finally { setLoading(false); }
  }

  if (done) return (
    <div style={{ textAlign: "center", padding: "4rem 1rem", background: P.white, border: `1px solid ${P.stone}` }}>
      <div style={{ width: 48, height: 48, border: `1px solid rgba(196,150,90,0.4)`, transform: "rotate(45deg)", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ transform: "rotate(-45deg)", color: P.champagne, fontSize: "1.1rem" }}>✓</span>
      </div>
      <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "1.8rem", fontWeight: 300, color: P.emerald, marginBottom: "0.75rem" }}>Registration Received</h2>
      <p style={{ fontFamily: "Jost,sans-serif", fontSize: "0.82rem", color: P.warmGrey, lineHeight: 1.8 }}>
        Thank you for registering with Lemuré Bleu.<br />Our team will review your profile and be in touch.
      </p>
    </div>
  );

  const F = (name: string, lbl: string, type = "text", placeholder = "", required = false) => (
    <div>
      <label style={label}>{lbl}{required && " *"}</label>
      <input name={name} type={type} required={required} placeholder={placeholder}
        style={field} onFocus={e => e.target.style.borderColor = P.champagne}
        onBlur={e => e.target.style.borderColor = P.stone} />
    </div>
  );

  const S = (name: string, lbl: string, options: string[], required = false) => (
    <div>
      <label style={label}>{lbl}{required && " *"}</label>
      <select name={name} required={required} defaultValue=""
        style={{ ...field, cursor: "pointer" }}
        onFocus={e => e.target.style.borderColor = P.champagne}
        onBlur={e => e.target.style.borderColor = P.stone}>
        <option value="" disabled>Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const T = (name: string, lbl: string, rows = 3, placeholder = "") => (
    <div>
      <label style={label}>{lbl}</label>
      <textarea name={name} rows={rows} placeholder={placeholder}
        style={{ ...field, resize: "none", display: "block" }}
        onFocus={e => e.target.style.borderColor = P.champagne}
        onBlur={e => e.target.style.borderColor = P.stone} />
    </div>
  );

  const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" };
  const sec = (title: string) => (
    <div style={{ borderBottom: `1px solid ${P.stone}`, paddingBottom: "0.5rem", marginBottom: "1.5rem", marginTop: "0.5rem" }}>
      <p style={{ fontFamily: "Jost,sans-serif", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: P.champagne }}>{title}</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ background: P.white, border: `1px solid ${P.stone}`, padding: "2.5rem" }}>
      <style>{`.lb-field:focus{border-color:${P.champagne}!important}`}</style>

      {/* Section 1 — Contact */}
      {sec("Contact Information")}
      <div style={{ display: "grid", gap: "1.25rem", marginBottom: "2rem" }}>
        <div style={grid2}>
          {F("full_name", "Full Name", "text", "Your full name", true)}
          {F("company_name", "Company / Brand Name", "text", "Your company")}
        </div>
        <div style={grid2}>
          {F("role_title", "Role / Title", "text", "e.g. Director, Founder")}
          {F("email", "Email", "email", "your@email.com", true)}
        </div>
        <div style={grid2}>
          {F("phone", "Mobile / WhatsApp", "tel", "+65 xxxx xxxx", true)}
          {F("website", "Website / Instagram / LinkedIn", "text", "https://…")}
        </div>
        {F("country_city", "Country / City", "text", "e.g. Singapore", true)}
      </div>

      {/* Section 2 — Business */}
      {sec("Business Details")}
      <div style={{ display: "grid", gap: "1.25rem", marginBottom: "2rem" }}>
        {S("partner_category", "Partner Category", CATEGORIES, true)}
        {T("products_services", "Products or Services Offered", 3, "Describe what you offer…")}
        {S("interest_areas", "Primary Interest Area", INTERESTS, true)}
        {T("gemstones_represented", "Gemstones, Jewellery, Art or Services You Represent", 3, "Please describe…")}
      </div>

      {/* Section 3 — Commercial */}
      {sec("Commercial Details")}
      <div style={{ display: "grid", gap: "1.25rem", marginBottom: "2rem" }}>
        <div style={grid2}>
          {S("has_certification", "Certification / Provenance Documents Available?", ["Yes, full documentation","Yes, partial","No, but can arrange","Not applicable"])}
          {F("price_range", "Estimated Commercial Value / Price Range", "text", "e.g. SGD 5,000 – 50,000")}
        </div>
        {S("partnership_model", "Preferred Partnership Model", MODELS)}
        {T("message", "Message or Collaboration Proposal", 4, "Tell us more about what you have in mind…")}
      </div>

      {/* Consent */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "1.75rem" }}>
        <input type="checkbox" name="consent" id="partner_consent" required
          style={{ marginTop: 3, flexShrink: 0, accentColor: P.champagne, width: 14, height: 14 }} />
        <label htmlFor="partner_consent" style={{ ...label, fontSize: "0.7rem", letterSpacing: "0.04em", textTransform: "none", lineHeight: 1.7, cursor: "pointer" }}>
          I agree to be contacted by Lemuré Bleu about private partnership opportunities, in accordance with the{" "}
          <a href="/privacy-policy" style={{ color: P.champagne }}>Privacy Policy</a>.
        </label>
      </div>

      {err && (
        <div style={{ padding: "0.75rem 1rem", background: "rgba(200,80,80,0.08)", border: "1px solid rgba(200,80,80,0.25)", marginBottom: "1.25rem" }}>
          <p style={{ fontFamily: "Jost,sans-serif", fontSize: "0.75rem", color: "#c05050" }}>{err}</p>
        </div>
      )}

      <button type="submit" disabled={loading}
        style={{ width: "100%", padding: "1rem", background: P.emerald, color: P.ivory, fontFamily: "Jost,sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.65 : 1, transition: "background 0.25s" }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#2A5446"; }}
        onMouseLeave={e => { e.currentTarget.style.background = P.emerald; }}>
        {loading ? "Submitting…" : "Register Interest"}
      </button>
    </form>
  );
}
