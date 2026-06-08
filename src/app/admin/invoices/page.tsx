import { A, PageHeader, statusPill } from "@/lib/adminStyles";
import Link from "next/link";

async function getInvoices() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("invoices").select("*").order("created_at",{ascending:false});
    return data || [];
  } catch { return []; }
}

export default async function AdminInvoicesPage() {
  const invoices = await getInvoices();
  const totals = { paid:0, unpaid:0, all:0 };
  invoices.forEach((i:{status:string;total:number}) => {
    totals.all += i.total||0;
    if (i.status==="paid") totals.paid += i.total||0;
    else if (i.status==="unpaid") totals.unpaid += i.total||0;
  });

  return (
    <div>
      <PageHeader eyebrow="Payments" title="Invoices"
        action={<Link href="/admin/invoices/new" style={{ ...A.btnGold, textDecoration:"none", display:"inline-block" }}>+ New Invoice</Link>}
      />

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
        {[
          { label:"Total Invoiced", value:`SGD ${totals.all.toLocaleString()}`, color:A.emerald },
          { label:"Collected",      value:`SGD ${totals.paid.toLocaleString()}`, color:"#3D7A55" },
          { label:"Outstanding",    value:`SGD ${totals.unpaid.toLocaleString()}`, color:A.champagne },
        ].map(s => (
          <div key={s.label} style={A.card}>
            <div style={{ fontSize:"0.48rem", letterSpacing:"0.18em", textTransform:"uppercase", color:A.warmGrey, marginBottom:"0.5rem", fontFamily:"'Jost',sans-serif" }}>{s.label}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", fontWeight:300, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ ...A.card, padding:0, overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>{["Invoice","Client","Items","Amount","Status","Due","Actions"].map(h=><th key={h} style={A.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {invoices.map((inv:{id:string;invoice_number:string;client_name:string;client_email:string;line_items:{description:string}[];total:number;currency:string;status:string;due_date:string}) => (
              <tr key={inv.id}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.backgroundColor="#FDFAF5"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.backgroundColor="transparent"}
              >
                <td style={{ ...A.td, paddingLeft:"1rem" }}>
                  <Link href={`/admin/invoices/${inv.id}`} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:A.emerald, textDecoration:"none" }}>#{inv.invoice_number}</Link>
                </td>
                <td style={A.td}>
                  <div style={{ fontSize:"0.78rem", color:A.emerald, fontWeight:300 }}>{inv.client_name}</div>
                  <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{inv.client_email}</div>
                </td>
                <td style={A.td}>
                  <div style={{ fontSize:"0.68rem", color:A.warmGrey, fontWeight:300, maxWidth:"160px" }}>
                    {(inv.line_items||[]).slice(0,2).map((l:{description:string})=>l.description).join(", ")}
                  </div>
                </td>
                <td style={A.td}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.champagne }}>{inv.currency} {inv.total?.toLocaleString()}</div>
                </td>
                <td style={A.td}><span style={statusPill(inv.status)}>{inv.status}</span></td>
                <td style={A.td}>
                  <div style={{ fontSize:"0.68rem", color:A.warmGrey, fontWeight:300 }}>
                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-SG") : "—"}
                  </div>
                </td>
                <td style={{ ...A.td, paddingRight:"1rem" }}>
                  <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                    <Link href={`/admin/invoices/${inv.id}`} style={{ fontSize:"0.56rem", color:A.champagne, textDecoration:"none", letterSpacing:"0.08em", textTransform:"uppercase" }}>View</Link>
                    <span style={{ color:A.stone }}>·</span>
                    <Link href={`/pay/${inv.id}`} target="_blank" style={{ fontSize:"0.56rem", color:A.emerald, textDecoration:"none", letterSpacing:"0.08em", textTransform:"uppercase" }}>QR Pay</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length===0 && <div style={{padding:"3rem",textAlign:"center",color:A.stone,fontSize:"0.8rem"}}>No invoices yet. Create your first invoice above.</div>}
      </div>
    </div>
  );
}
