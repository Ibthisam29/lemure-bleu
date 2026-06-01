"use client";
import { useState, useEffect, useRef } from "react";

const CATS = ["jewellery","gemstone","collection","service","event"];

type Product = {
  id: string; title: string; description: string; category: string;
  price: number | null; price_label: string; image_urls: string[];
  video_url: string; featured: boolean; visible: boolean; sort_order: number;
};

const labelStyle = { fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase" as const, color:"var(--warm-grey)", fontWeight:300, display:"block", marginBottom:"0.4rem" };
const inputStyle = { width:"100%", padding:"0.6rem 0", background:"transparent", border:"none", borderBottom:"1px solid var(--stone)", color:"var(--emerald)", fontSize:"0.82rem", fontWeight:300, outline:"none", fontFamily:"Jost,sans-serif" };
const cardStyle = { background:"var(--ivory)", border:"1px solid var(--stone)", padding:"1.25rem" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const empty = { title:"", description:"", category:"jewellery", price:"", price_label:"Price on Request", image_urls:[] as string[], video_url:"", featured:false, visible:true, sort_order:0 };
  const [form, setForm] = useState<typeof empty>(empty);

  useEffect(() => {
    fetch("/api/admin/products").then(r=>r.json()).then(d=>{ setProducts(d.products||[]); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  async function uploadFiles(files: FileList, type: "image"|"video") {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      const res = await fetch("/api/admin/upload", { method:"POST", body:fd });
      const d = await res.json();
      if (d.url) urls.push(d.url);
    }
    setUploading(false);
    return urls;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const urls = await uploadFiles(e.target.files, "image");
    setForm(p => ({ ...p, image_urls: [...p.image_urls, ...urls] }));
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const urls = await uploadFiles(e.target.files, "video");
    if (urls[0]) setForm(p => ({ ...p, video_url: urls[0] }));
  }

  async function handleSave() {
    if (!form.title) return;
    setSaving(true);
    try {
      const body = { ...form, price: form.price ? parseFloat(form.price as unknown as string) : null };
      const url = editId ? `/api/admin/products?id=${editId}` : "/api/admin/products";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      const d = await res.json();
      if (d.product) {
        if (editId) setProducts(p => p.map(x => x.id===editId ? d.product : x));
        else setProducts(p => [d.product, ...p]);
        setForm(empty); setShowForm(false); setEditId(null);
      }
    } finally { setSaving(false); }
  }

  async function toggleVisible(id: string, visible: boolean) {
    await fetch(`/api/admin/products?id=${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({visible}) });
    setProducts(p => p.map(x => x.id===id ? {...x, visible} : x));
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method:"DELETE" });
    setProducts(p => p.filter(x => x.id!==id));
  }

  function startEdit(prod: Product) {
    setForm({ ...prod, price: prod.price?.toString() as unknown as string || "" });
    setEditId(prod.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior:"smooth" });
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <p style={{ fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--champagne)", marginBottom:"0.4rem" }}>CMS</p>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.2rem", fontWeight:300, color:"var(--emerald)" }}>Products & Media</h1>
          <p style={{ fontSize:"0.75rem", color:"var(--warm-grey)", fontWeight:300, marginTop:"0.25rem" }}>Post products with images and videos directly to the website</p>
        </div>
        <button onClick={()=>{setShowForm(!showForm);setEditId(null);setForm(empty);}}
          style={{ padding:"0.6rem 1.5rem", background:"var(--champagne)", color:"var(--ivory)", fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ ...cardStyle, marginBottom:"2rem", borderColor:"rgba(196,150,90,0.4)" }}>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.3rem", color:"var(--emerald)", marginBottom:"1.5rem" }}>
            {editId ? "Edit Product" : "New Product"}
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"1.5rem" }}>
            <div className="col-span-2">
              <label style={labelStyle}>Title *</label>
              <input placeholder="Product title" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={{...inputStyle, cursor:"pointer"}}>
                {CATS.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price Label</label>
              <input placeholder="e.g. Price on Request / SGD 5,000" value={form.price_label} onChange={e=>setForm(p=>({...p,price_label:e.target.value}))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price (numeric, optional)</label>
              <input type="text" inputMode="numeric" placeholder="5000" value={form.price as unknown as string || ''} onChange={e=>{ const v = e.target.value; setForm(prev => Object.assign({}, prev, {price: v as unknown as number})); }} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e=>setForm(p=>({...p,sort_order:parseInt(e.target.value)||0}))} style={inputStyle} />
            </div>
            <div className="col-span-2">
              <label style={labelStyle}>Description</label>
              <textarea placeholder="Product description..." value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} style={{...inputStyle, resize:"none"}} />
            </div>
          </div>

          {/* Image upload */}
          <div style={{ marginBottom:"1.5rem" }}>
            <label style={labelStyle}>Images</label>
            <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginBottom:"0.75rem" }}>
              {form.image_urls.map((url,i)=>(
                <div key={i} style={{ position:"relative", width:"80px", height:"80px" }}>
                  <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", border:"1px solid var(--stone)" }} />
                  <button onClick={()=>setForm(p=>({...p,image_urls:p.image_urls.filter((_,j)=>j!==i)}))}
                    style={{ position:"absolute", top:"-6px", right:"-6px", width:"18px", height:"18px", borderRadius:"50%", background:"var(--champagne)", color:"white", border:"none", cursor:"pointer", fontSize:"0.6rem", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                </div>
              ))}
              <button onClick={()=>fileRef.current?.click()}
                style={{ width:"80px", height:"80px", border:"1px dashed var(--stone)", background:"transparent", cursor:"pointer", color:"var(--warm-grey)", fontSize:"1.5rem", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {uploading ? "…" : "+"}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display:"none" }} />
            <p style={{ fontSize:"0.65rem", color:"var(--warm-grey)", fontWeight:300 }}>Or paste image URL: <input placeholder="https://..." value="" onChange={e=>{ if(e.target.value) setForm(p=>({...p,image_urls:[...p.image_urls,e.target.value]})); }} style={{ border:"none", borderBottom:"1px solid var(--stone)", outline:"none", fontSize:"0.75rem", width:"280px", padding:"0.2rem 0", fontFamily:"Jost,sans-serif" }} /></p>
          </div>

          {/* Video upload */}
          <div style={{ marginBottom:"1.5rem" }}>
            <label style={labelStyle}>Video (optional)</label>
            {form.video_url ? (
              <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                <p style={{ fontSize:"0.75rem", color:"var(--emerald)", fontWeight:300 }}>{form.video_url.slice(0,50)}…</p>
                <button onClick={()=>setForm(p=>({...p,video_url:""}))} style={{ color:"var(--champagne)", background:"none", border:"none", cursor:"pointer", fontSize:"0.7rem" }}>Remove</button>
              </div>
            ) : (
              <>
                <button onClick={()=>videoRef.current?.click()}
                  style={{ padding:"0.5rem 1rem", border:"1px dashed var(--stone)", background:"transparent", cursor:"pointer", color:"var(--warm-grey)", fontSize:"0.7rem", fontFamily:"Jost,sans-serif", marginRight:"1rem" }}>
                  Upload Video
                </button>
                <input placeholder="or paste video URL" onChange={e=>setForm(p=>({...p,video_url:e.target.value}))} style={{ border:"none", borderBottom:"1px solid var(--stone)", outline:"none", fontSize:"0.75rem", width:"250px", padding:"0.2rem 0", fontFamily:"Jost,sans-serif" }} />
                <input ref={videoRef} type="file" accept="video/*" onChange={handleVideoUpload} style={{ display:"none" }} />
              </>
            )}
          </div>

          {/* Toggles */}
          <div style={{ display:"flex", gap:"2rem", marginBottom:"1.5rem" }}>
            {[["featured","Featured on homepage"],["visible","Visible on website"]].map(([key,lbl])=>(
              <label key={key} style={{ display:"flex", alignItems:"center", gap:"0.5rem", cursor:"pointer" }}>
                <input type="checkbox" checked={form[key as "featured"|"visible"]} onChange={e=>setForm(p=>({...p,[key]:e.target.checked}))} style={{ accentColor:"var(--champagne)" }} />
                <span style={{ fontSize:"0.75rem", color:"var(--warm-grey)", fontWeight:300 }}>{lbl}</span>
              </label>
            ))}
          </div>

          <button onClick={handleSave} disabled={saving||!form.title}
            style={{ padding:"0.75rem 2rem", background:"var(--champagne)", color:"var(--ivory)", fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"Jost,sans-serif", opacity:saving?0.6:1 }}>
            {saving ? "Saving…" : editId ? "Update Product" : "Publish Product"}
          </button>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <p style={{ color:"var(--warm-grey)", fontSize:"0.8rem" }}>Loading…</p>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1rem" }}>
          {products.map(prod => (
            <div key={prod.id} style={{ ...cardStyle, opacity: prod.visible ? 1 : 0.5, transition:"all 0.2s" }}>
              {prod.image_urls?.[0] && (
                <img src={prod.image_urls[0]} alt={prod.title} style={{ width:"100%", height:"160px", objectFit:"cover", marginBottom:"1rem", border:"1px solid var(--stone)" }} />
              )}
              {prod.video_url && !prod.image_urls?.[0] && (
                <div style={{ width:"100%", height:"160px", background:"var(--emerald)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem" }}>
                  <span style={{ color:"rgba(247,242,232,0.4)", fontSize:"2rem" }}>▶</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.4rem" }}>
                <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:"var(--emerald)", fontWeight:300 }}>{prod.title}</h3>
                {prod.featured && <span style={{ fontSize:"0.5rem", letterSpacing:"0.1em", background:"var(--champagne)", color:"white", padding:"0.2rem 0.5rem" }}>FEATURED</span>}
              </div>
              <p style={{ fontSize:"0.65rem", color:"var(--champagne)", marginBottom:"0.5rem", fontWeight:300 }}>{prod.category} · {prod.price_label}</p>
              {prod.description && <p style={{ fontSize:"0.72rem", color:"var(--warm-grey)", fontWeight:300, marginBottom:"1rem", lineHeight:1.6 }}>{prod.description.slice(0,80)}{prod.description.length>80?"…":""}</p>}

              <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
                <button onClick={()=>startEdit(prod)} style={{ padding:"0.35rem 0.75rem", border:"1px solid var(--emerald)", background:"transparent", color:"var(--emerald)", fontSize:"0.6rem", cursor:"pointer", fontFamily:"Jost,sans-serif", letterSpacing:"0.1em" }}>Edit</button>
                <button onClick={()=>toggleVisible(prod.id, !prod.visible)} style={{ padding:"0.35rem 0.75rem", border:"1px solid var(--stone)", background:"transparent", color:"var(--warm-grey)", fontSize:"0.6rem", cursor:"pointer", fontFamily:"Jost,sans-serif", letterSpacing:"0.1em" }}>
                  {prod.visible ? "Hide" : "Show"}
                </button>
                <button onClick={()=>deleteProduct(prod.id)} style={{ padding:"0.35rem 0.75rem", border:"1px solid #e07070", background:"transparent", color:"#e07070", fontSize:"0.6rem", cursor:"pointer", fontFamily:"Jost,sans-serif", letterSpacing:"0.1em" }}>Delete</button>
              </div>
            </div>
          ))}
          {products.length===0 && <p style={{ color:"var(--stone)", fontSize:"0.8rem", gridColumn:"1/-1", textAlign:"center", padding:"3rem" }}>No products yet. Add your first product above.</p>}
        </div>
      )}
    </div>
  );
}
