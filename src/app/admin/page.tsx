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

  const S = (label:string,value:string|number,sub:string,color:string,href:string) => (
    <a href={href} key={label} style={{ display:"block", padding:"1.5rem", background:"var(--ivory)", border:"1px solid var(--stone)", textDecoration:"none", transition:"all 0.2s" }}
      onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--champagne)")}
      onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--stone)")}>
      <p style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300, marginBottom:"0.5rem" }}>{label}</p>
      <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.2rem", fontWeight:300, color, lineHeight:1, marginBottom:"0.3rem" }}>{value}</p>
      <p style={{ fontSize:"0.7rem", color:"var(--stone)", fontWeight:300 }}>{sub}</p>
    </a>
  );

  return (
    <div>
      <div style={{ marginBottom:"2.5rem" }}>
        <p style={{ fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--champagne)", marginBottom:"0.5rem" }}>Overview</p>
        <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.5rem", fontWeight:300, color:"var(--emerald)" }}>Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"1rem", marginBottom:"2.5rem" }}>
        {S("VIP Leads", stats.leads, `${stats.pendingLeads} new`, "var(--emerald)", "/admin/leads")}
        {S("Appointments", stats.appointments, `${stats.pendingAppts} pending`, "var(--emerald)", "/admin/appointments")}
        {S("Preorders", stats.preorders, "Deposits received", "var(--emerald)", "/admin/preorders")}
        {S("Revenue SGD", `$${stats.revenue.toLocaleString()}`, "Confirmed paid", "var(--champagne)", "/admin/purchases")}
        {S("Invoiced SGD", `$${stats.totalInvoiced.toLocaleString()}`, `${stats.unpaidInvoices} unpaid`, "var(--champagne)", "/admin/invoices")}
        {S("Purchases", stats.purchases, "All transactions", "var(--emerald)", "/admin/purchases")}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom:"2rem" }}>
        <p style={{ fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--warm-grey)", marginBottom:"1rem" }}>Quick Actions</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"0.75rem" }}>
          {[
            { href:"/admin/invoices/new", label:"Create Invoice", desc:"Bill a client with QR payment" },
            { href:"/admin/products", label:"Add Product", desc:"Post to website with images/video" },
            { href:"/admin/sections", label:"Edit Site Sections", desc:"Show/hide/edit website content" },
            { href:"/admin/leads", label:"View VIP Leads", desc:"Manage client pipeline" },
            { href:"/admin/purchases", label:"Purchase Records", desc:"All orders and bookings" },
            { href:"/admin/appointments", label:"Appointments", desc:"Review bookings" },
          ].map(a => (
            <a key={a.href} href={a.href} style={{ padding:"1.25rem", background:"var(--ivory)", border:"1px solid var(--stone)", textDecoration:"none", transition:"all 0.2s", display:"block" }}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--emerald)";e.currentTarget.style.borderColor="var(--emerald)";(e.currentTarget.querySelector(".qa-title") as HTMLElement).style.color="var(--ivory)";(e.currentTarget.querySelector(".qa-desc") as HTMLElement).style.color="rgba(247,242,232,0.5)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="var(--ivory)";e.currentTarget.style.borderColor="var(--stone)";(e.currentTarget.querySelector(".qa-title") as HTMLElement).style.color="var(--emerald)";(e.currentTarget.querySelector(".qa-desc") as HTMLElement).style.color="var(--warm-grey)"}}>
              <p className="qa-title" style={{ fontSize:"0.78rem", fontWeight:400, color:"var(--emerald)", marginBottom:"0.25rem", transition:"color 0.2s" }}>{a.label}</p>
              <p className="qa-desc" style={{ fontSize:"0.68rem", color:"var(--warm-grey)", fontWeight:300, transition:"color 0.2s" }}>{a.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
