import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, sub, action }: {
  eyebrow: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem" }}>
      <div>
        <div style={{ fontSize:"0.5rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"#C4965A", marginBottom:"0.35rem", fontFamily:"'Jost',sans-serif", fontWeight:500 }}>{eyebrow}</div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.2rem", fontWeight:300, color:"#1C3D35", lineHeight:1.1, margin:0 }}>{title}</h1>
        {sub && <div style={{ fontSize:"0.7rem", color:"#8C857A", fontWeight:300, marginTop:"0.3rem", fontFamily:"'Jost',sans-serif" }}>{sub}</div>}
      </div>
      {action && <div style={{ flexShrink:0 }}>{action}</div>}
    </div>
  );
}
