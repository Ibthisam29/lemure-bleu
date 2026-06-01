"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { section: "Overview", items: [
    { href: "/admin", label: "Dashboard", icon: "◈" },
  ]},
  { section: "Content", items: [
    { href: "/admin/products", label: "Products & Media", icon: "◇" },
    { href: "/admin/sections", label: "Site Sections", icon: "◎" },
    { href: "/admin/stones", label: "Stone Vault", icon: "◆" },
    { href: "/admin/collections", label: "Collections", icon: "◉" },
  ]},
  { section: "Clients", items: [
    { href: "/admin/leads", label: "VIP Leads", icon: "◐" },
    { href: "/admin/appointments", label: "Appointments", icon: "◑" },
    { href: "/admin/purchases", label: "Purchase Records", icon: "◒" },
  ]},
  { section: "Payments", items: [
    { href: "/admin/invoices", label: "Invoices & Payments", icon: "◓" },
    { href: "/admin/preorders", label: "Preorders", icon: "◔" },
  ]},
  { section: "System", items: [
    { href: "/admin/content", label: "Content Editor", icon: "◕" },
    { href: "/admin/settings", label: "Settings", icon: "○" },
  ]},
];

// Admin palette — emerald + ivory
const A = {
  bg:          "#F7F2E8",   // ivory main bg
  bgDeep:      "#EDE6D6",   // ivory cards/sidebar header
  sidebar:     "#1C3D35",   // deep emerald sidebar
  sidebarMid:  "#2A5446",   // slightly lighter emerald
  emerald:     "#1C3D35",
  emeraldMid:  "#2A5446",
  emeraldLt:   "#3D6B5A",
  gold:        "#C4965A",
  ivory:       "#F7F2E8",
  stone:       "#CFC8BC",
  warmGrey:    "#8C857A",
  charcoal:    "#1A1814",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:A.bg, fontFamily:"Jost,sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? "56px" : "216px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: A.sidebar,
        borderRight: `1px solid rgba(196,150,90,0.12)`,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.3s ease",
      }}>

        {/* Logo */}
        <div style={{ padding:"1.6rem 1.2rem", borderBottom:`1px solid rgba(196,150,90,0.1)`, display:"flex", alignItems:"center", justifyContent: collapsed?"center":"space-between", gap:"0.5rem" }}>
          {!collapsed && (
            <Link href="/admin" style={{ textDecoration:"none" }}>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.25rem", fontWeight:300, color:A.ivory, lineHeight:1 }}>Lemure Bleu</p>
              <p style={{ fontSize:"0.42rem", letterSpacing:"0.28em", textTransform:"uppercase", color:`rgba(196,150,90,0.65)`, marginTop:"3px" }}>Admin OS</p>
            </Link>
          )}
          <button onClick={()=>setCollapsed(!collapsed)}
            style={{ background:"none", border:`1px solid rgba(196,150,90,0.2)`, color:`rgba(196,150,90,0.6)`, cursor:"pointer", width:"24px", height:"24px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem", flexShrink:0 }}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Nav groups */}
        <nav style={{ flex:1, padding:"0.75rem 0" }}>
          {NAV.map((group) => (
            <div key={group.section} style={{ marginBottom:"0.25rem" }}>
              {!collapsed && (
                <p style={{ fontSize:"0.42rem", letterSpacing:"0.28em", textTransform:"uppercase", color:`rgba(196,150,90,0.35)`, padding:"0.7rem 1.2rem 0.3rem" }}>
                  {group.section}
                </p>
              )}
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
                    style={{
                      display:"flex", alignItems:"center", gap:"0.6rem",
                      padding: collapsed ? "0.7rem" : "0.55rem 1.2rem",
                      justifyContent: collapsed ? "center" : "flex-start",
                      fontSize:"0.7rem", fontWeight:300, letterSpacing:"0.04em",
                      color: active ? A.ivory : `rgba(247,242,232,0.45)`,
                      background: active ? `rgba(196,150,90,0.18)` : "transparent",
                      borderLeft: active ? `2px solid ${A.gold}` : "2px solid transparent",
                      textDecoration:"none",
                      transition:"all 0.18s",
                    }}
                    onMouseEnter={e=>{ if(!active){ e.currentTarget.style.color=`rgba(247,242,232,0.8)`; e.currentTarget.style.background=`rgba(196,150,90,0.08)`;} }}
                    onMouseLeave={e=>{ if(!active){ e.currentTarget.style.color=`rgba(247,242,232,0.45)`; e.currentTarget.style.background="transparent";} }}
                  >
                    <span style={{ color: active ? A.gold : `rgba(196,150,90,0.45)`, fontSize:"0.8rem", flexShrink:0 }}>{item.icon}</span>
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop:`1px solid rgba(196,150,90,0.1)`, padding:"1rem 1.2rem" }}>
          <Link href="/" target="_blank"
            style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.62rem", color:`rgba(247,242,232,0.3)`, textDecoration:"none", justifyContent: collapsed?"center":"flex-start" }}
            onMouseEnter={e=>e.currentTarget.style.color=`rgba(247,242,232,0.6)`}
            onMouseLeave={e=>e.currentTarget.style.color=`rgba(247,242,232,0.3)`}
          >
            <span>↗</span>{!collapsed && "View Site"}
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>

        {/* Top bar */}
        <div style={{
          padding:"0.8rem 2rem",
          background: A.ivory,
          borderBottom:`1px solid ${A.stone}`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:10,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
            <p style={{ fontSize:"0.55rem", letterSpacing:"0.18em", textTransform:"uppercase", color:A.warmGrey, fontWeight:300 }}>
              Lemure Bleu · Admin OS
            </p>
            {/* Breadcrumb dot */}
            <div style={{ width:"4px", height:"4px", background:A.gold, transform:"rotate(45deg)", opacity:0.5 }} />
            <p style={{ fontSize:"0.55rem", letterSpacing:"0.12em", textTransform:"uppercase", color:A.emeraldLt, fontWeight:300 }}>
              {pathname.split("/").filter(Boolean).join(" · ")}
            </p>
          </div>
          <Link href="/admin/invoices/new"
            style={{ padding:"0.45rem 1.1rem", background:A.emerald, color:A.ivory, fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none", fontFamily:"Jost,sans-serif", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background=A.emeraldLt}
            onMouseLeave={e=>e.currentTarget.style.background=A.emerald}
          >
            + New Invoice
          </Link>
        </div>

        {/* Page content */}
        <div style={{ padding:"2rem 2.5rem", flex:1 }}>{children}</div>
      </main>
    </div>
  );
}
