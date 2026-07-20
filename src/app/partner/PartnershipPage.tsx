"use client";
import { useState } from "react";

// ── Palette ──────────────────────────────────────────────────────────────
const P = {
  ivory:     "#F7F2E8",
  ivoryDeep: "#EDE6D6",
  stone:     "#CFC8BC",
  champagne: "#C4965A",
  champLight:"#D4AA7A",
  emerald:   "#1C3D35",
  emeraldMid:"#2A5446",
  warmGrey:  "#8C857A",
  charcoal:  "#1A1814",
  white:     "#FFFFFF",
};

// ── Partnership categories ───────────────────────────────────────────────
const CATEGORIES = [
  {
    id:      "venue",
    label:   "Venue",
    icon:    "◉",
    tagline: "Private spaces for intimate experiences",
    desc:    "Hotels, private clubs, residences, and estates that align with the Lemuré Bleu aesthetic — spaces where our clients gather for previews, dinners, and collection viewings.",
    examples:"Private clubs · Boutique hotels · Heritage spaces · Penthouse venues",
  },
  {
    id:      "dining",
    label:   "Dining",
    icon:    "◇",
    tagline: "Culinary experiences for private gatherings",
    desc:    "Michelin-calibre chefs, private dining houses, and bespoke catering partners for maison events, collection launches, and client entertainment.",
    examples:"Private chefs · Fine dining establishments · Catering houses · Wine specialists",
  },
  {
    id:      "exhibition",
    label:   "Exhibition",
    icon:    "◈",
    tagline: "Art, culture, and collectibles",
    desc:    "Galleries, art fairs, auction houses, and cultural institutions interested in co-presenting rare gemstones, bespoke jewellery, or collectible pieces alongside curated art.",
    examples:"Commercial galleries · Art fairs · Auction houses · Museum partnerships",
  },
  {
    id:      "platform",
    label:   "Platform",
    icon:    "◆",
    tagline: "Digital and media reach",
    desc:    "Luxury media, digital platforms, and editorial properties that connect with high-net-worth audiences in Southeast Asia and beyond.",
    examples:"Luxury publications · Digital media · Podcast networks · Newsletter platforms",
  },
  {
    id:      "service",
    label:   "Service",
    icon:    "◎",
    tagline: "White-glove service providers",
    desc:    "Concierge, wealth management, private banking, legal, and lifestyle service firms whose clientele overlap with Lemuré Bleu's private collector base.",
    examples:"Private banking · Family offices · Concierge firms · Legal & estate advisors",
  },
  {
    id:      "product",
    label:   "Product",
    icon:    "◐",
    tagline: "Luxury goods and craftsmanship",
    desc:    "Rare goods, materials, and artisanal products — from rare textiles to bespoke packaging — that meet Lemuré Bleu's standards of provenance and craft.",
    examples:"Rare materials · Bespoke packaging · Luxury goods · Artisan ateliers",
  },
  {
    id:      "network",
    label:   "Network",
    icon:    "◑",
    tagline: "Communities and introductions",
    desc:    "Family offices, collectors' societies, alumni networks, and private communities where introductions can create meaningful long-term relationships.",
    examples:"Collectors' societies · Alumni networks · Investment clubs · Private communities",
  },
];

const MODELS = [
  "Revenue share / commission",
  "Co-production",
  "Referral arrangement",
  "Sponsorship",
  "Barter / exchange",
  "Exclusive supply",
  "Open to discussion",
];

// ── Shared field styles ───────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "Jost,sans-serif",
  fontSize: "0.48rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: P.warmGrey,
  fontWeight: 400,
  marginBottom: "0.45rem",
};
function fieldStyle(focused: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "0.85rem 0.9rem",
    fontFamily: "Jost,sans-serif",
    fontSize: "0.82rem",
    fontWeight: 300,
    color: P.charcoal,
    background: P.white,
    border: `1px solid ${focused ? P.champagne : P.stone}`,
    outline: "none",
    borderRadius: 0,
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  };
}

