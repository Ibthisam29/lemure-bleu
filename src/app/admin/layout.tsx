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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#F7F2E8", fontFamily:"Jost,sans-serif" }}>

      {/* ── Sidebar — ivory bg, emerald text ── */}
      <aside style={{
        width: collapsed ? "56px" : "216px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "#F7F2E8",
        borderRight: "1px solid #CFC8BC",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.3s ease",
      }}>

        {/* Logo */}
        <div style={{ padding:"1.6rem 1.2rem", borderBottom:"1px solid #CFC8BC", display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "space-between", gap:"0.5rem" }}>
          {!collapsed && (
            <Link href="/admin" style={{ textDecoration:"none" }}>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.25rem", fontWeight:300, color:"#1C3D35", lineHeight:1 }}>Lemure Bleu</p>
              <p style={{ fontSize:"0.42rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"#C4965A", marginTop:"3px" }}>Admin OS</p>
            </Link>
          )}
          <button onClick={()=>setCollapsed(!collapsed)}
            style={{ background:"none", border:"1px solid #CFC8BC", color:"#8C857A", cursor:"pointer", width:"24px", height:"24px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem", flexShrink:0 }}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"0.75rem 0" }}>
          {NAV.map((group) => (
            <div key={group.section} style={{ marginBottom:"0.25rem" }}>
              {!collapsed && (
                <p style={{ fontSize:"0.42rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"#C4965A", opacity:0.7, padding:"0.7rem 1.2rem 0.3rem" }}>
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
                      fontSize:"0.7rem", fontWeight: active ? 400 : 300,
                      letterSpacing:"0.04em",
                      color: active ? "#1C3D35" : "#8C857A",
                      background: active ? "rgba(28,61,53,0.07)" : "transparent",
                      borderLeft: active ? "2px solid #C4965A" : "2px solid transparent",
                      textDecoration:"none",
                      transition:"all 0.18s",
                    }}
                    onMouseEnter={e=>{ if(!active){ e.currentTarget.style.color="#1C3D35"; e.currentTarget.style.background="rgba(28,61,53,0.04)"; }}}
                    onMouseLeave={e=>{ if(!active){ e.currentTarget.style.color="#8C857A"; e.currentTarget.style.background="transparent"; }}}
                  >
                    <span style={{ color: active ? "#C4965A" : "#CFC8BC", fontSize:"0.8rem", flexShrink:0 }}>{item.icon}</span>
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop:"1px solid #CFC8BC", padding:"1rem 1.2rem" }}>
          <Link href="/" target="_blank"
            style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.62rem", color:"#CFC8BC", textDecoration:"none", justifyContent: collapsed ? "center" : "flex-start" }}
            onMouseEnter={e=>e.currentTarget.style.color="#1C3D35"}
            onMouseLeave={e=>e.currentTarget.style.color="#CFC8BC"}
          >
            <span>↗</span>{!collapsed && "View Site"}
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>

        {/* Top bar — white */}
        <div style={{
          padding:"0.8rem 2rem",
          background: "#FFFFFF",
          borderBottom:"1px solid #CFC8BC",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:10,
          boxShadow:"0 1px 0 rgba(207,200,188,0.5)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <p style={{ fontSize:"0.55rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"#8C857A", fontWeight:300 }}>
              Lemure Bleu
            </p>
            <div style={{ width:"3px", height:"3px", background:"#C4965A", transform:"rotate(45deg)" }} />
            <p style={{ fontSize:"0.55rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#1C3D35", fontWeight:300 }}>
              {pathname.replace("/admin","").replace(/\//g," · ").trim() || "Dashboard"}
            </p>
          </div>
          <Link href="/admin/invoices/new"
            style={{ padding:"0.45rem 1.1rem", background:"#1C3D35", color:"#F7F2E8", fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none", fontFamily:"Jost,sans-serif", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#2A5446"}
            onMouseLeave={e=>e.currentTarget.style.background="#1C3D35"}
          >
            + New Invoice
          </Link>
        </div>

        {/* Page content — ivory bg */}
        <div style={{ padding:"2rem 2.5rem", flex:1, background:"#F7F2E8" }}>{children}</div>
      </main>
    </div>
  );
}
