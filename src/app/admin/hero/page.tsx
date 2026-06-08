"use client";
import { useState, useEffect, useRef } from "react";
import { A } from "@/lib/adminStyles";
import { PageHeader } from "@/components/admin/PageHeader";

const inp = A.input;
const lbl = A.label;

type HeroData = { title:string; subtitle:string; body:string; visible:boolean; };
type MediaItem = { id:string; url:string; type:string; filename:string; created_at:string; };

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroData>({ title:"Rare Gems. Refined Legacy.", subtitle:"A private jewellery maison for bespoke heirlooms, limited-edition gemstone pieces, and collectible rare stone ownership.", body:"", visible:true });
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/hero").then(r=>r.json()).then(d => {
      if (d.sections?.hero) {
        const h = d.sections.hero;
        setHero({ title:h.title||"", subtitle:h.subtitle||"", body:h.body||"", visible:h.visible!==false });
      }
      setMedia(d.media||[]);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  async function saveHero() {
    setSaving(true);
    try {
      await fetch("/api/admin/hero", { method:"PATCH", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ section_key:"hero", title:hero.title, subtitle:hero.subtitle, body:hero.body, visible:hero.visible }) });
      setSaved(true);
      setTimeout(()=>setSaved(false),3000);
    } finally { setSaving(false); }
  }

  async function uploadMedia(files: FileList, type: "image"|"video") {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      fd.append("linked_to", "hero");
      const res = await fetch("/api/admin/upload", { method:"POST", body:fd });
      const d = await res.json();
      if (d.url) {
        setMedia(prev => [{ id:d.id||Date.now().toString(), url:d.url, type, filename:file.name, created_at:new Date().toISOString() }, ...prev]);
      }
    }
    setUploading(false);
  }

  async function deleteMedia(id: string) {
    await fetch(`/api/admin/upload?id=${id}`, { method:"DELETE" });
    setMedia(prev => prev.filter(m => m.id !== id));
  }

  if (loading) return <div style={{ color:A.warmGrey, fontSize:"0.8rem" }}>Loading…</div>;

  return (
    <div>
      <PageHeader eyebrow="Website CMS" title="Hero Section"
        sub="Changes reflect on the homepage immediately after saving"
        action={
          <button onClick={saveHero} disabled={saving} style={{ ...A.btnGold, opacity:saving?0.6:1 }}>
            {saving?"Saving…":saved?"✓ Saved":"Save Changes"}
          </button>
        }
      />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>

        {/* Left — Text content */}
        <div>
          <div style={{ ...A.card, marginBottom:"1.25rem" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, marginBottom:"1.25rem" }}>Text Content</div>

            <div style={{ marginBottom:"1rem" }}>
              <label style={lbl}>Main Headline</label>
              <input value={hero.title} onChange={e=>setHero(p=>({...p,title:e.target.value}))} style={inp} placeholder="e.g. Rare Gems. Refined Legacy." />
              <div style={{ fontSize:"0.6rem", color:A.warmGrey, marginTop:"0.3rem", fontFamily:"'Jost',sans-serif", fontWeight:300 }}>Tip: Use a period to split into two lines (e.g. "Rare Gems. Refined Legacy.")</div>
            </div>

            <div style={{ marginBottom:"1rem" }}>
              <label style={lbl}>Subheadline / Description</label>
              <textarea value={hero.subtitle} onChange={e=>setHero(p=>({...p,subtitle:e.target.value}))} rows={3} style={{ ...inp, resize:"none", display:"block" }} placeholder="Short description shown below the headline" />
            </div>

            <div style={{ marginBottom:"1.25rem" }}>
              <label style={lbl}>Additional Body Text (optional)</label>
              <textarea value={hero.body} onChange={e=>setHero(p=>({...p,body:e.target.value}))} rows={2} style={{ ...inp, resize:"none", display:"block" }} placeholder="Optional extra text" />
            </div>

            <label style={{ display:"flex", alignItems:"center", gap:"0.5rem", cursor:"pointer" }}>
              <input type="checkbox" checked={hero.visible} onChange={e=>setHero(p=>({...p,visible:e.target.checked}))} style={{ accentColor:A.champagne, width:"14px", height:"14px" }} />
              <span style={{ ...lbl, marginBottom:0, textTransform:"none", letterSpacing:"0.03em", fontSize:"0.72rem" }}>Hero section visible on website</span>
            </label>
          </div>

          {/* Live preview */}
          <div style={{ ...A.card, overflow:"hidden", padding:0 }}>
            <div style={{ padding:"0.75rem 1.25rem", borderBottom:`1px solid ${A.stone}` }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:A.emerald }}>Live Preview</span>
            </div>
            <div style={{ background:"linear-gradient(155deg,#1C3D35 0%,#0D2020 100%)", padding:"2.5rem 2rem", minHeight:"200px" }}>
              <div style={{ fontSize:"0.45rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(196,150,90,.8)", marginBottom:"1rem", fontFamily:"'Jost',sans-serif" }}>Private Jewellery Maison · Singapore</div>
              {hero.title.includes(".") ? (
                <>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.5rem", fontWeight:300, color:"#F7F2E8", lineHeight:1.05 }}>{hero.title.split(".")[0]}.</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.5rem", fontWeight:300, fontStyle:"italic", color:"#D4AA7A", lineHeight:1.05 }}>{hero.title.split(".").slice(1).join(".").trim()}</div>
                </>
              ) : (
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.5rem", fontWeight:300, color:"#F7F2E8" }}>{hero.title}</div>
              )}
              {hero.subtitle && <div style={{ fontSize:"0.75rem", color:"rgba(247,242,232,.55)", fontWeight:300, marginTop:"1rem", lineHeight:1.7, maxWidth:"360px", fontFamily:"'Jost',sans-serif" }}>{hero.subtitle}</div>}
            </div>
          </div>
        </div>

        {/* Right — Media */}
        <div>
          <div style={A.card}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, marginBottom:"1.25rem" }}>Hero Media (Images & Videos)</div>
            <div style={{ fontSize:"0.7rem", color:A.warmGrey, fontWeight:300, marginBottom:"1.25rem", lineHeight:1.6, fontFamily:"'Jost',sans-serif" }}>
              Upload images or videos that will display in the hero background. First visible media will be used.
            </div>

            {/* Upload buttons */}
            <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
              <button onClick={()=>imgRef.current?.click()} disabled={uploading}
                style={{ ...A.btnEmerald, opacity:uploading?0.6:1 }}>
                {uploading?"Uploading…":"+ Upload Image"}
              </button>
              <button onClick={()=>vidRef.current?.click()} disabled={uploading}
                style={{ ...A.btnOutline, opacity:uploading?0.6:1 }}>
                + Upload Video
              </button>
              <input ref={imgRef} type="file" accept="image/*" multiple onChange={e=>e.target.files&&uploadMedia(e.target.files,"image")} style={{ display:"none" }} />
              <input ref={vidRef} type="file" accept="video/*" onChange={e=>e.target.files&&uploadMedia(e.target.files,"video")} style={{ display:"none" }} />
            </div>

            {/* Media grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.75rem" }}>
              {media.map((m, idx) => (
                <div key={m.id} style={{ position:"relative", border:`1px solid ${A.stone}`, overflow:"hidden" }}>
                  {idx === 0 && (
                    <div style={{ position:"absolute", top:"6px", left:"6px", zIndex:2, padding:"0.15rem 0.4rem", backgroundColor:A.champagne, fontSize:"0.45rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"white", fontFamily:"'Jost',sans-serif" }}>Active</div>
                  )}
                  {m.type === "video" ? (
                    <video src={m.url} muted style={{ width:"100%", height:"100px", objectFit:"cover", display:"block" }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.filename} style={{ width:"100%", height:"100px", objectFit:"cover", display:"block" }} />
                  )}
                  <div style={{ padding:"0.5rem 0.6rem", backgroundColor:A.white, borderTop:`1px solid ${A.stone}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"0.55rem", color:A.warmGrey, fontWeight:300, fontFamily:"'Jost',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"80px" }}>
                      {m.type === "video" ? "🎬" : "🖼"} {m.filename}
                    </span>
                    <button onClick={()=>deleteMedia(m.id)} style={{ background:"none", border:"none", color:"#8B3030", cursor:"pointer", fontSize:"0.7rem", padding:"0 0.2rem" }}>✕</button>
                  </div>
                </div>
              ))}
              {media.length === 0 && (
                <div style={{ gridColumn:"1/-1", padding:"2rem", textAlign:"center", border:`1px dashed ${A.stone}`, color:A.stone, fontSize:"0.75rem", fontFamily:"'Jost',sans-serif" }}>
                  No media uploaded yet. Upload images or videos above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
