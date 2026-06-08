"use client";
import { useState, useEffect, useRef } from "react";
import { A, PageHeader, statusPill } from "@/lib/adminStyles";

type Stone = { id:string;stone_name:string;stone_type:string;origin:string;carat:number;cut:string;colour:string;clarity:string;treatment:string;certificate_lab:string;certificate_number:string;description:string;image_url:string;price_label:string;price_visibility:string;status:string;visible:boolean; };

const empty = { stone_name:"",stone_type:"",origin:"",carat:"" as unknown as number,cut:"",colour:"",clarity:"",treatment:"None",certificate_lab:"",certificate_number:"",description:"",image_url:"",price_label:"Price on Request",price_visibility:"price_on_request",status:"available",visible:true };

export default function AdminStonesPage() {
  const [stones, setStones] = useState<Stone[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string|null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{ fetch("/api/admin/stones").then(r=>r.json()).then(d=>{ setStones(d.stones||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);

  async function uploadImage(files:FileList) {
    setUploading(true);
    const fd = new FormData(); fd.append("file",files[0]); fd.append("type","image");
    const res = await fetch("/api/admin/upload",{method:"POST",body:fd});
    const d = await res.json();
    if (d.url) setForm(p=>({...p,image_url:d.url}));
    setUploading(false);
  }

  async function save() {
    if (!form.stone_name) return;
    setSaving(true);
    try {
      const url = editId?`/api/admin/stones?id=${editId}`:"/api/admin/stones";
      const body = { ...form, carat: parseFloat(form.carat as unknown as string)||0 };
      const res = await fetch(url,{method:editId?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const d = await res.json();
      if (d.stone) {
        setStones(p=>editId?p.map(x=>x.id===editId?d.stone:x):[d.stone,...p]);
        setForm(empty); setShowForm(false); setEditId(null);
      }
    } finally { setSaving(false); }
  }

  async function del(id:string) {
    if (!confirm("Delete this stone?")) return;
    await fetch(`/api/admin/stones?id=${id}`,{method:"DELETE"});
    setStones(p=>p.filter(x=>x.id!==id));
  }

  const F = ({label,children}:{label:string;children:React.ReactNode}) => (
    <div><label style={A.label}>{label}</label>{children}</div>
  );

  return (
    <div>
      <PageHeader eyebrow="Website CMS" title="Stone Vault" sub={`${stones.length} stones · ${stones.filter(s=>s.status==="available").length} available`}
        action={<button onClick={()=>{setShowForm(!showForm);setForm(empty);setEditId(null);}} style={A.btnGold}>{showForm?"Cancel":"+ Add Stone"}</button>}
      />

      {showForm && (
        <div style={{ ...A.card, marginBottom:"1.5rem", borderColor:A.champagne }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:A.emerald, marginBottom:"1.5rem" }}>{editId?"Edit Stone":"New Stone"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
            <F label="Stone Name *"><input value={form.stone_name} onChange={e=>setForm(p=>({...p,stone_name:e.target.value}))} style={A.input} /></F>
            <F label="Stone Type"><input value={form.stone_type} onChange={e=>setForm(p=>({...p,stone_type:e.target.value}))} placeholder="e.g. Sapphire" style={A.input} /></F>
            <F label="Origin"><input value={form.origin} onChange={e=>setForm(p=>({...p,origin:e.target.value}))} placeholder="e.g. Kashmir, India" style={A.input} /></F>
            <F label="Carat"><input type="text" inputMode="decimal" value={form.carat as unknown as string} onChange={e=>{ const v=e.target.value; setForm(prev=>Object.assign({},prev,{carat:v as unknown as number})); }} placeholder="5.20" style={A.input} /></F>
            <F label="Cut"><input value={form.cut} onChange={e=>setForm(p=>({...p,cut:e.target.value}))} placeholder="e.g. Oval, Cushion" style={A.input} /></F>
            <F label="Colour"><input value={form.colour} onChange={e=>setForm(p=>({...p,colour:e.target.value}))} placeholder="e.g. Deep Blue" style={A.input} /></F>
            <F label="Clarity"><input value={form.clarity} onChange={e=>setForm(p=>({...p,clarity:e.target.value}))} style={A.input} /></F>
            <F label="Treatment"><input value={form.treatment} onChange={e=>setForm(p=>({...p,treatment:e.target.value}))} style={A.input} /></F>
            <F label="Certificate Lab"><input value={form.certificate_lab} onChange={e=>setForm(p=>({...p,certificate_lab:e.target.value}))} placeholder="e.g. GIA, AGL" style={A.input} /></F>
            <F label="Certificate No."><input value={form.certificate_number} onChange={e=>setForm(p=>({...p,certificate_number:e.target.value}))} style={A.input} /></F>
            <F label="Price Label"><input value={form.price_label} onChange={e=>setForm(p=>({...p,price_label:e.target.value}))} placeholder="Price on Request" style={A.input} /></F>
            <F label="Status">
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} style={{...A.input,cursor:"pointer"}}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="private_viewing_only">Private Viewing Only</option>
              </select>
            </F>
            <div style={{ gridColumn:"1/-1" }}><F label="Description"><textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={2} style={{...A.input,resize:"none",display:"block"}} /></F></div>
          </div>

          {/* Image */}
          <F label="Stone Image">
            <div style={{ display:"flex", gap:"0.75rem", alignItems:"center", marginTop:"0.4rem", flexWrap:"wrap" }}>
              {form.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image_url} alt="" style={{ width:"80px", height:"80px", objectFit:"cover", border:`1px solid ${A.stone}` }} />
              )}
              <button onClick={()=>imgRef.current?.click()} disabled={uploading} style={{...A.btnOutline, fontSize:"0.56rem"}}>
                {uploading?"Uploading…":form.image_url?"Change Image":"Upload Image"}
              </button>
              <input ref={imgRef} type="file" accept="image/*" onChange={e=>e.target.files&&uploadImage(e.target.files)} style={{display:"none"}} />
              <input placeholder="Or paste image URL" value={form.image_url} onChange={e=>setForm(p=>({...p,image_url:e.target.value}))} style={{...A.input,width:"240px",fontSize:"0.75rem"}} />
            </div>
          </F>

          <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.25rem" }}>
            <button onClick={save} disabled={saving||!form.stone_name} style={{...A.btnGold,opacity:(saving||!form.stone_name)?0.5:1}}>
              {saving?"Saving…":editId?"Update Stone":"Add to Vault"}
            </button>
            <button onClick={()=>{setShowForm(false);setForm(empty);setEditId(null);}} style={A.btnOutline}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{color:A.warmGrey,fontSize:"0.8rem"}}>Loading…</div> : (
        <div style={{ ...A.card, padding:0, overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["Stone","Origin","Carat","Cert","Price","Status","Actions"].map(h=><th key={h} style={A.th}>{h}</th>)}</tr></thead>
            <tbody>
              {stones.map(s => (
                <tr key={s.id}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.backgroundColor="#FDFAF5"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.backgroundColor="transparent"}
                >
                  <td style={{ ...A.td, paddingLeft:"1rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                      {s.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image_url} alt="" style={{ width:"40px", height:"40px", objectFit:"cover", border:`1px solid ${A.stone}`, flexShrink:0 }} />
                      )}
                      <div>
                        <div style={{ fontSize:"0.82rem", color:A.emerald, fontWeight:300 }}>{s.stone_name}</div>
                        <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{s.stone_type}</div>
                      </div>
                    </div>
                  </td>
                  <td style={A.td}><div style={{ fontSize:"0.72rem", color:A.warmGrey, fontWeight:300 }}>{s.origin}</div></td>
                  <td style={A.td}><div style={{ fontSize:"0.72rem", color:A.emerald, fontWeight:300 }}>{s.carat} ct</div></td>
                  <td style={A.td}><div style={{ fontSize:"0.65rem", color:A.warmGrey, fontWeight:300 }}>{s.certificate_lab} {s.certificate_number}</div></td>
                  <td style={A.td}><div style={{ fontSize:"0.72rem", color:A.emerald, fontWeight:300 }}>{s.price_label}</div></td>
                  <td style={A.td}><span style={statusPill(s.status)}>{s.status?.replace(/_/g," ")}</span></td>
                  <td style={{ ...A.td, paddingRight:"1rem" }}>
                    <div style={{ display:"flex", gap:"0.4rem" }}>
                      <button onClick={()=>{(() => { setForm({ stone_name:s.stone_name, stone_type:s.stone_type||"", origin:s.origin||"", carat:String(s.carat||"") as unknown as number, cut:s.cut||"", colour:s.colour||"", clarity:s.clarity||"", treatment:s.treatment||"None", certificate_lab:s.certificate_lab||"", certificate_number:s.certificate_number||"", description:s.description||"", image_url:s.image_url||"", price_label:s.price_label||"Price on Request", price_visibility:s.price_visibility||"price_on_request", status:s.status||"available", visible:s.visible!==false }); })();setEditId(s.id);setShowForm(true);window.scrollTo({top:0,behavior:"smooth"});}} style={{...A.btnOutline,padding:"0.28rem 0.65rem",fontSize:"0.52rem"}}>Edit</button>
                      <button onClick={()=>del(s.id)} style={{...A.btnDanger,padding:"0.28rem 0.65rem",fontSize:"0.52rem"}}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stones.length===0 && <div style={{padding:"3rem",textAlign:"center",color:A.stone,fontSize:"0.8rem"}}>No stones yet. Add your first gemstone.</div>}
        </div>
      )}
    </div>
  );
}
