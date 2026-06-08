"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { A, statusPill } from "@/lib/adminStyles";
import { PageHeader } from "@/components/admin/PageHeader";

type Stats = { leads:number; newLeads:number; appts:number; pendingAppts:number; preorders:number; revenue:number; unpaidInvoices:number; totalInvoiced:number; purchases:number; publishedProducts:number; availableStones:number; };
type Lead = { id:string; full_name:string; email:string; interest_type:string; status:string; };
type Invoice = { id:string; invoice_number:string; client_name:string; total:number; status:string; };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats|null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetch("/api/admin/dashboard-stats").then(r=>r.json()).then(d => {
      setStats(d.stats); setLeads(d.leads||[]); setInvoices(d.invoices||[]);
    }).catch(()=>{});
  }, []);

  const emeraldCards = [
    { label:"VIP Leads",       value: stats?.leads ?? "—",             sub:`${stats?.newLeads ?? 0} new`,          href:"/admin/leads" },
    { label:"Appointments",    value: stats?.appts ?? "—",             sub:`${stats?.pendingAppts ?? 0} pending`,   href:"/admin/appointments" },
    { label:"Products Live",   value: stats?.publishedProducts ?? "—", sub:"On website",                            href:"/admin/products" },
    { label:"Stones Available",value: stats?.availableStones ?? "—",   sub:"In vault",                             href:"/admin/stones" },
  ];

  const whiteCards = [
    { label:"Revenue (SGD)",  value:`$${(stats?.revenue ?? 0).toLocaleString()}`,       sub:"Confirmed paid",             color:A.champagne, href:"/admin/purchases" },
    { label:"Invoiced (SGD)", value:`$${(stats?.totalInvoiced ?? 0).toLocaleString()}`, sub:`${stats?.unpaidInvoices ?? 0} unpaid`, color:A.champagne, href:"/admin/invoices" },
    { label:"Preorders",      value: stats?.preorders ?? "—",                            sub:"Deposit registered",          color:A.emerald,   href:"/admin/preorders" },
  ];

  const actions = [
    { href:"/admin/hero",         label:"Edit Hero",          icon:"▣" },
    { href:"/admin/products",     label:"Add Product",        icon:"◈" },
    { href:"/admin/events",       label:"Add Event",          icon:"◎" },
    { href:"/admin/ads",          label:"Create Banner",      icon:"◇" },
    { href:"/admin/invoices/new", label:"New Invoice",        icon:"◓" },
    { href:"/admin/stones",       label:"Stone Vault",        icon:"◆" },
    { href:"/admin/leads",        label:"VIP Leads",          icon:"◐" },
    { href:"/admin/appointments", label:"Appointments",       icon:"◑" },
  ];

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Dashboard" sub="Lemure Bleu Admin OS" />

      {/* Emerald top cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1rem" }}>
        {emeraldCards.map(c => (
          <Link key={c.label} href={c.href} style={{ display:"block", textDecoration:"none", backgroundColor:A.emerald, border:`1px solid ${A.emeraldMid}`, padding:"1.5rem", position:"relative" }}>
            <div style={{ position:"absolute", top:"10px", right:"10px", width:"7px", height:"7px", borderTop:"1px solid rgba(196,150,90,.3)", borderRight:"1px solid rgba(196,150,90,.3)" }} />
            <div style={{ fontSize:"0.48rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(196,150,90,.75)", marginBottom:"0.6rem", fontFamily:"'Jost',sans-serif" }}>{c.label}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.8rem", fontWeight:300, color:A.ivory, lineHeight:1, marginBottom:"0.35rem" }}>{c.value}</div>
            <div style={{ fontSize:"0.65rem", color:"rgba(247,242,232,.4)", fontWeight:300, fontFamily:"'Jost',sans-serif" }}>{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* White bottom cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2rem" }}>
        {whiteCards.map(c => (
          <Link key={c.label} href={c.href} style={{ display:"block", textDecoration:"none", backgroundColor:A.white, border:`1px solid ${A.stone}`, padding:"1.5rem" }}>
            <div style={{ fontSize:"0.48rem", letterSpacing:"0.2em", textTransform:"uppercase", color:A.warmGrey, marginBottom:"0.6rem", fontFamily:"'Jost',sans-serif" }}>{c.label}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.5rem", fontWeight:300, color:c.color, lineHeight:1, marginBottom:"0.35rem" }}>{c.value}</div>
            <div style={{ fontSize:"0.65rem", color:A.stone, fontWeight:300, fontFamily:"'Jost',sans-serif" }}>{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* Two column recent data */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"2rem" }}>
        {/* Recent leads */}
        <div style={{ backgroundColor:A.white, border:`1px solid ${A.stone}` }}>
          <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${A.stone}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, fontWeight:300 }}>Recent VIP Leads</span>
            <Link href="/admin/leads" style={{ fontSize:"0.55rem", color:A.champagne, textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase" }}>View all</Link>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <tbody>
              {leads.map(l => (
                <tr key={l.id}>
                  <td style={{ ...A.td, paddingLeft:"1.25rem" }}>
                    <div style={{ fontSize:"0.78rem", color:A.emerald, fontWeight:300 }}>{l.full_name}</div>
                    <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{l.email}</div>
                  </td>
                  <td style={A.td}><div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{l.interest_type?.replace(/_/g," ")}</div></td>
                  <td style={{ ...A.td, paddingRight:"1.25rem" }}><span style={statusPill(l.status)}>{l.status?.replace(/_/g," ")}</span></td>
                </tr>
              ))}
              {leads.length===0 && <tr><td colSpan={3} style={{ padding:"2rem", textAlign:"center", color:A.stone, fontSize:"0.75rem" }}>{stats===null ? "Loading…" : "No leads yet"}</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Recent invoices */}
        <div style={{ backgroundColor:A.white, border:`1px solid ${A.stone}` }}>
          <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${A.stone}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, fontWeight:300 }}>Recent Invoices</span>
            <Link href="/admin/invoices/new" style={{ fontSize:"0.55rem", color:A.champagne, textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase" }}>+ New</Link>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ ...A.td, paddingLeft:"1.25rem" }}>
                    <Link href={`/admin/invoices/${inv.id}`} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:A.emerald, textDecoration:"none" }}>#{inv.invoice_number}</Link>
                    <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{inv.client_name}</div>
                  </td>
                  <td style={A.td}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:A.champagne }}>SGD {inv.total?.toLocaleString()}</div></td>
                  <td style={{ ...A.td, paddingRight:"1.25rem" }}><span style={statusPill(inv.status)}>{inv.status}</span></td>
                </tr>
              ))}
              {invoices.length===0 && <tr><td colSpan={3} style={{ padding:"2rem", textAlign:"center", color:A.stone, fontSize:"0.75rem" }}>{stats===null ? "Loading…" : "No invoices yet"}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ fontSize:"0.5rem", letterSpacing:"0.22em", textTransform:"uppercase", color:A.warmGrey, marginBottom:"1rem", fontFamily:"'Jost',sans-serif" }}>Quick Actions</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"0.6rem" }}>
        {actions.map(a => (
          <Link key={a.href} href={a.href} style={{ display:"flex", flexDirection:"column", gap:"0.4rem", padding:"1rem 1.1rem", backgroundColor:A.white, border:`1px solid ${A.stone}`, textDecoration:"none" }}>
            <span style={{ fontSize:"1rem", color:A.stone }}>{a.icon}</span>
            <span style={{ fontSize:"0.72rem", fontWeight:400, color:A.emerald, fontFamily:"'Jost',sans-serif" }}>{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
