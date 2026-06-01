const P = { ivory:"#F7F2E8", ivoryDeep:"#EDE6D6", stone:"#CFC8BC", champagne:"#C4965A", emerald:"#1C3D35", emeraldMid:"#2A5446", warmGrey:"#8C857A", white:"#FFFFFF" };

export default async function AdminDashboard() {
  let s = { leads:0, appts:0, preorders:0, revenue:0, newLeads:0, pendingAppts:0, unpaid:0, invoiced:0, purchases:0 };
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createAdminClient } = await import("@/lib/supabase");
      const sb = createAdminClient();
      const [l, a, p, inv, pur] = await Promise.all([
        sb.from("vip_leads").select("id,status"),
        sb.from("appointments").select("id,status"),
        sb.from("preorders").select("id,amount,payment_status"),
        sb.from("invoices").select("id,total,status"),
        sb.from("purchases").select("id,amount,payment_status"),
      ]);
      s.leads    = l.data?.length||0;
      s.appts    = a.data?.length||0;
      s.preorders= p.data?.length||0;
      s.newLeads = (l.data||[]).filter((x:{status:string})=>x.status==="new").length;
      s.pendingAppts=(a.data||[]).filter((x:{status:string})=>x.status==="pending").length;
      s.revenue  = (p.data||[]).filter((x:{payment_status:string})=>x.payment_status==="paid").reduce((t,x:{amount:number})=>t+x.amount,0);
      s.unpaid   = (inv.data||[]).filter((x:{status:string})=>x.status==="unpaid").length;
      s.invoiced = (inv.data||[]).reduce((t,x:{total:number})=>t+x.total,0);
      s.purchases= pur.data?.length||0;
    }
  } catch {}

  // Emerald cards (top) — dark on emerald
  const emeraldStats = [
    { label:"VIP Leads",    value:s.leads,    sub:`${s.newLeads} new`,         href:"/admin/leads" },
    { label:"Appointments", value:s.appts,    sub:`${s.pendingAppts} pending`, href:"/admin/appointments" },
    { label:"Preorders",    value:s.preorders,sub:"Deposits received",          href:"/admin/preorders" },
  ];

  // White cards (bottom) — light bg
  const whiteStats = [
    { label:"Revenue (SGD)",  value:`$${s.revenue.toLocaleString()}`,  sub:"Confirmed paid",        color:P.champagne, href:"/admin/purchases" },
    { label:"Invoiced (SGD)", value:`$${s.invoiced.toLocaleString()}`, sub:`${s.unpaid} unpaid`,    color:P.champagne, href:"/admin/invoices" },
    { label:"Purchases",      value:s.purchases,                        sub:"All transactions",       color:P.emerald,   href:"/admin/purchases" },
  ];

  const actions = [
    { href:"/admin/invoices/new", label:"Create Invoice",     desc:"Bill a client with QR",       icon:"◓" },
    { href:"/admin/products",     label:"Add Product",        desc:"Post to website",              icon:"◇" },
    { href:"/admin/sections",     label:"Edit Site Sections", desc:"Show/hide content",            icon:"◎" },
    { href:"/admin/leads",        label:"VIP Leads",          desc:"Client pipeline",              icon:"◐" },
    { href:"/admin/purchases",    label:"Purchases",          desc:"Orders & bookings",            icon:"◒" },
    { href:"/admin/appointments", label:"Appointments",       desc:"Review bookings",              icon:"◑" },
  ];

  const H = (label:string) => (
    <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.52rem", letterSpacing:"0.22em", textTransform:"uppercase", color:P.warmGrey, fontWeight:300, marginBottom:"0.9rem" }}>{label}</p>
  );

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom:"1.75rem" }}>
        <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.52rem", letterSpacing:"0.25em", textTransform:"uppercase", color:P.champagne, marginBottom:"0.4rem", fontWeight:400 }}>Overview</p>
        <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.5rem", fontWeight:300, color:P.emerald, lineHeight:1.1 }}>Dashboard</h1>
      </div>

      {/* Emerald stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"1rem" }}>
        {emeraldStats.map(c => (
          <a key={c.label} href={c.href} style={{ display:"block", padding:"1.75rem 1.5rem", background:P.emerald, border:`1px solid ${P.emeraldMid}`, textDecoration:"none", position:"relative", overflow:"hidden", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background=P.emeraldMid}
            onMouseLeave={e=>e.currentTarget.style.background=P.emerald}>
            <div style={{ position:"absolute", top:"10px", right:"10px", width:"8px", height:"8px", borderTop:`1px solid rgba(196,150,90,0.3)`, borderRight:`1px solid rgba(196,150,90,0.3)` }} />
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.5rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(196,150,90,0.75)", marginBottom:"0.6rem", fontWeight:400 }}>{c.label}</p>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"3rem", fontWeight:300, color:P.ivory, lineHeight:1, marginBottom:"0.4rem" }}>{c.value}</p>
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.68rem", color:"rgba(247,242,232,0.4)", fontWeight:300 }}>{c.sub}</p>
          </a>
        ))}
      </div>

      {/* White stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2.5rem" }}>
        {whiteStats.map(c => (
          <a key={c.label} href={c.href} style={{ display:"block", padding:"1.5rem", background:P.white, border:`1px solid ${P.stone}`, textDecoration:"none", transition:"all 0.2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=P.emerald; e.currentTarget.style.boxShadow="0 4px 16px rgba(28,61,53,0.08)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=P.stone; e.currentTarget.style.boxShadow="none"; }}>
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.5rem", letterSpacing:"0.2em", textTransform:"uppercase", color:P.warmGrey, marginBottom:"0.6rem", fontWeight:300 }}>{c.label}</p>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.5rem", fontWeight:300, color:c.color, lineHeight:1, marginBottom:"0.4rem" }}>{c.value}</p>
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.68rem", color:P.stone, fontWeight:300 }}>{c.sub}</p>
          </a>
        ))}
      </div>

      {/* Ornament divider */}
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.5rem" }}>
        <div style={{ flex:1, height:"1px", background:P.stone }} />
        <div style={{ width:"4px", height:"4px", background:P.champagne, transform:"rotate(45deg)" }} />
        <div style={{ flex:1, height:"1px", background:P.stone }} />
      </div>

      {/* Quick actions */}
      {H("Quick Actions")}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:"0.75rem" }}>
        {actions.map(a => (
          <a key={a.href} href={a.href}
            style={{ padding:"1.25rem 1.25rem", background:P.white, border:`1px solid ${P.stone}`, textDecoration:"none", display:"flex", flexDirection:"column", gap:"0.25rem", transition:"all 0.22s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background=P.emerald; e.currentTarget.style.borderColor=P.emerald; (e.currentTarget.querySelector(".i") as HTMLElement).style.color=P.champagne; (e.currentTarget.querySelector(".t") as HTMLElement).style.color=P.ivory; (e.currentTarget.querySelector(".d") as HTMLElement).style.color="rgba(247,242,232,0.5)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=P.white; e.currentTarget.style.borderColor=P.stone; (e.currentTarget.querySelector(".i") as HTMLElement).style.color=P.stone; (e.currentTarget.querySelector(".t") as HTMLElement).style.color=P.emerald; (e.currentTarget.querySelector(".d") as HTMLElement).style.color=P.warmGrey; }}
          >
            <span className="i" style={{ fontSize:"0.9rem", color:P.stone, transition:"color 0.22s", fontFamily:"monospace" }}>{a.icon}</span>
            <p className="t" style={{ fontFamily:"Jost,sans-serif", fontSize:"0.76rem", fontWeight:400, color:P.emerald, transition:"color 0.22s" }}>{a.label}</p>
            <p className="d" style={{ fontFamily:"Jost,sans-serif", fontSize:"0.67rem", fontWeight:300, color:P.warmGrey, transition:"color 0.22s" }}>{a.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
