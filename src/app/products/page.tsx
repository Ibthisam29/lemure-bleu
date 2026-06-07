import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getAllProducts } from "@/lib/data";

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = Array.from(new Set(products.map((p:{category:string}) => p.category)));

  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 text-center relative overflow-hidden" style={{ background:"linear-gradient(160deg,#1C3D35 0%,#0D2020 100%)" }}>
        <div className="container relative z-10">
          <p className="eyebrow mb-6" style={{ color:"rgba(196,150,90,0.8)" }}>Private Collection</p>
          <h1 className="display mb-8" style={{ fontSize:"clamp(3rem,7vw,6rem)", color:"#F7F2E8" }}>The Collection</h1>
          <span className="rule-champagne mx-auto block mb-6" style={{ opacity:0.5 }} />
          <p style={{ color:"rgba(247,242,232,0.5)", fontSize:"0.85rem", fontWeight:300 }}>Curated pieces, rare gemstones, and bespoke jewellery from Lemure Bleu.</p>
        </div>
      </section>

      <section className="section" style={{ background:"#EDE6D6" }}>
        <div className="container">
          {categories.length > 1 && (
            <div className="flex gap-3 flex-wrap mb-10">
              {categories.map(cat => (
                <span key={cat} style={{ padding:"0.4rem 1rem", border:"1px solid #CFC8BC", fontSize:"0.6rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#1C3D35", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>
                  {cat}
                </span>
              ))}
            </div>
          )}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ color:"#8C857A", fontSize:"0.85rem" }}>No products published yet. Add products from the admin dashboard.</p>
              <Link href="/appointment" className="btn-gold mt-8 inline-flex">Book Private Consultation</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p:{id:string;title:string;description:string;image_urls:string[];video_url:string;price_label:string;category:string;featured:boolean}) => (
                <div key={p.id} className="group" style={{ background:"white", border:"1px solid #CFC8BC", transition:"box-shadow 0.3s" }}>
                  {p.image_urls?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_urls[0]} alt={p.title} style={{ width:"100%", height:"260px", objectFit:"cover" }} />
                  ) : p.video_url ? (
                    <video src={p.video_url} muted autoPlay loop playsInline style={{ width:"100%", height:"260px", objectFit:"cover" }} />
                  ) : (
                    <div style={{ height:"260px", background:"#1C3D35", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div className="w-16 h-16 rotate-45" style={{ border:"1px solid rgba(196,150,90,0.3)" }} />
                    </div>
                  )}
                  <div style={{ padding:"1.5rem" }}>
                    {p.featured && <span style={{ fontSize:"0.5rem", letterSpacing:"0.12em", textTransform:"uppercase", background:"#C4965A", color:"white", padding:"0.15rem 0.5rem", display:"inline-block", marginBottom:"0.5rem" }}>Featured</span>}
                    <h3 className="display text-xl mb-1" style={{ color:"#1C3D35" }}>{p.title}</h3>
                    <p style={{ fontSize:"0.62rem", color:"#C4965A", fontWeight:300, marginBottom:"0.75rem", textTransform:"uppercase", letterSpacing:"0.12em" }}>{p.category}</p>
                    {p.description && <p style={{ fontSize:"0.78rem", color:"#8C857A", fontWeight:300, lineHeight:1.7, marginBottom:"1.25rem" }}>{p.description}</p>}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:"#1C3D35" }}>{p.price_label || "Price on Request"}</span>
                      <Link href="/appointment" className="btn-outline-emerald" style={{ padding:"0.5rem 1rem", fontSize:"0.58rem" }}>Enquire</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
