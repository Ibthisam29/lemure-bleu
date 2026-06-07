import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import VipForm from "@/components/ui/VipForm";
import Link from "next/link";
import { getAllSections, getFeaturedProducts, getVisibleStones, getAds, getEvents } from "@/lib/data";

export const revalidate = 60; // ISR — refresh every 60 seconds

const FALLBACK_STONES = [
  { id:"1", stone_name:"Blue Sapphire", origin:"Kashmir, India", carat:5.2, colour:"#1B3A5C", status:"available" },
  { id:"2", stone_name:"Colombian Emerald", origin:"Muzo, Colombia", carat:3.8, colour:"#1A4232", status:"reserved" },
  { id:"3", stone_name:"Burmese Ruby", origin:"Mogok, Myanmar", carat:2.4, colour:"#7A1E2E", status:"available" },
  { id:"4", stone_name:"Mahenge Spinel", origin:"Tanzania", carat:4.1, colour:"#7A2850", status:"private_viewing_only" },
  { id:"5", stone_name:"Tanzanite", origin:"Merelani Hills", carat:7.6, colour:"#2E1E60", status:"available" },
  { id:"6", stone_name:"Paraíba Tourmaline", origin:"Brazil", carat:1.9, colour:"#0A6B7A", status:"sold" },
];

const TRUST = ["Bespoke Jewellery","Rare Gemstones","Private Appointments","Limited Editions","Heirloom Redesign","VIP Preorders"];

