"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LineItem = { description: string; quantity: number; unit_price: number; };

const inputStyle = { width:"100%", padding:"0.6rem 0", background:"transparent", border:"none", borderBottom:"1px solid var(--stone)", color:"var(--emerald)", fontSize:"0.82rem", fontWeight:300, outline:"none", fontFamily:"Jost,sans-serif" };
const labelStyle:React.CSSProperties = { fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300, display:"block", marginBottom:"0.3rem" };

export default function NewInvoicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    client_name:"", client_email:"", client_phone:"",
    due_date:"", notes:"", currency:"SGD", tax:0,
  });
  const [items, setItems] = useState<LineItem[]>([
    { description:"", quantity:1, unit_price:0 }
  ]);

  const subtotal = items.reduce((s,i)=>s+(i.quantity*i.unit_price),0);
  const taxAmt = subtotal*(form.tax/100);
  const total = subtotal+taxAmt;

  function updateItem(idx:number, field:keyof LineItem, val:string|number) {
    setItems(prev=>prev.map((item,i)=>i===idx?{...item,[field]:val}:item));
  }
  function addItem() { setItems(p=>[...p,{description:"",quantity:1,unit_price:0}]); }
  function removeItem(idx:number) { setItems(p=>p.filter((_,i)=>i!==idx)); }

  async function handleSave(status:"draft"|"unpaid") {
    if (!form.client_name||!form.client_email) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ ...form, line_items:items, subtotal, tax:taxAmt, total, status }),
      });
      const d = await res.json();
      if (d.invoice) router.push(`/admin/invoices/${d.invoice.id}`);
    } finally { setSaving(false); }
  }

  return (
    <div style={{ maxWidth:"800px" }}>
      <div style={{ marginBottom:"2rem" }}>
        <p style={{ fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--champagne)", marginBottom:"0.4rem" }}>Payments</p>
        <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.2rem", fontWeight:300, color:"var(--emerald)" }}>New Invoice</h1>
      </div>

      {/* Client info */}
      <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", padding:"1.75rem", marginBottom:"1.25rem" }}>
        <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:"var(--emerald)", marginBottom:"1.25rem" }}>Client Details</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
          <div>
            <label style={labelStyle}>Client Name *</label>
            <input value={form.client_name} onChange={e=>setForm(p=>({...p,client_name:e.target.value}))} placeholder="Full name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input type="email" value={form.client_email} onChange={e=>setForm(p=>({...p,client_email:e.target.value}))} placeholder="email@example.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone / WhatsApp</label>
            <input value={form.client_phone} onChange={e=>setForm(p=>({...p,client_phone:e.target.value}))} placeholder="+65 xxxx xxxx" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Due Date</label>
            <input type="date" value={form.due_date} onChange={e=>setForm(p=>({...p,due_date:e.target.value}))} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Line items */}
      <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", padding:"1.75rem", marginBottom:"1.25rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:"var(--emerald)" }}>Items / Services</p>
          <button onClick={addItem} style={{ padding:"0.35rem 0.75rem", border:"1px solid var(--champagne)", background:"transparent", color:"var(--champagne)", fontSize:"0.6rem", cursor:"pointer", fontFamily:"Jost,sans-serif", letterSpacing:"0.1em" }}>
            + Add Item
          </button>
        </div>

        {/* Header */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 100px 80px", gap:"1rem", marginBottom:"0.5rem" }}>
          {["Description","Qty","Unit Price",""].map(h=>(
            <p key={h} style={{ fontSize:"0.55rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300 }}>{h}</p>
          ))}
        </div>

        {items.map((item,idx)=>(
          <div key={idx} style={{ display:"grid", gridTemplateColumns:"1fr 80px 100px 80px", gap:"1rem", marginBottom:"0.75rem", alignItems:"center" }}>
            <input placeholder="Description of service or product" value={item.description}
              onChange={e=>updateItem(idx,"description",e.target.value)} style={inputStyle} />
            <input type="number" min="1" value={item.quantity}
              onChange={e=>updateItem(idx,"quantity",parseInt(e.target.value)||1)} style={{...inputStyle, textAlign:"center"}} />
            <input type="number" min="0" step="0.01" value={item.unit_price}
              onChange={e=>updateItem(idx,"unit_price",parseFloat(e.target.value)||0)} style={inputStyle} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"0.8rem", color:"var(--emerald)", fontWeight:300 }}>
                {(item.quantity*item.unit_price).toLocaleString()}
              </span>
              {items.length>1 && (
                <button onClick={()=>removeItem(idx)} style={{ background:"none", border:"none", color:"var(--stone)", cursor:"pointer", fontSize:"1rem", lineHeight:1 }}>×</button>
              )}
            </div>
          </div>
        ))}

        {/* Totals */}
        <div style={{ marginTop:"1.5rem", paddingTop:"1rem", borderTop:"1px solid var(--stone)" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"0.5rem" }}>
            <div style={{ display:"flex", gap:"3rem", alignItems:"center" }}>
              <span style={{ fontSize:"0.72rem", color:"var(--warm-grey)", fontWeight:300 }}>Subtotal</span>
              <span style={{ fontSize:"0.9rem", color:"var(--emerald)", fontWeight:300 }}>SGD {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display:"flex", gap:"3rem", alignItems:"center" }}>
              <span style={{ fontSize:"0.72rem", color:"var(--warm-grey)", fontWeight:300 }}>
                GST % <input type="number" min="0" max="100" value={form.tax} onChange={e=>setForm(p=>({...p,tax:parseFloat(e.target.value)||0}))}
                  style={{ width:"40px", border:"none", borderBottom:"1px solid var(--stone)", textAlign:"center", fontSize:"0.72rem", fontFamily:"Jost,sans-serif", outline:"none", background:"transparent" }} />
              </span>
              <span style={{ fontSize:"0.9rem", color:"var(--emerald)", fontWeight:300 }}>SGD {taxAmt.toFixed(2)}</span>
            </div>
            <div style={{ display:"flex", gap:"3rem", alignItems:"center", paddingTop:"0.5rem", borderTop:"1px solid var(--stone)" }}>
              <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1rem", color:"var(--emerald)" }}>Total</span>
              <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", color:"var(--champagne)" }}>SGD {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", padding:"1.75rem", marginBottom:"1.75rem" }}>
        <label style={labelStyle}>Notes (shown on invoice)</label>
        <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={3} placeholder="Payment instructions, thank you note, etc." style={{...inputStyle,resize:"none"}} />
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:"1rem" }}>
        <button onClick={()=>handleSave("unpaid")} disabled={saving||!form.client_name||!form.client_email}
          style={{ padding:"0.875rem 2.5rem", background:"var(--champagne)", color:"var(--ivory)", fontSize:"0.62rem", letterSpacing:"0.22em", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"Jost,sans-serif", opacity:saving?0.6:1 }}>
          {saving?"Saving…":"Create & Send Invoice"}
        </button>
        <button onClick={()=>handleSave("draft")} disabled={saving}
          style={{ padding:"0.875rem 2.5rem", background:"transparent", color:"var(--emerald)", fontSize:"0.62rem", letterSpacing:"0.22em", textTransform:"uppercase", border:"1px solid var(--emerald)", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>
          Save as Draft
        </button>
      </div>
    </div>
  );
}
