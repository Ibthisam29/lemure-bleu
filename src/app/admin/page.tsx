import { A, PageHeader, statusPill } from "@/lib/adminStyles";
import Link from "next/link";

async function getStats() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const { createAdminClient } = await import("@/lib/supabase");
    const sb = createAdminClient();
    const [leads, appts, preorders, invoices, purchases, products, stones] = await Promise.all([
      sb.from("vip_leads").select("id,status"),
      sb.from("appointments").select("id,status"),
      sb.from("preorders").select("id,amount,payment_status"),
      sb.from("invoices").select("id,total,status"),
      sb.from("purchases").select("id,amount,payment_status"),
      sb.from("products").select("id,visible"),
      sb.from("stones").select("id,status"),
    ]);
    return {
      leads: leads.data?.length || 0,
      newLeads: leads.data?.filter((x:{status:string}) => x.status === "new").length || 0,
      appts: appts.data?.length || 0,
      pendingAppts: appts.data?.filter((x:{status:string}) => x.status === "pending").length || 0,
      preorders: preorders.data?.length || 0,
      revenue: preorders.data?.filter((x:{payment_status:string}) => x.payment_status === "paid").reduce((s,x:{amount:number}) => s+x.amount, 0) || 0,
      unpaidInvoices: invoices.data?.filter((x:{status:string}) => x.status === "unpaid").length || 0,
      totalInvoiced: invoices.data?.reduce((s,x:{total:number}) => s+(x.total||0), 0) || 0,
      purchases: purchases.data?.length || 0,
      publishedProducts: products.data?.filter((x:{visible:boolean}) => x.visible).length || 0,
      availableStones: stones.data?.filter((x:{status:string}) => x.status === "available").length || 0,
    };
  } catch { return null; }
}

async function getRecentLeads() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("vip_leads").select("id,full_name,email,interest_type,budget_range,status,created_at").order("created_at",{ascending:false}).limit(5);
    return data || [];
  } catch { return []; }
}

async function getRecentInvoices() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("invoices").select("id,invoice_number,client_name,total,status,created_at").order("created_at",{ascending:false}).limit(5);
    return data || [];
  } catch { return []; }
}

