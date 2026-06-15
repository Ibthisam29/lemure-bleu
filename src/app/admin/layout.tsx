"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_GROUPS = [
  { label: "Overview", links: [
    { href: "/admin",              icon: "⬡", text: "Dashboard" },
  ]},
  { label: "Website CMS", links: [
    { href: "/admin/hero",         icon: "▣", text: "Hero Section" },
    { href: "/admin/sections",     icon: "▤", text: "Page Sections" },
    { href: "/admin/products",     icon: "◈", text: "Products" },
    { href: "/admin/stones",       icon: "◆", text: "Stone Vault" },
    { href: "/admin/collections",  icon: "◉", text: "Collections" },
    { href: "/admin/events",       icon: "◎", text: "Events" },
    { href: "/admin/ads",          icon: "◇", text: "Ads & Banners" },
  ]},
  { label: "Clients", links: [
    { href: "/admin/leads",        icon: "◐", text: "VIP Leads" },
    { href: "/admin/appointments", icon: "◑", text: "Appointments" },
    { href: "/admin/purchases",    icon: "◒", text: "Purchase Records" },
  ]},
  { label: "Payments", links: [
    { href: "/admin/invoices",     icon: "◓", text: "Invoices" },
    { href: "/admin/preorders",    icon: "◔", text: "Preorders" },
  ]},
  { label: "System", links: [
    { href: "/admin/settings",     icon: "○", text: "Settings" },
  ]},
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const crumb = pathname === "/admin" ? "Dashboard"
    : pathname.split("/").filter(Boolean).slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g," ")).join(" › ");

  return (
    <div style={{ display:"flex", minHeight:"100vh", backgroundColor:"#EDE6D6", fontFamily:"'Jost',sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? "54px" : "218px",
        minWidth: collapsed ? "54px" : "218px",
        flexShrink: 0,
        backgroundColor: "#F7F2E8",
        borderRight: "1px solid #CFC8BC",
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width .28s ease, min-width .28s ease",
        zIndex: 40,
      }}>

        {/* Brand */}
        <div style={{ padding: collapsed ? "1.25rem 0" : "1.4rem 1.2rem", borderBottom:"1px solid #CFC8BC", display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "space-between", gap:"0.5rem", backgroundColor:"#F7F2E8" }}>
          {!collapsed && (
            <Link href="/admin" style={{ textDecoration:"none" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", fontWeight:300, color:"#1C3D35", lineHeight:1 }}>Lemure Bleu</div>
              <div style={{ fontSize:"0.4rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"#C4965A", marginTop:"4px", fontWeight:500 }}>Admin OS</div>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background:"none", border:"1px solid #CFC8BC", color:"#8C857A", cursor:"pointer", width:"22px", height:"22px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0, padding:0, borderRadius:0 }}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, paddingTop:"0.5rem", paddingBottom:"1rem", backgroundColor:"#F7F2E8" }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <div style={{ fontSize:"0.42rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"#C4965A", opacity:0.65, padding:"0.9rem 1.2rem 0.3rem", fontWeight:500 }}>
                  {group.label}
                </div>
              )}
              {group.links.map(link => {
                const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                return (
                  <Link key={link.href} href={link.href} title={collapsed ? link.text : undefined} style={{
                    display: "flex", alignItems: "center", gap: "0.55rem",
                    padding: collapsed ? "0.7rem" : "0.52rem 1.2rem",
                    justifyContent: collapsed ? "center" : "flex-start",
                    fontSize: "0.71rem", fontWeight: active ? 500 : 300,
                    color: active ? "#1C3D35" : "#8C857A",
                    backgroundColor: active ? "rgba(28,61,53,0.08)" : "transparent",
                    borderLeft: active ? "2px solid #C4965A" : "2px solid transparent",
                    textDecoration: "none",
                    transition: "all .15s",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color="#1C3D35"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor="rgba(28,61,53,0.04)"; }}}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color="#8C857A"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor="transparent"; }}}
                  >
                    <span style={{ fontSize:"0.75rem", color: active ? "#C4965A" : "#CFC8BC", flexShrink:0 }}>{link.icon}</span>
                    {!collapsed && link.text}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ borderTop:"1px solid #CFC8BC", padding:"0.9rem 1.2rem", backgroundColor:"#F7F2E8" }}>
          <Link href="/" target="_blank" style={{ display:"flex", alignItems:"center", gap:"0.4rem", fontSize:"0.62rem", fontWeight:300, color:"#CFC8BC", textDecoration:"none", justifyContent: collapsed ? "center" : "flex-start" }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color="#1C3D35"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color="#CFC8BC"}
          >
            <span>↗</span>{!collapsed && "View Website"}
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"auto" }}>

        {/* Topbar */}
        <div style={{ backgroundColor:"#FFFFFF", borderBottom:"1px solid #CFC8BC", padding:"0.7rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:30, boxShadow:"0 1px 0 rgba(207,200,188,.4)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
            <span style={{ fontSize:"0.5rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"#8C857A", fontWeight:300 }}>Admin</span>
            <span style={{ width:"3px", height:"3px", backgroundColor:"#C4965A", transform:"rotate(45deg)", display:"inline-block" }} />
            <span style={{ fontSize:"0.5rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#1C3D35", fontWeight:400 }}>{crumb}</span>
          </div>
          <div style={{ display:"flex", gap:"0.6rem" }}>
            <Link href="/admin/invoices/new" style={{ backgroundColor:"#1C3D35", color:"#F7F2E8", padding:"0.4rem 0.9rem", fontSize:"0.54rem", letterSpacing:"0.18em", textTransform:"uppercase", textDecoration:"none", fontWeight:400, transition:"background .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor="#2A5446"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor="#1C3D35"}
            >+ Invoice</Link>
            <Link href="/admin/products" style={{ backgroundColor:"#C4965A", color:"#F7F2E8", padding:"0.4rem 0.9rem", fontSize:"0.54rem", letterSpacing:"0.18em", textTransform:"uppercase", textDecoration:"none", fontWeight:400, transition:"background .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor="#B8854A"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor="#C4965A"}
            >+ Product</Link>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, padding:"2rem 2.5rem", backgroundColor:"#EDE6D6" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// cache-bust: 1781498241
