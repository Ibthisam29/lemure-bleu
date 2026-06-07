"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { section: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: "◈" }]},
  { section: "Content", items: [
    { href: "/admin/products",    label: "Products & Media",   icon: "◇" },
    { href: "/admin/sections",    label: "Site Sections",      icon: "◎" },
    { href: "/admin/stones",      label: "Stone Vault",        icon: "◆" },
    { href: "/admin/collections", label: "Collections",        icon: "◉" },
    { href: "/admin/events",      label: "Events",             icon: "◖" },
    { href: "/admin/ads",         label: "Ads & Banners",      icon: "◗" },
  ]},
  { section: "Clients", items: [
    { href: "/admin/leads",        label: "VIP Leads",         icon: "◐" },
    { href: "/admin/appointments", label: "Appointments",      icon: "◑" },
    { href: "/admin/purchases",    label: "Purchase Records",  icon: "◒" },
  ]},
  { section: "Payments", items: [
    { href: "/admin/invoices",  label: "Invoices & Payments", icon: "◓" },
    { href: "/admin/preorders", label: "Preorders",           icon: "◔" },
  ]},
  { section: "System", items: [
    { href: "/admin/content",   label: "Content Editor", icon: "◕" },
    { href: "/admin/settings",  label: "Settings",       icon: "○" },
  ]},
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const crumb = pathname.replace("/admin", "").replace(/\//g, " ").trim() || "Dashboard";

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#EDE6D6",
      fontFamily: "'Jost', sans-serif",
      colorScheme: "light",
    }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{
        width: collapsed ? "52px" : "212px",
        minWidth: collapsed ? "52px" : "212px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F7F2E8",
        borderRight: "1px solid #CFC8BC",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.28s ease, min-width 0.28s ease",
        zIndex: 30,
      }}>

        {/* Brand */}
        <div style={{
          padding: collapsed ? "1.4rem 0" : "1.5rem 1.25rem",
          borderBottom: "1px solid #CFC8BC",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "0.5rem",
          backgroundColor: "#F7F2E8",
        }}>
          {!collapsed && (
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, color: "#1C3D35", lineHeight: 1, margin: 0 }}>Lemure Bleu</p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.42rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#C4965A", marginTop: "4px", fontWeight: 400 }}>Admin OS</p>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{
            background: "none",
            border: "1px solid #CFC8BC",
            color: "#8C857A",
            cursor: "pointer",
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            flexShrink: 0,
            padding: 0,
          }}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, paddingTop: "0.5rem", paddingBottom: "0.5rem", backgroundColor: "#F7F2E8" }}>
          {NAV.map(group => (
            <div key={group.section}>
              {!collapsed && (
                <p style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.42rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#C4965A",
                  opacity: 0.7,
                  padding: "0.85rem 1.25rem 0.35rem",
                  fontWeight: 400,
                  margin: 0,
                }}>{group.section}</p>
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
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: active ? 400 : 300,
                      letterSpacing: "0.03em",
                      color: active ? "#1C3D35" : "#8C857A",
                      backgroundColor: active ? "rgba(28,61,53,0.08)" : "transparent",
                      borderLeft: active ? "2px solid #C4965A" : "2px solid transparent",
                      textDecoration: "none",
                      transition: "all 0.15s",
                    }}>
                    <span style={{ color: active ? "#C4965A" : "#CFC8BC", fontSize: "0.78rem", flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* View site link */}
        <div style={{ borderTop: "1px solid #CFC8BC", padding: "0.9rem 1.25rem", backgroundColor: "#F7F2E8" }}>
          <Link href="/" target="_blank" style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", fontWeight: 300,
            color: "#CFC8BC", textDecoration: "none",
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <span>↗</span>
            {!collapsed && "View Website"}
          </Link>
        </div>
      </aside>

      {/* ══ MAIN AREA ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0, backgroundColor: "#EDE6D6" }}>

        {/* Top bar */}
        <div style={{
          padding: "0.75rem 2rem",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #CFC8BC",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 20,
          boxShadow: "0 1px 4px rgba(207,200,188,0.3)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8C857A", fontWeight: 300 }}>Admin</span>
            <div style={{ width: "3px", height: "3px", backgroundColor: "#C4965A", transform: "rotate(45deg)" }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1C3D35", fontWeight: 300 }}>{crumb}</span>
          </div>
          <Link href="/admin/invoices/new" style={{
            fontFamily: "'Jost', sans-serif",
            padding: "0.42rem 1rem",
            backgroundColor: "#1C3D35",
            color: "#F7F2E8",
            fontSize: "0.54rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 400,
          }}>
            + New Invoice
          </Link>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "2rem 2.5rem", backgroundColor: "#EDE6D6" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
