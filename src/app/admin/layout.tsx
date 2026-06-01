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
    <div className="flex min-h-screen" style={{ background: "var(--ivory-deep)", fontFamily: "Jost, sans-serif" }}>
      <aside className="flex-shrink-0 flex flex-col transition-all duration-300"
        style={{ width: collapsed ? "60px" : "220px", background: "var(--emerald)", borderRight: "1px solid rgba(196,150,90,0.15)", position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
        <div className="flex items-center justify-between" style={{ padding: "1.75rem 1.25rem", borderBottom: "1px solid rgba(196,150,90,0.12)" }}>
          {!collapsed && (
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.3rem", fontWeight: 300, color: "var(--ivory)", lineHeight: 1 }}>Lemure Bleu</p>
              <p style={{ fontSize: "0.45rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(196,150,90,0.7)", marginTop: "3px" }}>Admin OS</p>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ color: "rgba(196,150,90,0.6)", fontSize: "1rem", background: "none", border: "none", cursor: "pointer", flexShrink: 0, lineHeight: 1 }}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map((group) => (
            <div key={group.section} className="mb-1">
              {!collapsed && (
                <p style={{ fontSize: "0.45rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(196,150,90,0.4)", padding: "0.75rem 1.25rem 0.4rem" }}>
                  {group.section}
                </p>
              )}
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
                    style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: collapsed ? "0.65rem" : "0.55rem 1.25rem", justifyContent: collapsed ? "center" : "flex-start", fontSize: "0.72rem", fontWeight: 300, letterSpacing: "0.04em", color: active ? "var(--ivory)" : "rgba(247,242,232,0.5)", background: active ? "rgba(196,150,90,0.15)" : "transparent", borderLeft: active ? "2px solid var(--champagne)" : "2px solid transparent", textDecoration: "none", transition: "all 0.2s" }}>
                    <span style={{ color: active ? "var(--champagne)" : "rgba(196,150,90,0.5)", fontSize: "0.85rem", flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid rgba(196,150,90,0.12)", padding: "1rem 1.25rem" }}>
          <Link href="/" target="_blank"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.65rem", color: "rgba(247,242,232,0.35)", textDecoration: "none", justifyContent: collapsed ? "center" : "flex-start" }}>
            <span>↗</span>{!collapsed && "View Site"}
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div style={{ padding: "0.875rem 2rem", background: "var(--ivory)", borderBottom: "1px solid var(--stone)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--warm-grey)", fontWeight: 300 }}>Lemure Bleu · Admin OS</p>
          <Link href="/admin/invoices/new" style={{ padding: "0.5rem 1.25rem", background: "var(--champagne)", color: "var(--ivory)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
            + New Invoice
          </Link>
        </div>
        <div style={{ padding: "2rem 2.5rem" }}>{children}</div>
      </main>
    </div>
  );
}
