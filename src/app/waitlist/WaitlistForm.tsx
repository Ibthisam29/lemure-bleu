"use client";
import { useState } from "react";

const P = {
  ivory: "#F7F2E8", stone: "#CFC8BC", champagne: "#C4965A",
  emerald: "#1C3D35", warmGrey: "#8C857A", white: "#FFFFFF",
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

const GUEST_CATEGORIES = ["Private Collector","Investor / Family Office","Interior Designer","Gallery / Art Professional","High-Net-Worth Individual","Media / Journalist","Industry Professional","Other"];
const INTERESTS        = ["Private Jewellery Previews","Rare Gemstone Viewings","Bespoke Commissions","Limited Edition Launches","Investment Pieces","Maison Events & Dinners","All of the above"];
const ATTENDANCE       = ["In-person (Singapore)","Virtual / Online","Both","Open to either"];
const PURCHASE_RANGES  = ["SGD 1,000 – 5,000","SGD 5,000 – 20,000","SGD 20,000 – 100,000","SGD 100,000+","Exploring / Not decided"];
const REFERRAL         = ["Instagram","LinkedIn","Word of mouth","Press / Media","Event","Google Search","Other"];

export default function WaitlistForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [err, setErr]         = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setErr("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/waitlist-register", {
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
      <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "1.8rem", fontWeight: 300, color: P.emerald, marginBottom: "0.75rem" }}>You&apos;re on the List</h2>
      <p style={{ fontFamily: "Jost,sans-serif", fontSize: "0.82rem", color: P.warmGrey, lineHeight: 1.8 }}>
        Welcome to the Lemuré Bleu inner circle.<br />We&apos;ll be in touch with private invitations and early access.
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

  const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" };
  const sec = (title: string) => (
    <div style={{ borderBottom: `1px solid ${P.stone}`, paddingBottom: "0.5rem", marginBottom: "1.5rem", marginTop: "0.5rem" }}>
      <p style={{ fontFamily: "Jost,sans-serif", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: P.champagne }}>{title}</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ background: P.white, border: `1px solid ${P.stone}`, padding: "2.5rem" }}>

      {sec("Your Details")}
      <div style={{ display: "grid", gap: "1.25rem", marginBottom: "2rem" }}>
        {F("full_name", "Full Name", "text", "Your full name", true)}
        <div style={grid2}>
          {F("email", "Email Address", "email", "your@email.com", true)}
          {F("phone", "Mobile / WhatsApp", "tel", "+65 xxxx xxxx", true)}
        </div>
        <div style={grid2}>
          {F("country_city", "Country / City", "text", "e.g. Singapore", true)}
          {F("social_profile", "Instagram or LinkedIn (optional)", "text", "https://…")}
        </div>
        {S("guest_category", "Guest Category", GUEST_CATEGORIES, true)}
      </div>

      {sec("Preferences")}
      <div style={{ display: "grid", gap: "1.25rem", marginBottom: "2rem" }}>
        {S("interests", "What are you interested in?", INTERESTS, true)}
        <div style={grid2}>
          {S("attendance_type", "Preferred Attendance Type", ATTENDANCE)}
          {S("purchase_interest", "Approximate Purchase / Investment Interest", PURCHASE_RANGES)}
        </div>
        <div style={grid2}>
          {S("open_to_appointment", "Open to Private Appointment?", ["Yes", "Maybe", "Not at this time"])}
          {S("referral_source", "How did you hear about Lemuré Bleu?", REFERRAL)}
        </div>
        <div>
          <label style={label}>Short Message or Request</label>
          <textarea name="message" rows={3} placeholder="Any specific requests or interests…"
            style={{ ...field, resize: "none", display: "block" }}
            onFocus={e => e.target.style.borderColor = P.champagne}
            onBlur={e => e.target.style.borderColor = P.stone} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "1.75rem" }}>
        <input type="checkbox" id="waitlist_consent" name="consent" required
          style={{ marginTop: 3, flexShrink: 0, accentColor: P.champagne, width: 14, height: 14 }} />
        <label htmlFor="waitlist_consent" style={{ ...label, fontSize: "0.7rem", letterSpacing: "0.04em", textTransform: "none", lineHeight: 1.7, cursor: "pointer" }}>
          I agree to be contacted by Lemuré Bleu regarding private maison invitations and related opportunities, in accordance with the{" "}
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
        {loading ? "Submitting…" : "Join Waitlist"}
      </button>
    </form>
  );
}
