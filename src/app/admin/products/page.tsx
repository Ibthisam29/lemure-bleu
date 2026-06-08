"use client";
import { useState, useEffect, useRef } from "react";
import { A, statusPill } from "@/lib/adminStyles";
import { PageHeader } from "@/components/admin/PageHeader";

type Product = { id:string; title:string; description:string; category:string; price:number|null; price_label:string; image_urls:string[]; video_url:string; featured:boolean; visible:boolean; sort_order:number; };

const empty = { title:"", description:"", category:"jewellery", price:"", price_label:"Price on Request", image_urls:[] as string[], video_url:"", featured:false, visible:true, sort_order:0 };
const CATS = ["jewellery","gemstone","collection","service","event","bridal","heirloom"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string|null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetch("/api/admin/products").then(r=>r.json()).then(d=>{ setProducts(d.products||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);

  async function uploadFiles(files:FileList, type:"image"|"video") {
    setUploading(true);
    const urls:string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData(); fd.append("file",file); fd.append("type",type);
      const res = await fetch("/api/admin/upload",{method:"POST",body:fd});
      const d = await res.json();
      if (d.url) urls.push(d.url);
    }
    setUploading(false);
    return urls;
  }

  async function save() {
    if (!form.title) return;
    setSaving(true);
    try {
      const url = editId ? `/api/admin/products?id=${editId}` : "/api/admin/products";
      const body = { ...form, price: form.price ? parseFloat(form.price as unknown as string) : null };
      const res = await fetch(url, { method:editId?"PATCH":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      const d = await res.json();
      if (d.product) {
        setProducts(p => editId ? p.map(x=>x.id===editId?d.product:x) : [d.product,...p]);
        setForm(empty); setShowForm(false); setEditId(null);
      }
    } finally { setSaving(false); }
  }

  async function toggle(id:string, field:"visible"|"featured", val:boolean) {
    await fetch(`/api/admin/products?id=${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({[field]:val})});
    setProducts(p=>p.map(x=>x.id===id?{...x,[field]:val}:x));
  }

  async function del(id:string) {
    if(!confirm("Delete this product permanently?")) return;
    await fetch(`/api/admin/products?id=${id}`,{method:"DELETE"});
    setProducts(p=>p.filter(x=>x.id!==id));
  }

  function startEdit(prod:Product) {
    setForm({...prod, price: prod.price?.toString() as unknown as string ?? ""});
    setEditId(prod.id); setShowForm(true);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  const F = ({label, children}:{label:string;children:React.ReactNode}) => (
    <div><label style={A.label}>{label}</label>{children}</div>
  );

  return (
    <div>
      <PageHeader eyebrow="Website CMS" title="Products" sub="Published products appear on the website automatically"
        action={
          <button onClick={()=>{setShowForm(!showForm);setForm(empty);setEditId(null);}} style={A.btnGold}>
            {showForm?"Cancel":"+ Add Product"}
          </button>
        }
      />

      {/* Form */}
      {showForm && (
        <div style={{ ...A.card, marginBottom:"1.5rem", borderColor:A.champagne }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:A.emerald, marginBottom:"1.5rem" }}>{editId?"Edit Product":"New Product"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem", marginBottom:"1.25rem" }}>
            <div style={{ gridColumn:"1/-1" }}><F label="Title *"><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Product name" style={A.input} /></F></div>
            <F label="Category">
              <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={{...A.input,cursor:"pointer"}}>
                {CATS.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </F>
            <F label="Price Label"><input value={form.price_label} onChange={e=>setForm(p=>({...p,price_label:e.target.value}))} placeholder="e.g. Price on Request / SGD 5,000" style={A.input} /></F>
            <F label="Price (numeric, for sorting)"><input type="text" inputMode="numeric" value={form.price as unknown as string||""} onChange={e=>{ const v=e.target.value; setForm(prev=>Object.assign({},prev,{price:v as unknown as number})); }} placeholder="5000" style={A.input} /></F>
            <F label="Sort Order"><input type="number" value={form.sort_order} onChange={e=>setForm(p=>({...p,sort_order:parseInt(e.target.value)||0}))} style={A.input} /></F>
            <div style={{ gridColumn:"1/-1" }}><F label="Description"><textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} placeholder="Product description" style={{...A.input,resize:"none",display:"block"}} /></F></div>
          </div>

          {/* Images */}
          <F label="Product Images">
            <div style={{ display:"flex", gap:"0.6rem", flexWrap:"wrap", marginBottom:"0.75rem", marginTop:"0.4rem" }}>
              {form.image_urls.map((url,i)=>(
                <div key={i} style={{ position:"relative", width:"80px", height:"80px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", border:`1px solid ${A.stone}` }} />
                  <button onClick={()=>setForm(p=>({...p,image_urls:p.image_urls.filter((_,j)=>j!==i)}))} style={{ position:"absolute", top:"-6px", right:"-6px", width:"18px", height:"18px", borderRadius:"50%", background:A.champagne, color:"white", border:"none", cursor:"pointer", fontSize:"0.65rem", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                </div>
              ))}
              <button onClick={()=>imgRef.current?.click()} disabled={uploading}
                style={{ width:"80px", height:"80px", border:`1px dashed ${A.stone}`, background:"transparent", cursor:"pointer", color:A.warmGrey, fontSize:"1.5rem", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {uploading?"…":"+"}
              </button>
              <input ref={imgRef} type="file" accept="image/*" multiple onChange={async e=>{ if(e.target.files){ const u=await uploadFiles(e.target.files,"image"); setForm(p=>({...p,image_urls:[...p.image_urls,...u]})); }}} style={{display:"none"}} />
            </div>
            <input placeholder="Or paste image URL and press Enter" style={{...A.input,fontSize:"0.75rem"}} onKeyDown={e=>{ if(e.key==="Enter"&&e.currentTarget.value){ setForm(p=>({...p,image_urls:[...p.image_urls,e.currentTarget.value]})); e.currentTarget.value=""; }}} />
          </F>

          {/* Video */}
          <div style={{ marginTop:"1rem" }}>
            <F label="Video">
              <div style={{ display:"flex", gap:"0.75rem", alignItems:"center", marginTop:"0.4rem", flexWrap:"wrap" }}>
                {form.video_url ? (
                  <>
                    <span style={{ fontSize:"0.72rem", color:A.emerald, fontWeight:300 }}>🎬 {form.video_url.slice(0,40)}…</span>
                    <button onClick={()=>setForm(p=>({...p,video_url:""}))} style={{...A.btnDanger, padding:"0.3rem 0.6rem"}}>Remove</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=>vidRef.current?.click()} disabled={uploading} style={{...A.btnOutline, fontSize:"0.56rem"}}>Upload Video</button>
                    <input ref={vidRef} type="file" accept="video/*" onChange={async e=>{ if(e.target.files){ const u=await uploadFiles(e.target.files,"video"); if(u[0]) setForm(p=>({...p,video_url:u[0]})); }}} style={{display:"none"}} />
                    <input placeholder="Or paste video URL" onChange={e=>setForm(p=>({...p,video_url:e.target.value}))} style={{...A.input,width:"200px",fontSize:"0.75rem"}} />
                  </>
                )}
              </div>
            </F>
          </div>

          {/* Toggles */}
          <div style={{ display:"flex", gap:"2rem", marginTop:"1.25rem", marginBottom:"1.25rem" }}>
            {[["featured","Featured on homepage"],["visible","Published on website"]].map(([k,l])=>(
              <label key={k} style={{ display:"flex", alignItems:"center", gap:"0.5rem", cursor:"pointer" }}>
                <input type="checkbox" checked={form[k as "featured"|"visible"]} onChange={e=>setForm(p=>({...p,[k]:e.target.checked}))} style={{accentColor:A.champagne,width:"14px",height:"14px"}} />
                <span style={{...A.label, marginBottom:0, textTransform:"none", letterSpacing:"0.03em", fontSize:"0.72rem"}}>{l}</span>
              </label>
            ))}
          </div>

          <div style={{ display:"flex", gap:"0.75rem" }}>
            <button onClick={save} disabled={saving||!form.title} style={{...A.btnGold, opacity:(saving||!form.title)?0.5:1}}>
              {saving?"Saving…":editId?"Update Product":"Publish Product"}
            </button>
            <button onClick={()=>{setShowForm(false);setForm(empty);setEditId(null);}} style={A.btnOutline}>Cancel</button>
          </div>
        </div>
      )}

      {/* Products list */}
      {loading ? <div style={{color:A.warmGrey,fontSize:"0.8rem"}}>Loading…</div> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1rem" }}>
          {products.map(prod => (
            <div key={prod.id} style={{ ...A.card, padding:0, overflow:"hidden", opacity:prod.visible?1:0.6 }}>
              {/* Thumbnail */}
              <div style={{ height:"180px", backgroundColor:A.emerald, position:"relative", overflow:"hidden" }}>
                {prod.image_urls?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={prod.image_urls[0]} alt={prod.title} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                ) : prod.video_url ? (
                  <video src={prod.video_url} muted style={{width:"100%",height:"100%",objectFit:"cover"}} />
                ) : (
                  <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:"40px",height:"40px",transform:"rotate(45deg)",border:"1px solid rgba(196,150,90,.3)"}} />
                  </div>
                )}
                {/* Badges */}
                <div style={{ position:"absolute", top:"8px", left:"8px", display:"flex", gap:"4px" }}>
                  {prod.featured && <span style={{backgroundColor:A.champagne,color:"white",fontSize:"0.45rem",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0.15rem 0.4rem",fontFamily:"'Jost',sans-serif"}}>Featured</span>}
                  <span style={statusPill(prod.visible?"published":"draft")}>{prod.visible?"Live":"Hidden"}</span>
                </div>
                {/* Image count */}
                {prod.image_urls?.length > 1 && (
                  <div style={{ position:"absolute", bottom:"8px", right:"8px", backgroundColor:"rgba(0,0,0,.5)", color:"white", fontSize:"0.55rem", padding:"0.15rem 0.4rem", fontFamily:"'Jost',sans-serif" }}>
                    {prod.image_urls.length} photos
                  </div>
                )}
              </div>
              <div style={{ padding:"1rem" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, marginBottom:"0.2rem" }}>{prod.title}</div>
                <div style={{ fontSize:"0.6rem", color:A.champagne, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.4rem", fontFamily:"'Jost',sans-serif" }}>{prod.category}</div>
                <div style={{ fontSize:"0.75rem", color:A.warmGrey, fontWeight:300, marginBottom:"1rem", lineHeight:1.5 }}>{prod.price_label}</div>
                <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                  <button onClick={()=>startEdit(prod)} style={{...A.btnOutline, padding:"0.3rem 0.7rem", fontSize:"0.54rem"}}>Edit</button>
                  <button onClick={()=>toggle(prod.id,"visible",!prod.visible)} style={{...A.btnOutline, padding:"0.3rem 0.7rem", fontSize:"0.54rem", borderColor:A.stone, color:A.warmGrey}}>
                    {prod.visible?"Hide":"Publish"}
                  </button>
                  <button onClick={()=>toggle(prod.id,"featured",!prod.featured)} style={{...A.btnOutline, padding:"0.3rem 0.7rem", fontSize:"0.54rem", borderColor:A.champagne, color:A.champagne}}>
                    {prod.featured?"Unfeature":"Feature"}
                  </button>
                  <button onClick={()=>del(prod.id)} style={{...A.btnDanger, padding:"0.3rem 0.7rem", fontSize:"0.54rem"}}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {products.length===0 && (
            <div style={{gridColumn:"1/-1",padding:"3rem",textAlign:"center",color:A.stone,fontSize:"0.8rem",border:`1px dashed ${A.stone}`}}>
              No products yet. Click "+ Add Product" to create your first listing.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
