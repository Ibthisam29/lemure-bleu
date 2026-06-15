import { A, statusPill } from "@/lib/adminStyles";
import { PageHeader } from "@/components/admin/PageHeader";

async function getPurchases() {
  
  try {
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("purchases").select("*,invoices(invoice_number)").order("created_at",{ascending:false});
    return data || [];
  } catch { return []; }
}

const TYPE_LABELS: Record<string,string> = { product:"Product", stone:"Gemstone", preorder:"Preorder", appointment:"Consultation", collection:"Collection", custom:"Custom" };

export default async function AdminPurchasesPage() {
  const purchases = await getPurchases();
  const totalPaid = purchases.filter((p:{payment_status:string})=>p.payment_status==="paid").reduce((s,p:{amount:number})=>s+p.amount,0);
  const totalPending = purchases.filter((p:{payment_status:string})=>p.payment_status==="pending").reduce((s,p:{amount:number})=>s+p.amount,0);

  return (
    <div>
      <PageHeader eyebrow="Clients" title="Purchase Records" sub="All orders, bookings, and consultations" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
        {[
          { label:"Total Records", value:purchases.length, color:A.emerald },
          { label:"Revenue Collected", value:`SGD ${totalPaid.toLocaleString()}`, color:"#3D7A55" },
          { label:"Pending Payment", value:`SGD ${totalPending.toLocaleString()}`, color:A.champagne },
        ].map(s=>(
          <div key={s.label} style={A.card}>
            <div style={{ fontSize:"0.48rem", letterSpacing:"0.18em", textTransform:"uppercase", color:A.warmGrey, marginBottom:"0.5rem", fontFamily:"'Jost',sans-serif" }}>{s.label}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", fontWeight:300, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ ...A.card, padding:0, overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>{["Client","Item Ordered / Booked","Type","Amount","Payment","Invoice","Date"].map(h=><th key={h} style={A.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {purchases.map((p:{id:string;client_name:string;client_email:string;client_phone:string;item_title:string;item_type:string;amount:number;currency:string;payment_status:string;notes:string;created_at:string;invoices:{invoice_number:string}|null}) => (
              <tr key={p.id} >
                <td style={{ ...A.td, paddingLeft:"1rem" }}>
                  <div style={{ fontSize:"0.82rem", color:A.emerald, fontWeight:300 }}>{p.client_name}</div>
                  <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{p.client_email}</div>
                  {p.client_phone && <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{p.client_phone}</div>}
                </td>
                <td style={A.td}>
                  <div style={{ fontSize:"0.78rem", color:A.emerald, fontWeight:300 }}>{p.item_title}</div>
                  {p.notes && <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{p.notes.slice(0,50)}</div>}
                </td>
                <td style={A.td}>
                  <span style={statusPill(p.item_type)}>{TYPE_LABELS[p.item_type]||p.item_type}</span>
                </td>
                <td style={A.td}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.champagne }}>{p.currency} {p.amount.toLocaleString()}</div>
                </td>
                <td style={A.td}><span style={statusPill(p.payment_status)}>{p.payment_status}</span></td>
                <td style={{ ...A.td, fontSize:"0.68rem", color:A.warmGrey, fontWeight:300 }}>
                  {p.invoices ? `#${p.invoices.invoice_number}` : "—"}
                </td>
                <td style={{ ...A.td, paddingRight:"1rem", fontSize:"0.65rem", color:A.warmGrey, fontWeight:300 }}>
                  {new Date(p.created_at).toLocaleDateString("en-SG")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {purchases.length===0 && <div style={{padding:"3rem",textAlign:"center",color:A.stone,fontSize:"0.8rem"}}>No purchase records yet.</div>}
      </div>
    </div>
  );
}
