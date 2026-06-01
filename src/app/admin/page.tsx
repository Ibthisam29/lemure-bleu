export default async function AdminDashboard() {
  let stats = { leads:0, appointments:0, preorders:0, revenue:0, pendingLeads:0, pendingAppts:0, unpaidInvoices:0, totalInvoiced:0, purchases:0 };
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createAdminClient } = await import("@/lib/supabase");
      const sb = createAdminClient();
      const [leads, appts, preorders, invoices, purchases] = await Promise.all([
        sb.from("vip_leads").select("id,status"),
        sb.from("appointments").select("id,status"),
        sb.from("preorders").select("id,amount,payment_status"),
        sb.from("invoices").select("id,total,status"),
        sb.from("purchases").select("id,amount,payment_status"),
      ]);
      stats.leads = leads.data?.length || 0;
      stats.appointments = appts.data?.length || 0;
      stats.preorders = preorders.data?.length || 0;
      stats.pendingLeads = (leads.data||[]).filter((l:{status:string})=>l.status==="new").length;
      stats.pendingAppts = (appts.data||[]).filter((a:{status:string})=>a.status==="pending").length;
      stats.revenue = (preorders.data||[]).filter((p:{payment_status:string})=>p.payment_status==="paid").reduce((s,p:{amount:number})=>s+p.amount,0);
      stats.unpaidInvoices = (invoices.data||[]).filter((i:{status:string})=>i.status==="unpaid").length;
      stats.totalInvoiced = (invoices.data||[]).reduce((s,i:{total:number})=>s+i.total,0);
      stats.purchases = purchases.data?.length || 0;
    }
  } catch {}

  const emeraldCards = [
    { label:"VIP Leads",    value:stats.leads,      sub:`${stats.pendingLeads} new`,      href:"/admin/leads" },
    { label:"Appointments", value:stats.appointments, sub:`${stats.pendingAppts} pending`, href:"/admin/appointments" },
    { label:"Preorders",    value:stats.preorders,   sub:"Deposits received",              href:"/admin/preorders" },
  ];

  const whiteCards = [
    { label:"Revenue SGD",  value:`$${stats.revenue.toLocaleString()}`,      sub:"Confirmed paid",            href:"/admin/purchases",  accent:"#C4965A" },
    { label:"Invoiced SGD", value:`$${stats.totalInvoiced.toLocaleString()}`, sub:`${stats.unpaidInvoices} unpaid`, href:"/admin/invoices", accent:"#C4965A" },
    { label:"Purchases",    value:stats.purchases,   sub:"All transactions",               href:"/admin/purchases",  accent:"#1C3D35" },
  ];

  const actions = [
    { href:"/admin/invoices/new", label:"Create Invoice",     desc:"Bill a client with QR payment",   icon:"◓" },
    { href:"/admin/products",     label:"Add Product",        desc:"Post to website with images/video", icon:"◇" },
    { href:"/admin/sections",     label:"Edit Site Sections", desc:"Show/hide/edit website content",   icon:"◎" },
    { href:"/admin/leads",        label:"VIP Leads",          desc:"Manage client pipeline",            icon:"◐" },
    { href:"/admin/purchases",    label:"Purchase Records",   desc:"All orders and bookings",           icon:"◒" },
    { href:"/admin/appointments", label:"Appointments",       desc:"Review and approve bookings",       icon:"◑" },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom:"2rem" }}>
        <p style={{ fontSize:"0.52rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"#C4965A", marginBottom:"0.4rem", fontFamily:"Jost,sans-serif" }}>Overview</p>
        <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.5rem", fontWeight:300, color:"#1C3D35" }}>Dashboard</h1>
      </div>

      {/* Emerald stat cards — top row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"1rem" }}>
        {emeraldCards.map(card => (
          <a key={card.label} href={card.href}
            style={{ display:"block", padding:"1.75rem", background:"#1C3D35", border:"1px solid #2A5446", textDecoration:"none", transition:"all 0.2s", position:"relative", overflow:"hidden" }}
            onMouseEnter={e=>e.currentTarget.style.background="#2A5446"}
            onMouseLeave={e=>e.currentTarget.style.background="#1C3D35"}
          >
            {/* Subtle corner ornament */}
            <div style={{ position:"absolute", top:"12px", right:"12px", width:"8px", height:"8px", borderTop:"1px solid rgba(196,150,90,0.3)", borderRight:"1px solid rgba(196,150,90,0.3)" }} />
            <p style={{ fontSize:"0.5rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(196,150,90,0.7)", marginBottom:"0.75rem", fontFamily:"Jost,sans-serif" }}>{card.label}</p>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"3rem", fontWeight:300, color:"#F7F2E8", lineHeight:1, marginBottom:"0.5rem" }}>{card.value}</p>
            <p style={{ fontSize:"0.68rem", color:"rgba(247,242,232,0.4)", fontWeight:300, fontFamily:"Jost,sans-serif" }}>{card.sub}</p>
          </a>
        ))}
      </div>

      {/* White stat cards — second row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2.5rem" }}>
        {whiteCards.map(card => (
          <a key={card.label} href={card.href}
            style={{ display:"block", padding:"1.75rem", background:"#FFFFFF", border:"1px solid #CFC8BC", textDecoration:"none", transition:"all 0.2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="#1C3D35"; e.currentTarget.style.boxShadow="0 4px 20px rgba(28,61,53,0.08)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="#CFC8BC"; e.currentTarget.style.boxShadow="none"; }}
          >
            <p style={{ fontSize:"0.5rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#8C857A", marginBottom:"0.75rem", fontFamily:"Jost,sans-serif" }}>{card.label}</p>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.5rem", fontWeight:300, color:card.accent, lineHeight:1, marginBottom:"0.5rem" }}>{card.value}</p>
            <p style={{ fontSize:"0.68rem", color:"#CFC8BC", fontWeight:300, fontFamily:"Jost,sans-serif" }}>{card.sub}</p>
          </a>
        ))}
      </div>

      {/* Divider */}
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.5rem" }}>
        <div style={{ height:"1px", flex:1, background:"#CFC8BC" }} />
        <div style={{ width:"4px", height:"4px", background:"#C4965A", transform:"rotate(45deg)" }} />
        <div style={{ height:"1px", flex:1, background:"#CFC8BC" }} />
      </div>

      {/* Quick actions */}
      <p style={{ fontSize:"0.52rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#8C857A", marginBottom:"1rem", fontFamily:"Jost,sans-serif" }}>Quick Actions</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"0.75rem" }}>
        {actions.map(a => (
          <a key={a.href} href={a.href}
            style={{ padding:"1.25rem 1.5rem", background:"#FFFFFF", border:"1px solid #CFC8BC", textDecoration:"none", transition:"all 0.25s", display:"flex", flexDirection:"column", gap:"0.3rem" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="#1C3D35"; e.currentTarget.style.borderColor="#1C3D35"; (e.currentTarget.querySelector(".qa-icon") as HTMLElement).style.color="#C4965A"; (e.currentTarget.querySelector(".qa-t") as HTMLElement).style.color="#F7F2E8"; (e.currentTarget.querySelector(".qa-d") as HTMLElement).style.color="rgba(247,242,232,0.5)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="#FFFFFF"; e.currentTarget.style.borderColor="#CFC8BC"; (e.currentTarget.querySelector(".qa-icon") as HTMLElement).style.color="#CFC8BC"; (e.currentTarget.querySelector(".qa-t") as HTMLElement).style.color="#1C3D35"; (e.currentTarget.querySelector(".qa-d") as HTMLElement).style.color="#8C857A"; }}
          >
            <span className="qa-icon" style={{ fontSize:"1rem", color:"#CFC8BC", transition:"color 0.25s" }}>{a.icon}</span>
            <p className="qa-t" style={{ fontSize:"0.78rem", fontWeight:400, color:"#1C3D35", transition:"color 0.25s", fontFamily:"Jost,sans-serif" }}>{a.label}</p>
            <p className="qa-d" style={{ fontSize:"0.68rem", color:"#8C857A", fontWeight:300, transition:"color 0.25s", fontFamily:"Jost,sans-serif" }}>{a.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