// ── Input helper ──────────────────────────────────────────────────────────
function Field({ name, label, type = "text", placeholder = "", required = false }: {
  name: string; label: string; type?: string; placeholder?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}{required && " *"}</label>
      <input name={name} type={type} required={required} placeholder={placeholder}
        style={fieldStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)} />
    </div>
  );
}

function Select({ name, label, options, required = false }: {
  name: string; label: string; options: string[]; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}{required && " *"}</label>
      <select name={name} required={required} defaultValue=""
        style={{ ...fieldStyle(focused), cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}>
        <option value="" disabled>Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ name, label, rows = 3, placeholder = "" }: {
  name: string; label: string; rows?: number; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea name={name} rows={rows} placeholder={placeholder}
        style={{ ...fieldStyle(focused), resize: "none", display: "block" }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)} />
    </div>
  );
}

// ── Ornament divider ─────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2.5rem 0" }}>
      <div style={{ flex: 1, height: "1px", background: P.stone }} />
      <div style={{ width: "5px", height: "5px", background: P.champagne, transform: "rotate(45deg)" }} />
      <div style={{ flex: 1, height: "1px", background: P.stone }} />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────
export default function PartnershipPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [err, setErr]           = useState("");

  const cat = CATEGORIES.find(c => c.id === selected);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const fd   = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    data.partner_category = selected || "";

    try {
      const res = await fetch("/api/partner-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ background: P.ivoryDeep, minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{ background: P.emerald, padding: "6rem 2rem 5rem", position: "relative", overflow: "hidden" }}>
        {/* Corner marks */}
        {[{top:24,left:24},{top:24,right:24},{bottom:24,left:24},{bottom:24,right:24}].map((pos,i) => (
          <div key={i} style={{ position:"absolute", width:16, height:16, ...pos,
            borderTop: (pos.top !== undefined) ? `1px solid rgba(196,150,90,0.25)` : "none",
            borderBottom: (pos.bottom !== undefined) ? `1px solid rgba(196,150,90,0.25)` : "none",
            borderLeft: (pos.left !== undefined) ? `1px solid rgba(196,150,90,0.25)` : "none",
            borderRight: (pos.right !== undefined) ? `1px solid rgba(196,150,90,0.25)` : "none",
          }} />
        ))}

        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.5rem", letterSpacing:"0.3em", textTransform:"uppercase", color:P.champagne, marginBottom:"1.25rem" }}>
            Lemuré Bleu · Private Maison
          </p>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(2.5rem,6vw,4.5rem)", fontWeight:300, color:P.ivory, lineHeight:1.1, marginBottom:"1.5rem" }}>
            Partnership
          </h1>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.88rem", fontWeight:300, color:"rgba(247,242,232,0.6)", maxWidth:"500px", margin:"0 auto", lineHeight:1.9 }}>
            Lemuré Bleu works with a curated circle of partners — brands, spaces, and networks that share our standards of discretion, craft, and clientele.
          </p>
        </div>
      </section>

      {/* ── What we build together ── */}
      <section style={{ maxWidth:"900px", margin:"0 auto", padding:"4rem 2rem 0" }}>
        <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.5rem", letterSpacing:"0.25em", textTransform:"uppercase", color:P.champagne, marginBottom:"2rem" }}>
          Partnership Categories
        </p>

        {/* Category grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:"1px", background:P.stone, border:`1px solid ${P.stone}`, marginBottom:"0.5rem" }}>
          {CATEGORIES.map(cat => {
            const isActive = selected === cat.id;
            return (
              <button key={cat.id} type="button"
                onClick={() => { setSelected(isActive ? null : cat.id); setDone(false); setErr(""); }}
                style={{
                  padding:"1.75rem 1.5rem",
                  background: isActive ? P.emerald : P.ivory,
                  border:"none",
                  cursor:"pointer",
                  textAlign:"left",
                  transition:"background 0.2s",
                  position:"relative",
                }}>
                {isActive && (
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:P.champagne }} />
                )}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"0.75rem" }}>
                  <span style={{ fontFamily:"monospace", fontSize:"1rem", color: isActive ? P.champagne : P.stone }}>
                    {cat.icon}
                  </span>
                  {isActive && (
                    <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.45rem", letterSpacing:"0.15em", textTransform:"uppercase", color:P.champagne, marginTop:"3px" }}>Selected</span>
                  )}
                </div>
                <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.3rem", fontWeight:300, color: isActive ? P.ivory : P.emerald, marginBottom:"0.35rem", lineHeight:1.2 }}>
                  {cat.label}
                </p>
                <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.68rem", fontWeight:300, color: isActive ? "rgba(247,242,232,0.55)" : P.warmGrey, lineHeight:1.6 }}>
                  {cat.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Category detail panel */}
        {cat && (
          <div style={{ background:P.white, border:`1px solid ${P.stone}`, borderTop:`2px solid ${P.champagne}`, padding:"2rem 2rem 1.75rem", marginBottom:"2.5rem", transition:"all 0.2s" }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:"1rem", marginBottom:"0.75rem" }}>
              <h2 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.6rem", fontWeight:300, color:P.emerald }}>
                {cat.label} Partnership
              </h2>
              <div style={{ height:"1px", flex:1, background:P.stone }} />
            </div>
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.82rem", fontWeight:300, color:P.warmGrey, lineHeight:1.8, marginBottom:"0.85rem" }}>
              {cat.desc}
            </p>
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.62rem", letterSpacing:"0.04em", color:P.stone }}>
              {cat.examples}
            </p>
          </div>
        )}

        <Divider />

        {/* ── Embedded Form ── */}
        <div id="partnership-form">
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.5rem", letterSpacing:"0.25em", textTransform:"uppercase", color:P.champagne, marginBottom:"0.5rem" }}>
            Register Interest
          </p>
          <h2 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2rem", fontWeight:300, color:P.emerald, marginBottom:"0.5rem" }}>
            {cat ? `${cat.label} Partnership` : "Partnership Request"}
          </h2>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.8rem", fontWeight:300, color:P.warmGrey, marginBottom:"2.5rem", lineHeight:1.8 }}>
            {cat
              ? `Complete the form below to register your interest in a ${cat.label.toLowerCase()} partnership with Lemuré Bleu.`
              : "Select a partnership category above, then complete the form below."}
          </p>

          {!selected && (
            <div style={{ padding:"2.5rem", background:P.white, border:`1px solid ${P.stone}`, textAlign:"center" }}>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", fontWeight:300, color:P.warmGrey, marginBottom:"0.5rem" }}>
                Select a category above to continue
              </p>
              <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.72rem", color:P.stone, fontWeight:300 }}>
                Venue · Dining · Exhibition · Platform · Service · Product · Network
              </p>
            </div>
          )}

          {selected && done && (
            <div style={{ padding:"3.5rem 2rem", background:P.white, border:`1px solid ${P.stone}`, borderTop:`2px solid ${P.champagne}`, textAlign:"center" }}>
              <div style={{ width:52, height:52, border:`1px solid rgba(196,150,90,0.35)`, transform:"rotate(45deg)", margin:"0 auto 1.75rem", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ transform:"rotate(-45deg)", color:P.champagne, fontSize:"1.2rem" }}>✓</span>
              </div>
              <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.5rem", letterSpacing:"0.25em", textTransform:"uppercase", color:P.champagne, marginBottom:"0.75rem" }}>Received</p>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.75rem", fontWeight:300, color:P.emerald, marginBottom:"0.75rem" }}>
                Partnership Request Submitted
              </h3>
              <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.82rem", color:P.warmGrey, lineHeight:1.9, maxWidth:"440px", margin:"0 auto" }}>
                Thank you for your interest in a {cat?.label.toLowerCase()} partnership with Lemuré Bleu. Our team will review your submission and be in touch.
              </p>
            </div>
          )}

          {selected && !done && (
            <form onSubmit={handleSubmit} style={{ background:P.white, border:`1px solid ${P.stone}`, borderTop:`2px solid ${P.champagne}`, padding:"2.5rem" }}>

              {/* Section label */}
              <div style={{ marginBottom:"2rem" }}>
                <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.48rem", letterSpacing:"0.22em", textTransform:"uppercase", color:P.champagne, paddingBottom:"0.6rem", borderBottom:`1px solid ${P.stone}` }}>
                  Contact Information
                </p>
              </div>

              <div style={{ display:"grid", gap:"1.25rem", marginBottom:"2rem" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
                  <Field name="full_name"    label="Full Name"           placeholder="Your full name"     required />
                  <Field name="company_name" label="Company / Brand"     placeholder="Your organisation" />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
                  <Field name="role_title"   label="Role / Title"        placeholder="e.g. Director" />
                  <Field name="email"        label="Email"               type="email" placeholder="your@email.com" required />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
                  <Field name="phone"        label="Mobile / WhatsApp"   type="tel"  placeholder="+65 xxxx xxxx" required />
                  <Field name="website"      label="Website / Social"    placeholder="https://…" />
                </div>
                <Field name="country_city"   label="Country / City"      placeholder="e.g. Singapore" required />
              </div>

              {/* Section 2 */}
              <div style={{ marginBottom:"2rem" }}>
                <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.48rem", letterSpacing:"0.22em", textTransform:"uppercase", color:P.champagne, paddingBottom:"0.6rem", borderBottom:`1px solid ${P.stone}`, marginBottom:"1.5rem" }}>
                  Partnership Details
                </p>
                <div style={{ display:"grid", gap:"1.25rem" }}>
                  <Textarea name="products_services"  label="What do you offer?"
                    placeholder={`Describe your ${cat?.label.toLowerCase()} offering, services, or proposition…`} rows={3} />
                  <Select   name="partnership_model"  label="Preferred Partnership Model" options={MODELS} />
                  <Textarea name="message"            label="Proposal or Notes"
                    placeholder="Tell us more — event ideas, client overlap, exclusivity terms, timeline…" rows={4} />
                </div>
              </div>

              {/* Consent */}
              <div style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start", marginBottom:"1.75rem" }}>
                <input type="checkbox" id="partner_consent" name="consent" required
                  style={{ marginTop:3, flexShrink:0, accentColor:P.champagne, width:14, height:14 }} />
                <label htmlFor="partner_consent" style={{ ...labelStyle, fontSize:"0.68rem", letterSpacing:"0.04em", textTransform:"none", lineHeight:1.7, cursor:"pointer" }}>
                  I agree to be contacted by Lemuré Bleu about this partnership opportunity, in accordance with the{" "}
                  <a href="/privacy-policy" style={{ color:P.champagne, textDecoration:"underline" }}>Privacy Policy</a>.
                </label>
              </div>

              {err && (
                <div style={{ padding:"0.75rem 1rem", background:"rgba(200,70,70,0.08)", border:"1px solid rgba(200,70,70,0.22)", marginBottom:"1.25rem" }}>
                  <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.75rem", color:"#c05050" }}>{err}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"1.1rem", background: loading ? P.warmGrey : P.emerald, color:P.ivory, fontFamily:"Jost,sans-serif", fontSize:"0.58rem", letterSpacing:"0.25em", textTransform:"uppercase", border:"none", cursor: loading ? "not-allowed" : "pointer", transition:"background 0.25s" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = P.emeraldMid; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = P.emerald; }}>
                {loading ? "Submitting…" : `Submit ${cat?.label} Partnership Request`}
              </button>
            </form>
          )}
        </div>

        <div style={{ height:"5rem" }} />
      </section>

      {/* ── Footer strip ── */}
      <div style={{ background:P.emerald, padding:"2rem", textAlign:"center" }}>
        <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.52rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(247,242,232,0.35)", fontWeight:300 }}>
          Lemuré Bleu · Private Maison · Singapore
        </p>
      </div>
    </main>
  );
}