export default async function HomePage() {
  const [sections, products, stones, ads, events] = await Promise.all([
    getAllSections(),
    getFeaturedProducts(),
    getVisibleStones(),
    getAds("homepage_banner"),
    getEvents(),
  ]);

  const hero    = sections["hero"]    || { title:"Rare Gems. Refined Legacy.", subtitle:"A private jewellery maison for bespoke heirlooms, limited-edition gemstone pieces, and collectible rare stone ownership.", body:"" };
  const maison  = sections["maison"]  || { title:"The Maison of Quiet Luxury", subtitle:"The Maison", body:"Lemure Bleu creates jewellery designed not only to be worn, but to be inherited. Each piece begins with rarity, provenance, and personal legacy." };
  const sv      = sections["stone_vault"] || { title:"The Stone Vault", subtitle:"Curated Rarities", body:"", visible:true };
  const limited = sections["limited_ed"] || { title:"The Blue Legacy Collection", subtitle:"Limited Edition", body:"A limited preorder collection released only to VIP members before public access.", visible:true };
  const bespoke = sections["bespoke"] || { title:"Commission an Heirloom", subtitle:"Bespoke & Heirloom", body:"Jewellery designed not only to be worn, but to be inherited.", visible:true };
  const vipPre  = sections["vip_preorder"] || { title:"VIP Gemstone Preorder", subtitle:"", body:"Place a VIP preorder deposit for future access.", visible:true };

  const displayStones = stones.length > 0 ? stones.slice(0,6) : FALLBACK_STONES;

  return (
    <main>
      <Navigation />

      {/* ── GLOBAL TOP AD ── */}
      {ads.filter((a:{position:string}) => a.position === "global_top").map((ad:{id:string;title:string;body:string;cta_label:string;cta_link:string;bg_color:string;text_color:string}) => (
        <div key={ad.id} style={{ background:ad.bg_color||"#1C3D35", padding:"0.75rem 1.5rem", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:"1.5rem", flexWrap:"wrap" }}>
          <p style={{ fontSize:"0.78rem", color:ad.text_color||"#F7F2E8", fontFamily:"Jost,sans-serif", fontWeight:300 }}>{ad.title}{ad.body ? ` — ${ad.body}` : ""}</p>
          {ad.cta_label && ad.cta_link && (
            <Link href={ad.cta_link} style={{ fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"#C4965A", fontFamily:"Jost,sans-serif", textDecoration:"none", borderBottom:"1px solid rgba(196,150,90,0.4)" }}>{ad.cta_label}</Link>
          )}
        </div>
      ))}

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background:"linear-gradient(155deg,#1C3D35 0%,#122C25 55%,#0D2020 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 70% 60% at 65% 45%,rgba(196,150,90,0.08) 0%,transparent 65%)" }} />
        <div className="absolute top-32 left-12 w-px h-40 opacity-20" style={{ background:"linear-gradient(to bottom,transparent,#C4965A,transparent)" }} />
        <div className="absolute top-32 left-12 w-40 h-px opacity-20" style={{ background:"linear-gradient(to right,transparent,#C4965A,transparent)" }} />
        <div className="absolute bottom-24 right-12 w-px h-40 opacity-20" style={{ background:"linear-gradient(to bottom,transparent,#C4965A,transparent)" }} />
        <div className="absolute bottom-24 right-12 w-40 h-px opacity-20" style={{ background:"linear-gradient(to left,transparent,#C4965A,transparent)" }} />

        <div className="container pt-36 pb-24 relative z-10">
          <div className="max-w-3xl">
            <p className="eyebrow fade-up mb-8" style={{ color:"rgba(196,150,90,0.9)" }}>Private Jewellery Maison · Singapore</p>
            {/* Splits on ". " so second sentence can be italic */}
            {hero.title.includes(".") ? (
              <>
                <h1 className="display fade-up-2 mb-4" style={{ fontSize:"clamp(4rem,9vw,8rem)", color:"#F7F2E8" }}>{hero.title.split(".")[0]}.</h1>
                <h1 className="display-italic fade-up-3 mb-10" style={{ fontSize:"clamp(4rem,9vw,8rem)", color:"#D4AA7A" }}>{hero.title.split(".").slice(1).join(".").trim()}</h1>
              </>
            ) : (
              <h1 className="display fade-up-2 mb-10" style={{ fontSize:"clamp(4rem,9vw,8rem)", color:"#F7F2E8" }}>{hero.title}</h1>
            )}
            <div className="fade-up-4 flex items-center gap-4 mb-10">
              <span className="rule-champagne" style={{ opacity:0.6 }} />
              <p className="text-sm" style={{ color:"rgba(247,242,232,0.55)", fontWeight:300, maxWidth:"420px", lineHeight:"1.8" }}>{hero.subtitle}</p>
            </div>
            <div className="fade-up-4 flex flex-col sm:flex-row gap-4">
              <Link href="/vip" className="btn-gold">Join VIP List</Link>
              <Link href="/appointment" className="btn-outline-ivory">Book Private Appointment</Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-14" style={{ background:"linear-gradient(to bottom,transparent,rgba(196,150,90,0.6))" }} />
          <p className="eyebrow" style={{ fontSize:"0.48rem", color:"rgba(196,150,90,0.5)" }}>Scroll</p>
        </div>
      </section>

      {/* ── TRUST MARQUEE ── */}
      <section style={{ background:"#EDE6D6", borderTop:"1px solid #CFC8BC", borderBottom:"1px solid #CFC8BC", overflow:"hidden" }}>
        <div className="py-5 flex" style={{ animation:"marquee 22s linear infinite" }}>
          {[...TRUST,...TRUST].map((item,i) => (
            <div key={i} className="flex items-center flex-shrink-0 px-10">
              <span className="eyebrow" style={{ color:"#C4965A", whiteSpace:"nowrap", fontSize:"0.58rem" }}>{item}</span>
              <span className="ml-10 w-1 h-1 flex-shrink-0 rotate-45" style={{ background:"#C4965A", opacity:0.4 }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── HOMEPAGE BANNER AD ── */}
      {ads.filter((a:{position:string}) => a.position === "homepage_banner").map((ad:{id:string;title:string;body:string;cta_label:string;cta_link:string;bg_color:string;text_color:string;image_url:string}) => (
        <section key={ad.id} style={{ background:ad.bg_color||"#C4965A", padding:"3rem 0" }}>
          <div className="container text-center">
            <h3 className="display mb-3" style={{ fontSize:"clamp(1.8rem,4vw,3rem)", color:ad.text_color||"#F7F2E8" }}>{ad.title}</h3>
            {ad.body && <p style={{ color:ad.text_color||"#F7F2E8", opacity:0.75, fontSize:"0.9rem", fontWeight:300, marginBottom:"1.5rem" }}>{ad.body}</p>}
            {ad.cta_label && ad.cta_link && (
              <Link href={ad.cta_link} className="btn-gold">{ad.cta_label}</Link>
            )}
          </div>
        </section>
      ))}

      {/* ── MAISON INTRO ── */}
      <section className="section" style={{ background:"#F7F2E8" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="eyebrow-dark mb-6">{maison.subtitle || "The Maison"}</p>
              <h2 className="display mb-6" style={{ fontSize:"clamp(2.8rem,5vw,4.5rem)", color:"#1C3D35" }}>
                {maison.title.includes(" of ") ? (
                  <>{maison.title.split(" of ")[0]} of <br /><em style={{ color:"#C4965A" }}>{maison.title.split(" of ").slice(1).join(" of ")}</em></>
                ) : maison.title}
              </h2>
              <span className="rule-emerald block mb-8" />
              <p className="leading-loose" style={{ color:"#8C857A", fontWeight:300, fontSize:"0.95rem" }}>{maison.body}</p>
            </div>
            <div className="relative h-80 lg:h-[500px]" style={{ background:"#1C3D35", border:"1px solid rgba(196,150,90,0.15)" }}>
              <div className="absolute inset-6" style={{ border:"1px solid rgba(196,150,90,0.15)" }} />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <div className="w-24 h-24 rotate-45 relative" style={{ border:"1px solid rgba(196,150,90,0.3)", background:"rgba(196,150,90,0.05)" }}>
                  <div className="absolute inset-3" style={{ border:"1px solid rgba(196,150,90,0.2)" }} />
                </div>
                <p className="eyebrow mt-8" style={{ color:"rgba(196,150,90,0.6)", fontSize:"0.52rem" }}>Est. Singapore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS (from Admin CMS) ── */}
      {products.length > 0 && (
        <section className="section" style={{ background:"#F7F2E8" }}>
          <div className="container">
            <div className="text-center mb-14">
              <p className="eyebrow-dark mb-4">Curated Selection</p>
              <h2 className="display" style={{ fontSize:"clamp(2.5rem,5vw,4rem)", color:"#1C3D35" }}>Featured Pieces</h2>
              <span className="rule-champagne mx-auto block mt-6" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p:{id:string;title:string;description:string;image_urls:string[];video_url:string;price_label:string;price:number;category:string;featured:boolean}) => (
                <div key={p.id} className="group" style={{ background:"white", border:"1px solid #CFC8BC", transition:"box-shadow 0.3s" }}
                  onMouseEnter={(e:React.MouseEvent<HTMLDivElement>)=>e.currentTarget.style.boxShadow="0 8px 32px rgba(28,61,53,0.1)"}
                  onMouseLeave={(e:React.MouseEvent<HTMLDivElement>)=>e.currentTarget.style.boxShadow="none"}>
                  {p.image_urls?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_urls[0]} alt={p.title} style={{ width:"100%", height:"220px", objectFit:"cover" }} />
                  ) : p.video_url ? (
                    <video src={p.video_url} muted autoPlay loop playsInline style={{ width:"100%", height:"220px", objectFit:"cover" }} />
                  ) : (
                    <div style={{ height:"220px", background:"#1C3D35", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div className="w-16 h-16 rotate-45" style={{ border:"1px solid rgba(196,150,90,0.3)" }} />
                    </div>
                  )}
                  <div style={{ padding:"1.5rem" }}>
                    {p.featured && <span style={{ fontSize:"0.5rem", letterSpacing:"0.15em", textTransform:"uppercase", background:"#C4965A", color:"white", padding:"0.15rem 0.5rem", marginBottom:"0.5rem", display:"inline-block" }}>Featured</span>}
                    <h3 className="display text-xl mb-1" style={{ color:"#1C3D35" }}>{p.title}</h3>
                    <p style={{ fontSize:"0.65rem", color:"#C4965A", fontWeight:300, marginBottom:"0.5rem" }}>{p.category}</p>
                    <p style={{ fontSize:"0.78rem", color:"#8C857A", fontWeight:300, marginBottom:"1rem", lineHeight:1.6 }}>{p.description?.slice(0,80)}{(p.description?.length||0)>80?"…":""}</p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1rem", color:"#1C3D35" }}>{p.price_label || "Price on Request"}</span>
                      <Link href="/appointment" className="btn-outline-emerald" style={{ padding:"0.5rem 1rem", fontSize:"0.58rem" }}>Enquire</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/products" className="btn-outline-emerald">View All Pieces</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── STONE VAULT PREVIEW ── */}
      {(sections["stone_vault"]?.visible !== false) && (
        <section className="section" style={{ background:"#EDE6D6" }}>
          <div className="container">
            <div className="text-center mb-16">
              <p className="eyebrow-dark mb-4">{sv.subtitle || "Curated Rarities"}</p>
              <h2 className="display" style={{ fontSize:"clamp(2.5rem,5vw,4rem)", color:"#1C3D35" }}>{sv.title}</h2>
              <span className="rule-champagne mx-auto block mt-6" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayStones.map((stone:{id:string;stone_name:string;origin:string;carat:number;colour:string;status:string;image_url:string}) => (
                <div key={stone.id} className="group overflow-hidden" style={{ background:"#F7F2E8", border:"1px solid #CFC8BC", transition:"all 0.4s ease" }}>
                  {stone.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={stone.image_url} alt={stone.stone_name} style={{ width:"100%", height:"208px", objectFit:"cover" }} />
                  ) : (
                    <div className="h-52 relative flex items-center justify-center overflow-hidden" style={{ background:stone.colour||"#1C3D35" }}>
                      <div className="w-20 h-20 rotate-45 transition-all duration-700 group-hover:rotate-90 group-hover:scale-110"
                        style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)" }}>
                        <div className="absolute inset-2" style={{ border:"1px solid rgba(255,255,255,0.08)" }} />
                      </div>
                    </div>
                  )}
                  <div style={{ padding:"1.5rem" }}>
                    <h3 className="display text-xl mb-1" style={{ color:"#1C3D35" }}>{stone.stone_name}</h3>
                    <p style={{ fontSize:"0.65rem", color:"#C4965A", fontWeight:300, marginBottom:"0.25rem" }}>{stone.origin}</p>
                    <p style={{ fontSize:"0.65rem", color:"#8C857A", fontWeight:300, marginBottom:"1rem" }}>{stone.carat} ct · Price on Request</p>
                    {stone.status !== "sold" ? (
                      <Link href="/appointment" className="btn-outline-emerald w-full text-center block py-2.5" style={{ fontSize:"0.58rem", display:"block" }}>Reserve Interest</Link>
                    ) : (
                      <div style={{ padding:"0.5rem", textAlign:"center", background:"#CFC8BC", fontSize:"0.6rem", color:"#8C857A", letterSpacing:"0.1em", textTransform:"uppercase" }}>Sold</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/stone-vault" className="btn-outline-emerald">View Stone Vault</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS (from Admin) ── */}
      {events.length > 0 && (
        <section className="section" style={{ background:"#F7F2E8" }}>
          <div className="container">
            <div className="text-center mb-14">
              <p className="eyebrow-dark mb-4">Private Events</p>
              <h2 className="display" style={{ fontSize:"clamp(2.5rem,5vw,4rem)", color:"#1C3D35" }}>Upcoming Events</h2>
              <span className="rule-champagne mx-auto block mt-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0,3).map((ev:{id:string;title:string;description:string;event_date:string;location:string;event_type:string;image_url:string;cta_label:string;cta_link:string}) => (
                <div key={ev.id} style={{ background:"white", border:"1px solid #CFC8BC" }}>
                  {ev.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.image_url} alt={ev.title} style={{ width:"100%", height:"180px", objectFit:"cover" }} />
                  )}
                  <div style={{ padding:"1.5rem" }}>
                    <span style={{ fontSize:"0.5rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#C4965A", fontFamily:"Jost,sans-serif" }}>{ev.event_type}</span>
                    <h3 className="display text-xl mt-2 mb-2" style={{ color:"#1C3D35" }}>{ev.title}</h3>
                    {ev.event_date && <p style={{ fontSize:"0.7rem", color:"#8C857A", fontWeight:300, marginBottom:"0.4rem" }}>{new Date(ev.event_date).toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"})}</p>}
                    {ev.location && <p style={{ fontSize:"0.7rem", color:"#8C857A", fontWeight:300, marginBottom:"0.75rem" }}>{ev.location}</p>}
                    {ev.description && <p style={{ fontSize:"0.78rem", color:"#8C857A", fontWeight:300, lineHeight:1.6, marginBottom:"1rem" }}>{ev.description.slice(0,100)}…</p>}
                    <Link href={ev.cta_link||"/vip"} className="btn-gold" style={{ padding:"0.6rem 1.5rem", fontSize:"0.58rem" }}>{ev.cta_label||"Register Interest"}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LIMITED EDITION ── */}
      {(sections["limited_ed"]?.visible !== false) && (
        <section className="section relative overflow-hidden" style={{ background:"#1C3D35" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 50% 80% at 80% 50%,rgba(196,150,90,0.06) 0%,transparent 60%)" }} />
          <div className="container relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <p className="eyebrow mb-6" style={{ color:"rgba(196,150,90,0.8)" }}>{limited.subtitle || "Limited Edition"}</p>
              <h2 className="display mb-6" style={{ fontSize:"clamp(2.5rem,5vw,4rem)", color:"#F7F2E8" }}>{limited.title}</h2>
              <span className="rule-champagne mx-auto block mb-8" style={{ opacity:0.5 }} />
              <p className="mb-10 leading-loose" style={{ color:"rgba(247,242,232,0.6)", fontWeight:300, fontSize:"0.9rem" }}>{limited.body}</p>
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[{n:"12",l:"Pieces Only"},{n:"VIP",l:"Members First"},{n:"COA",l:"Authenticated"}].map(s=>(
                  <div key={s.l} className="py-6 px-4" style={{ border:"1px solid rgba(196,150,90,0.2)", background:"rgba(196,150,90,0.04)" }}>
                    <p className="display text-3xl mb-1" style={{ color:"#D4AA7A" }}>{s.n}</p>
                    <p className="eyebrow" style={{ color:"rgba(247,242,232,0.45)", fontSize:"0.5rem" }}>{s.l}</p>
                  </div>
                ))}
              </div>
              <Link href="/vip-preorder" className="btn-gold">Register for VIP Preorder</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── BESPOKE HEIRLOOM ── */}
      {(sections["bespoke"]?.visible !== false) && (
        <section className="section" style={{ background:"#F7F2E8" }}>
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              <div className="relative h-72 lg:h-full min-h-80 order-2 lg:order-1" style={{ background:"#EDE6D6", border:"1px solid #CFC8BC" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="display" style={{ fontSize:"6rem", color:"#CFC8BC", opacity:0.5 }}>H</p>
                    <p className="eyebrow-dark mt-2" style={{ fontSize:"0.5rem" }}>Heirloom by Design</p>
                  </div>
                </div>
                <div className="absolute inset-0" style={{ border:"8px solid #F7F2E8", outline:"1px solid #CFC8BC" }} />
              </div>
              <div className="order-1 lg:order-2">
                <p className="eyebrow-dark mb-6">{bespoke.subtitle || "Bespoke & Heirloom"}</p>
                <h2 className="display mb-6" style={{ fontSize:"clamp(2.5rem,5vw,4rem)", color:"#1C3D35" }}>{bespoke.title}</h2>
                <span className="rule-champagne block mb-8" />
                <p className="mb-10 leading-loose" style={{ color:"#8C857A", fontWeight:300, fontSize:"0.9rem" }}>{bespoke.body}</p>
                <div className="space-y-0 mb-10">
                  {["Bespoke Rings","Bridal Jewellery","Heirloom Redesign","Gemstone Sourcing","Private Collection Pieces","Legacy Gifts"].map(item=>(
                    <div key={item} className="flex items-center gap-4 py-3.5" style={{ borderBottom:"1px solid #CFC8BC" }}>
                      <div className="w-1 h-1 rotate-45 flex-shrink-0" style={{ background:"#C4965A" }} />
                      <span style={{ fontSize:"0.875rem", color:"#1C3D35", fontWeight:300 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/appointment" className="btn-gold">Book a Private Consultation</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── VIP PREORDER BANNER ── */}
      {(sections["vip_preorder"]?.visible !== false) && (
        <section className="section-sm" style={{ background:"#F0E0C4", borderTop:"1px solid #CFC8BC" }}>
          <div className="container">
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="eyebrow-dark mb-3">{vipPre.subtitle || "VIP Gemstone Preorder"}</p>
                <h3 className="display text-3xl" style={{ color:"#1C3D35" }}>{vipPre.title}</h3>
              </div>
              <div className="flex-shrink-0">
                <Link href="/vip-preorder" className="btn-gold">Place Preorder Deposit</Link>
              </div>
            </div>
            <p style={{ fontSize:"0.65rem", textAlign:"center", marginTop:"2rem", color:"#8C857A", fontWeight:300 }}>
              Collectible gemstone preorder · Not a financial investment product · Priority access only
            </p>
          </div>
        </section>
      )}

      {/* ── VIP FORM ── */}
      <section className="section relative overflow-hidden" style={{ background:"#1C3D35" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 60% 50% at 30% 60%,rgba(196,150,90,0.07) 0%,transparent 65%)" }} />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-14">
              <p className="eyebrow mb-6" style={{ color:"rgba(196,150,90,0.8)" }}>Private Access</p>
              <h2 className="display mb-4" style={{ fontSize:"clamp(2.5rem,5vw,4rem)", color:"#F7F2E8" }}>Join the Private Circle</h2>
              <span className="rule-champagne mx-auto block mb-8" style={{ opacity:0.5 }} />
              <p style={{ fontSize:"0.82rem", color:"rgba(247,242,232,0.5)", fontWeight:300 }}>Private access. Limited stones. Timeless value.</p>
            </div>
            <VipForm dark />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
