"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { section: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: "◈" }]},
  { section: "Content", items: [
    { href: "/admin/products",    label: "Products & Media",  icon: "◇" },
    { href: "/admin/sections",    label: "Site Sections",     icon: "◎" },
    { href: "/admin/stones",      label: "Stone Vault",       icon: "◆" },
    { href: "/admin/collections", label: "Collections",       icon: "◉" },
  ]},
  { section: "Clients", items: [
    { href: "/admin/leads",       label: "VIP Leads",         icon: "◐" },
    { href: "/admin/appointments",label: "Appointments",      icon: "◑" },
    { href: "/admin/purchases",   label: "Purchase Records",  icon: "◒" },
  ]},
  { section: "Payments", items: [
    { href: "/admin/invoices",    label: "Invoices & Payments",icon: "◓" },
    { href: "/admin/preorders",   label: "Preorders",         icon: "◔" },
  ]},
  { section: "System", items: [
    { href: "/admin/content",     label: "Content Editor",    icon: "◕" },
    { href: "/admin/settings",    label: "Settings",          icon: "○" },
  ]},
];

/* ── Exact website palette ── */
const P = {
  ivory:      "#F7F2E8",
  ivoryDeep:  "#EDE6D6",
  stone:      "#CFC8BC",
  champagne:  "#C4965A",
  champLight: "#D4AA7A",
  emerald:    "#1C3D35",
  emeraldMid: "#2A5446",
  warmGrey:   "#8C857A",
  charcoal:   "#1A1814",
  white:      "#FFFFFF",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="en" style={{ margin:0, padding:0 }}>
      <body style={{ margin:0, padding:0, fontFamily:"Jost,sans-serif", background:P.ivoryDeep }}>
        <div style={{ display:"flex", minHeight:"100vh" }}>

          {/* ── SIDEBAR ── ivory bg, emerald text */}
          <aside style={{
            width: collapsed ? "52px" : "210px",
            minWidth: collapsed ? "52px" : "210px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            background: P.ivory,
            borderRight: `1px solid ${P.stone}`,
            height: "100vh",
            position: "sticky",
            top: 0,
            overflowY: "auto",
            overflowX: "hidden",
            transition: "width 0.28s ease, min-width 0.28s ease",
          }}>

            {/* Logo */}
            <div style={{ padding: collapsed ? "1.4rem 0" : "1.5rem 1.25rem", borderBottom:`1px solid ${P.stone}`, display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "space-between", gap:"0.5rem" }}>
              {!collapsed && (
                <Link href="/admin" style={{ textDecoration:"none" }}>
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.3rem", fontWeight:300, color:P.emerald, lineHeight:1 }}>Lemure Bleu</p>
                  <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.42rem", letterSpacing:"0.28em", textTransform:"uppercase", color:P.champagne, marginTop:"4px", fontWeight:400 }}>Admin OS</p>
                </Link>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                style={{ background:"none", border:`1px solid ${P.stone}`, color:P.warmGrey, cursor:"pointer", width:"22px", height:"22px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", flexShrink:0, fontFamily:"monospace" }}>
                {collapsed ? "›" : "‹"}
              </button>
            </div>

            {/* Nav */}
            <nav style={{ flex:1, paddingTop:"0.5rem", paddingBottom:"0.5rem" }}>
              {NAV.map(group => (
                <div key={group.section}>
                  {!collapsed && (
                    <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.42rem", letterSpacing:"0.28em", textTransform:"uppercase", color:P.champagne, opacity:0.65, padding:"0.85rem 1.25rem 0.35rem", fontWeight:400 }}>
                      {group.section}
                    </p>
                  )}
                  {group.items.map(item => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          padding: collapsed ? "0.7rem" : "0.55rem 1.25rem",
                          justifyContent: collapsed ? "center" : "flex-start",
                          fontFamily: "Jost,sans-serif",
                          fontSize: "0.72rem",
                          fontWeight: active ? 400 : 300,
                          letterSpacing: "0.03em",
                          color: active ? P.emerald : P.warmGrey,
                          background: active ? `rgba(28,61,53,0.07)` : "transparent",
                          borderLeft: active ? `2px solid ${P.champagne}` : "2px solid transparent",
                          textDecoration: "none",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.color = P.emerald; e.currentTarget.style.background = `rgba(28,61,53,0.04)`; }}}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.color = P.warmGrey; e.currentTarget.style.background = "transparent"; }}}
                      >
                        <span style={{ color: active ? P.champagne : P.stone, fontSize:"0.78rem", flexShrink:0, fontFamily:"monospace" }}>{item.icon}</span>
                        {!collapsed && item.label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* View site */}
            <div style={{ borderTop:`1px solid ${P.stone}`, padding:"0.9rem 1.25rem" }}>
              <Link href="/" target="_blank"
                style={{ display:"flex", alignItems:"center", gap:"0.45rem", fontFamily:"Jost,sans-serif", fontSize:"0.62rem", fontWeight:300, color:P.stone, textDecoration:"none", justifyContent: collapsed ? "center" : "flex-start" }}
                onMouseEnter={e => e.currentTarget.style.color = P.emerald}
                onMouseLeave={e => e.currentTarget.style.color = P.stone}
              >
                <span style={{ fontSize:"0.7rem" }}>↗</span>
                {!collapsed && "View Website"}
              </Link>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"auto", minWidth:0 }}>

            {/* Top bar — white */}
            <div style={{
              padding: "0.75rem 2rem",
              background: P.white,
              borderBottom: `1px solid ${P.stone}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 20,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.52rem", letterSpacing:"0.18em", textTransform:"uppercase", color:P.warmGrey, fontWeight:300 }}>Admin</p>
                <div style={{ width:"3px", height:"3px", background:P.champagne, transform:"rotate(45deg)" }} />
                <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.52rem", letterSpacing:"0.12em", textTransform:"uppercase", color:P.emerald, fontWeight:300 }}>
                  {pathname.replace("/admin","").replace(/\//g," ").trim() || "Dashboard"}
                </p>
              </div>
              <Link href="/admin/invoices/new"
                style={{ fontFamily:"Jost,sans-serif", padding:"0.42rem 1rem", background:P.emerald, color:P.ivory, fontSize:"0.54rem", letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none", fontWeight:400, transition:"background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = P.emeraldMid}
                onMouseLeave={e => e.currentTarget.style.background = P.emerald}
              >
                + New Invoice
              </Link>
            </div>

            {/* Content — ivory-deep bg */}
            <div style={{ flex:1, padding:"2rem 2.5rem", background:P.ivoryDeep }}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
