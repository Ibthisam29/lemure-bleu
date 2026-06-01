import Link from "next/link";

async function getInvoices() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("invoices").select("*").order("created_at",{ascending:false});
    return data || [];
  } catch { return []; }
}

const STATUS_COLOR: Record<string,string> = { draft:"#aaa", unpaid:"#C4963A", paid:"#3D8B5E", partial:"#7A5FA0", cancelled:"#8B3A3A" };

export default async function AdminInvoicesPage() {
  const invoices = await getInvoices();
  const totalUnpaid = invoices.filter((i:{status:string})=>i.status==="unpaid").reduce((s:number,i:{total:number})=>s+i.total,0);
  const totalPaid = invoices.filter((i:{status:string})=>i.status==="paid").reduce((s:number,i:{total:number})=>s+i.total,0);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <p style={{ fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--champagne)", marginBottom:"0.4rem" }}>Payments</p>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.2rem", fontWeight:300, color:"var(--emerald)" }}>Invoices</h1>
        </div>
        <Link href="/admin/invoices/new" style={{ padding:"0.6rem 1.5rem", background:"var(--champagne)", color:"var(--ivory)", fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none", fontFamily:"Jost,sans-serif" }}>
          + New Invoice
        </Link>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2rem" }}>
        {[
          { label:"Total Invoiced", value:`SGD ${(totalUnpaid+totalPaid).toLocaleString()}`, color:"var(--emerald)" },
          { label:"Outstanding", value:`SGD ${totalUnpaid.toLocaleString()}`, color:"var(--champagne)" },
          { label:"Collected", value:`SGD ${totalPaid.toLocaleString()}`, color:"#3D8B5E" },
        ].map(s=>(
          <div key={s.label} style={{ background:"var(--ivory)", border:"1px solid var(--stone)", padding:"1.25rem" }}>
            <p style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300, marginBottom:"0.4rem" }}>{s.label}</p>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.8rem", fontWeight:300, color:s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--stone)" }}>
              {["Invoice #","Client","Items","Total","Status","Due","Actions"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"0.75rem 1rem", fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv:{ id:string; invoice_number:string; client_name:string; client_email:string; line_items:{description:string}[]; total:number; status:string; due_date:string; currency:string }) => (
              <tr key={inv.id} style={{ borderBottom:"1px solid rgba(216,210,200,0.5)" }}>
                <td style={{ padding:"0.875rem 1rem" }}>
                  <Link href={`/admin/invoices/${inv.id}`} style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1rem", color:"var(--emerald)", textDecoration:"none", fontWeight:300 }}>
                    #{inv.invoice_number}
                  </Link>
                </td>
                <td style={{ padding:"0.875rem 1rem" }}>
                  <p style={{ fontSize:"0.8rem", color:"var(--emerald)", fontWeight:300 }}>{inv.client_name}</p>
                  <p style={{ fontSize:"0.65rem", color:"var(--warm-grey)", fontWeight:300 }}>{inv.client_email}</p>
                </td>
                <td style={{ padding:"0.875rem 1rem", fontSize:"0.72rem", color:"var(--warm-grey)", fontWeight:300 }}>
                  {(inv.line_items||[]).slice(0,2).map((l:{description:string})=>l.description).join(", ")}
                </td>
                <td style={{ padding:"0.875rem 1rem", fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:"var(--emerald)", fontWeight:300 }}>
                  {inv.currency} {inv.total?.toLocaleString()}
                </td>
                <td style={{ padding:"0.875rem 1rem" }}>
                  <span style={{ padding:"0.25rem 0.6rem", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:STATUS_COLOR[inv.status]||"#aaa", border:`1px solid ${STATUS_COLOR[inv.status]||"#aaa"}40`, background:`${STATUS_COLOR[inv.status]||"#aaa"}10` }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding:"0.875rem 1rem", fontSize:"0.72rem", color:"var(--warm-grey)", fontWeight:300 }}>
                  {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}
                </td>
                <td style={{ padding:"0.875rem 1rem" }}>
                  <Link href={`/admin/invoices/${inv.id}`} style={{ fontSize:"0.65rem", color:"var(--champagne)", textDecoration:"none", marginRight:"0.75rem" }}>View</Link>
                  <Link href={`/pay/${inv.id}`} target="_blank" style={{ fontSize:"0.65rem", color:"var(--emerald)", textDecoration:"none" }}>QR Pay</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length===0 && (
          <p style={{ textAlign:"center", padding:"3rem", color:"var(--stone)", fontSize:"0.8rem" }}>No invoices yet. Create your first invoice.</p>
        )}
      </div>
    </div>
  );
}
