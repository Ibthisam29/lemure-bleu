import Link from "next/link";

async function getPurchases() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("purchases").select("*,invoices(invoice_number)").order("created_at",{ascending:false});
    return data || [];
  } catch { return []; }
}

const STATUS_COLOR: Record<string,string> = { pending:"#C4963A", paid:"#3D8B5E", partial:"#7A5FA0", refunded:"#aaa", cancelled:"#8B3A3A" };
const TYPE_LABEL: Record<string,string> = { product:"Product", stone:"Gemstone", preorder:"Preorder", appointment:"Consultation", collection:"Collection", custom:"Custom" };

export default async function AdminPurchasesPage() {
  const purchases = await getPurchases();
  const totalPaid = purchases.filter((p:{payment_status:string})=>p.payment_status==="paid").reduce((s:number,p:{amount:number})=>s+p.amount,0);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <p style={{ fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--champagne)", marginBottom:"0.4rem" }}>Client Records</p>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.2rem", fontWeight:300, color:"var(--emerald)" }}>Purchase Records</h1>
          <p style={{ fontSize:"0.75rem", color:"var(--warm-grey)", fontWeight:300, marginTop:"0.25rem" }}>All orders, bookings, and consultations</p>
        </div>
        <Link href="/admin/purchases/new" style={{ padding:"0.6rem 1.5rem", background:"var(--champagne)", color:"var(--ivory)", fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none", fontFamily:"Jost,sans-serif" }}>
          + Add Record
        </Link>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2rem" }}>
        <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", padding:"1.25rem" }}>
          <p style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300, marginBottom:"0.4rem" }}>Total Records</p>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2rem", fontWeight:300, color:"var(--emerald)" }}>{purchases.length}</p>
        </div>
        <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", padding:"1.25rem" }}>
          <p style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300, marginBottom:"0.4rem" }}>Revenue Collected</p>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2rem", fontWeight:300, color:"var(--champagne)" }}>SGD {totalPaid.toLocaleString()}</p>
        </div>
        <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", padding:"1.25rem" }}>
          <p style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300, marginBottom:"0.4rem" }}>Pending</p>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2rem", fontWeight:300, color:"#C4963A" }}>{purchases.filter((p:{payment_status:string})=>p.payment_status==="pending").length}</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--stone)" }}>
              {["Client","Item Purchased / Booked","Type","Amount","Status","Invoice","Date"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"0.75rem 1rem", fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchases.map((p:{id:string;client_name:string;client_email:string;client_phone:string;item_title:string;item_type:string;amount:number;currency:string;payment_status:string;invoices:{invoice_number:string}|null;created_at:string;notes:string}) => (
              <tr key={p.id} style={{ borderBottom:"1px solid rgba(207,200,188,0.6)", transition:"background 0.15s" }}>
                <td style={{ padding:"0.875rem 1rem" }}>
                  <p style={{ fontSize:"0.82rem", color:"var(--emerald)", fontWeight:300 }}>{p.client_name}</p>
                  <p style={{ fontSize:"0.65rem", color:"var(--warm-grey)", fontWeight:300 }}>{p.client_email}</p>
                  {p.client_phone && <p style={{ fontSize:"0.65rem", color:"var(--warm-grey)", fontWeight:300 }}>{p.client_phone}</p>}
                </td>
                <td style={{ padding:"0.875rem 1rem" }}>
                  <p style={{ fontSize:"0.82rem", color:"var(--emerald)", fontWeight:300 }}>{p.item_title}</p>
                  {p.notes && <p style={{ fontSize:"0.65rem", color:"var(--warm-grey)", fontWeight:300 }}>{p.notes.slice(0,40)}</p>}
                </td>
                <td style={{ padding:"0.875rem 1rem" }}>
                  <span style={{ fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--warm-grey)", border:"1px solid var(--stone)", padding:"0.2rem 0.5rem", fontFamily:"Jost,sans-serif" }}>
                    {TYPE_LABEL[p.item_type]||p.item_type}
                  </span>
                </td>
                <td style={{ padding:"0.875rem 1rem", fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:"var(--emerald)", fontWeight:300 }}>
                  {p.currency} {p.amount.toLocaleString()}
                </td>
                <td style={{ padding:"0.875rem 1rem" }}>
                  <span style={{ padding:"0.25rem 0.6rem", fontSize:"0.6rem", letterSpacing:"0.08em", textTransform:"uppercase", color:STATUS_COLOR[p.payment_status]||"#aaa", border:`1px solid ${STATUS_COLOR[p.payment_status]||"#aaa"}40`, background:`${STATUS_COLOR[p.payment_status]||"#aaa"}10` }}>
                    {p.payment_status}
                  </span>
                </td>
                <td style={{ padding:"0.875rem 1rem", fontSize:"0.72rem", color:"var(--champagne)", fontWeight:300 }}>
                  {p.invoices ? `#${p.invoices.invoice_number}` : "—"}
                </td>
                <td style={{ padding:"0.875rem 1rem", fontSize:"0.72rem", color:"var(--warm-grey)", fontWeight:300 }}>
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {purchases.length===0 && (
          <p style={{ textAlign:"center", padding:"3rem", color:"var(--stone)", fontSize:"0.8rem" }}>No purchase records yet.</p>
        )}
      </div>
    </div>
  );
}