export default async function AdminDashboard() {
  const [stats, leads, invoices] = await Promise.all([getStats(), getRecentLeads(), getRecentInvoices()]);

  const emeraldCards = [
    { label:"VIP Leads", value: stats?.leads ?? "—", sub:`${stats?.newLeads ?? 0} new`, href:"/admin/leads" },
    { label:"Appointments", value: stats?.appts ?? "—", sub:`${stats?.pendingAppts ?? 0} pending`, href:"/admin/appointments" },
    { label:"Products Live", value: stats?.publishedProducts ?? "—", sub:"On website", href:"/admin/products" },
    { label:"Stones Available", value: stats?.availableStones ?? "—", sub:"In vault", href:"/admin/stones" },
  ];

  const whiteCards = [
    { label:"Revenue (SGD)", value:`$${(stats?.revenue ?? 0).toLocaleString()}`, sub:"Confirmed paid", color:A.champagne, href:"/admin/purchases" },
    { label:"Invoiced (SGD)", value:`$${(stats?.totalInvoiced ?? 0).toLocaleString()}`, sub:`${stats?.unpaidInvoices ?? 0} unpaid`, color:A.champagne, href:"/admin/invoices" },
    { label:"Preorders", value: stats?.preorders ?? "—", sub:"Deposit registered", color:A.emerald, href:"/admin/preorders" },
  ];

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Dashboard" sub="Lemure Bleu Admin OS · Real-time overview" />

      {/* Emerald cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1rem" }}>
        {emeraldCards.map(c => (
          <Link key={c.label} href={c.href} style={{ display:"block", textDecoration:"none", backgroundColor:A.emerald, border:`1px solid ${A.emeraldMid}`, padding:"1.5rem", transition:"background .2s", position:"relative" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor=A.emeraldMid}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor=A.emerald}
          >
            <div style={{ position:"absolute", top:"10px", right:"10px", width:"7px", height:"7px", borderTop:"1px solid rgba(196,150,90,.3)", borderRight:"1px solid rgba(196,150,90,.3)" }} />
            <div style={{ fontSize:"0.48rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(196,150,90,.75)", marginBottom:"0.6rem", fontFamily:"'Jost',sans-serif" }}>{c.label}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.8rem", fontWeight:300, color:A.ivory, lineHeight:1, marginBottom:"0.35rem" }}>{c.value}</div>
            <div style={{ fontSize:"0.65rem", color:"rgba(247,242,232,.4)", fontWeight:300, fontFamily:"'Jost',sans-serif" }}>{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* White cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2rem" }}>
        {whiteCards.map(c => (
          <Link key={c.label} href={c.href} style={{ display:"block", textDecoration:"none", backgroundColor:A.white, border:`1px solid ${A.stone}`, padding:"1.5rem", transition:"all .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor=A.emerald; (e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(28,61,53,.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=A.stone; (e.currentTarget as HTMLElement).style.boxShadow="none"; }}
          >
            <div style={{ fontSize:"0.48rem", letterSpacing:"0.2em", textTransform:"uppercase", color:A.warmGrey, marginBottom:"0.6rem", fontFamily:"'Jost',sans-serif" }}>{c.label}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.5rem", fontWeight:300, color:c.color, lineHeight:1, marginBottom:"0.35rem" }}>{c.value}</div>
            <div style={{ fontSize:"0.65rem", color:A.stone, fontWeight:300, fontFamily:"'Jost',sans-serif" }}>{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* Two column tables */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>

        {/* Recent leads */}
        <div style={{ backgroundColor:A.white, border:`1px solid ${A.stone}` }}>
          <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${A.stone}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, fontWeight:300 }}>Recent VIP Leads</span>
            <Link href="/admin/leads" style={{ fontSize:"0.55rem", color:A.champagne, textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase" }}>View all →</Link>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <tbody>
              {leads.map((l:{id:string;full_name:string;email:string;interest_type:string;status:string;created_at:string}) => (
                <tr key={l.id}>
                  <td style={{ ...A.td, paddingLeft:"1.25rem" }}>
                    <div style={{ fontSize:"0.78rem", color:A.emerald, fontWeight:300 }}>{l.full_name}</div>
                    <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{l.email}</div>
                  </td>
                  <td style={A.td}>
                    <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{l.interest_type?.replace(/_/g," ")}</div>
                  </td>
                  <td style={{ ...A.td, paddingRight:"1.25rem" }}>
                    <span style={statusPill(l.status)}>{l.status?.replace(/_/g," ")}</span>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && <tr><td colSpan={3} style={{ padding:"2rem", textAlign:"center", color:A.stone, fontSize:"0.75rem" }}>No leads yet</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Recent invoices */}
        <div style={{ backgroundColor:A.white, border:`1px solid ${A.stone}` }}>
          <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${A.stone}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, fontWeight:300 }}>Recent Invoices</span>
            <Link href="/admin/invoices/new" style={{ fontSize:"0.55rem", color:A.champagne, textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase" }}>+ New →</Link>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <tbody>
              {invoices.map((inv:{id:string;invoice_number:string;client_name:string;total:number;status:string}) => (
                <tr key={inv.id}>
                  <td style={{ ...A.td, paddingLeft:"1.25rem" }}>
                    <Link href={`/admin/invoices/${inv.id}`} style={{ fontSize:"0.78rem", color:A.emerald, textDecoration:"none", fontFamily:"'Cormorant Garamond',serif" }}>#{inv.invoice_number}</Link>
                    <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{inv.client_name}</div>
                  </td>
                  <td style={A.td}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:A.champagne }}>SGD {inv.total?.toLocaleString()}</div>
                  </td>
                  <td style={{ ...A.td, paddingRight:"1.25rem" }}>
                    <span style={statusPill(inv.status)}>{inv.status}</span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={3} style={{ padding:"2rem", textAlign:"center", color:A.stone, fontSize:"0.75rem" }}>No invoices yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions grid */}
      <div style={{ marginTop:"2rem" }}>
        <div style={{ fontSize:"0.5rem", letterSpacing:"0.22em", textTransform:"uppercase", color:A.warmGrey, marginBottom:"1rem", fontFamily:"'Jost',sans-serif" }}>Quick Actions</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"0.6rem" }}>
          {[
            { href:"/admin/hero",         label:"Edit Hero",          icon:"▣" },
            { href:"/admin/products",     label:"Add Product",        icon:"◈" },
            { href:"/admin/events",       label:"Add Event",          icon:"◎" },
            { href:"/admin/ads",          label:"Create Banner",      icon:"◇" },
            { href:"/admin/invoices/new", label:"New Invoice",        icon:"◓" },
            { href:"/admin/stones",       label:"Stone Vault",        icon:"◆" },
            { href:"/admin/leads",        label:"VIP Leads",          icon:"◐" },
            { href:"/admin/appointments", label:"Appointments",       icon:"◑" },
          ].map(a => (
            <Link key={a.href} href={a.href} style={{ display:"flex", flexDirection:"column", gap:"0.4rem", padding:"1rem 1.1rem", backgroundColor:A.white, border:`1px solid ${A.stone}`, textDecoration:"none", transition:"all .22s" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor=A.emerald; el.style.borderColor=A.emerald; (el.querySelector(".qa-i") as HTMLElement).style.color=A.champagne; (el.querySelector(".qa-t") as HTMLElement).style.color=A.ivory; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor=A.white; el.style.borderColor=A.stone; (el.querySelector(".qa-i") as HTMLElement).style.color=A.stone; (el.querySelector(".qa-t") as HTMLElement).style.color=A.emerald; }}
            >
              <span className="qa-i" style={{ fontSize:"1rem", color:A.stone, transition:"color .22s" }}>{a.icon}</span>
              <span className="qa-t" style={{ fontSize:"0.72rem", fontWeight:400, color:A.emerald, fontFamily:"'Jost',sans-serif", transition:"color .22s" }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
