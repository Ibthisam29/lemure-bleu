import React from "react";
// Shared style tokens for admin pages
export const A = {
  // Colors
  ivory:     "#F7F2E8",
  ivoryDeep: "#EDE6D6",
  white:     "#FFFFFF",
  stone:     "#CFC8BC",
  emerald:   "#1C3D35",
  emeraldMid:"#2A5446",
  champagne: "#C4965A",
  warmGrey:  "#8C857A",
  charcoal:  "#1A1814",

  // Status colors
  green:  "#3D7A55",
  amber:  "#B87A20",
  red:    "#8B3030",
  purple: "#6B4A8C",
  blue:   "#2A5580",

  // Reusable component styles
  card: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #CFC8BC",
    padding: "1.5rem",
  } as React.CSSProperties,

  input: {
    width: "100%",
    padding: "0.65rem 0.8rem",
    backgroundColor: "#FFFFFF",
    border: "1px solid #CFC8BC",
    color: "#1C3D35",
    fontSize: "0.82rem",
    fontWeight: 300,
    outline: "none",
    fontFamily: "'Jost', sans-serif",
    borderRadius: 0,
    transition: "border-color .2s",
  } as React.CSSProperties,

  label: {
    display: "block",
    fontSize: "0.5rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#8C857A",
    fontWeight: 400,
    marginBottom: "0.35rem",
    fontFamily: "'Jost', sans-serif",
  } as React.CSSProperties,

  pageTitle: (title: string, eyebrow: string, sub?: string) => ({ title, eyebrow, sub }),

  btnGold: {
    padding: "0.6rem 1.5rem",
    backgroundColor: "#C4965A",
    color: "#F7F2E8",
    fontSize: "0.58rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    border: "none",
    cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 400,
  } as React.CSSProperties,

  btnEmerald: {
    padding: "0.6rem 1.5rem",
    backgroundColor: "#1C3D35",
    color: "#F7F2E8",
    fontSize: "0.58rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    border: "none",
    cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 400,
  } as React.CSSProperties,

  btnOutline: {
    padding: "0.5rem 1rem",
    backgroundColor: "transparent",
    color: "#1C3D35",
    fontSize: "0.56rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    border: "1px solid #1C3D35",
    cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
  } as React.CSSProperties,

  btnDanger: {
    padding: "0.5rem 1rem",
    backgroundColor: "transparent",
    color: "#8B3030",
    fontSize: "0.56rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    border: "1px solid #8B3030",
    cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
  } as React.CSSProperties,

  th: {
    textAlign: "left" as const,
    padding: "0.65rem 0.9rem",
    fontSize: "0.48rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#8C857A",
    fontWeight: 400,
    fontFamily: "'Jost', sans-serif",
    backgroundColor: "#F7F2E8",
    borderBottom: "1px solid #CFC8BC",
  } as React.CSSProperties,

  td: {
    padding: "0.85rem 0.9rem",
    borderBottom: "1px solid rgba(207,200,188,.5)",
    verticalAlign: "top" as const,
  } as React.CSSProperties,
};

export const statusPill = (status: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    new:              { bg:"rgba(42,84,70,.12)", color:"#2A5446" },
    contacted:        { bg:"rgba(184,122,32,.12)", color:"#B87A20" },
    qualified:        { bg:"rgba(61,122,85,.12)", color:"#3D7A55" },
    appointment_booked:{ bg:"rgba(42,85,128,.12)", color:"#2A5580" },
    converted:        { bg:"rgba(107,74,140,.12)", color:"#6B4A8C" },
    not_suitable:     { bg:"rgba(140,133,122,.12)", color:"#8C857A" },
    pending:          { bg:"rgba(184,122,32,.12)", color:"#B87A20" },
    approved:         { bg:"rgba(61,122,85,.12)", color:"#3D7A55" },
    rejected:         { bg:"rgba(139,48,48,.12)", color:"#8B3030" },
    completed:        { bg:"rgba(107,74,140,.12)", color:"#6B4A8C" },
    paid:             { bg:"rgba(61,122,85,.12)", color:"#3D7A55" },
    unpaid:           { bg:"rgba(184,122,32,.12)", color:"#B87A20" },
    pending_contact:  { bg:"rgba(42,84,70,.12)", color:"#2A5446" },
    draft:            { bg:"rgba(140,133,122,.12)", color:"#8C857A" },
    published:        { bg:"rgba(61,122,85,.12)", color:"#3D7A55" },
    available:        { bg:"rgba(61,122,85,.12)", color:"#3D7A55" },
    reserved:         { bg:"rgba(184,122,32,.12)", color:"#B87A20" },
    sold:             { bg:"rgba(139,48,48,.12)", color:"#8B3030" },
    refunded:         { bg:"rgba(140,133,122,.12)", color:"#8C857A" },
    cancelled:        { bg:"rgba(139,48,48,.12)", color:"#8B3030" },
  };
  const s = map[status] || { bg:"rgba(140,133,122,.12)", color:"#8C857A" };
  return {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    fontSize: "0.5rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    fontFamily: "'Jost', sans-serif",
    fontWeight: 400,
    backgroundColor: s.bg,
    color: s.color,
    border: `1px solid ${s.color}30`,
  } as React.CSSProperties;
};

export const PageHeader = ({ eyebrow, title, sub, action }: { eyebrow:string; title:string; sub?:string; action?: React.ReactNode }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem" }}>
    <div>
      <div style={{ fontSize:"0.5rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"#C4965A", marginBottom:"0.35rem", fontFamily:"'Jost',sans-serif", fontWeight:500 }}>{eyebrow}</div>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.2rem", fontWeight:300, color:"#1C3D35", lineHeight:1.1, margin:0 }}>{title}</h1>
      {sub && <div style={{ fontSize:"0.7rem", color:"#8C857A", fontWeight:300, marginTop:"0.3rem", fontFamily:"'Jost',sans-serif" }}>{sub}</div>}
    </div>
    {action && <div style={{ flexShrink:0 }}>{action}</div>}
  </div>
);
