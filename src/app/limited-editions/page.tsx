import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const SAMPLE = [
  { id:"1", collection_name:"The Blue Legacy Collection", description:"A curated selection of deep-ocean blue sapphires and teal spinels, each with GIA or AGL certification. Limited to 12 pieces worldwide.", quantity_total:12, quantity_available:7, price_range:"SGD 8,000 – 45,000", status:"published", image_url:null, bg:"var(--emerald)" },
  { id:"2", collection_name:"Emerald Heritage", description:"Colombian and Zambian emeralds of exceptional clarity, set in 18k gold with hand-engraved filigree. Heirloom-grade pieces for generational keeping.", quantity_total:8, quantity_available:3, price_range:"SGD 15,000 – 80,000", status:"published", image_url:null, bg:"#2A1A0A" },
];

async function getCollections() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return SAMPLE;
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("collections").select("*").eq("status","published").order("launch_date",{ascending:false});
    return data && data.length > 0 ? data.map((d: typeof SAMPLE[0], i: number) => ({...d, bg: i===0?"var(--emerald)":"#2A1A0A"})) : SAMPLE;
  } catch { return SAMPLE; }
}

export default async function LimitedEditionsPage() {
  const cols = await getCollections();
  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 text-center relative overflow-hidden" style={{ background:"var(--emerald)" }}>
        <div className="container relative z-10">
          <p className="eyebrow mb-6" style={{ color:"rgba(196,150,90,0.8)" }}>Exclusive Releases</p>
          <h1 className="display mb-8" style={{ fontSize:"clamp(3rem,7vw,6rem)", color:"var(--ivory)" }}>Limited Editions</h1>
          <span className="rule-champagne mx-auto block mb-6" style={{ opacity:0.5 }} />
          <p className="text-sm" style={{ color:"rgba(247,242,232,0.5)", fontWeight:300 }}>Private-access collections released exclusively to VIP members.</p>
        </div>
      </section>

      <section className="section" style={{ background:"var(--ivory)" }}>
        <div className="container">
          <div className="space-y-8">
            {cols.map((col, i) => (
              <div key={col.id} className="grid grid-cols-1 lg:grid-cols-5 overflow-hidden" style={{ border:"1px solid var(--stone)" }}>
                <div className={`lg:col-span-2 h-64 lg:h-auto flex items-center justify-center ${i%2===1?"lg:order-last":""}`}
                  style={{ background: col.bg, minHeight:"280px" }}>
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rotate-45 mx-auto mb-6" style={{ border:"1px solid rgba(196,150,90,0.3)", background:"rgba(196,150,90,0.06)" }}>
                      <div className="absolute inset-2" style={{ border:"1px solid rgba(196,150,90,0.15)" }} />
                    </div>
                    <p className="eyebrow" style={{ color:"rgba(196,150,90,0.6)", fontSize:"0.5rem" }}>Preview by Appointment</p>
                  </div>
                </div>
                <div className="lg:col-span-3 p-10 lg:p-14 flex flex-col justify-center" style={{ background:"var(--ivory)" }}>
                  <p className="eyebrow-dark mb-4">{col.status==="published"?"Now Available":"Coming Soon"}</p>
                  <h2 className="display mb-4" style={{ fontSize:"clamp(2rem,4vw,3rem)", color:"var(--emerald)" }}>{col.collection_name}</h2>
                  <span className="rule-champagne block mb-6" />
                  <p className="text-sm leading-loose mb-8" style={{ color:"var(--warm-grey)", fontWeight:300 }}>{col.description}</p>
                  <div className="flex flex-wrap gap-8 mb-10">
                    <div>
                      <p className="eyebrow-dark mb-1" style={{ fontSize:"0.5rem" }}>Pieces Available</p>
                      <p className="display text-3xl" style={{ color:"var(--champagne)" }}>{col.quantity_available}/{col.quantity_total}</p>
                    </div>
                    {col.price_range && (
                      <div>
                        <p className="eyebrow-dark mb-1" style={{ fontSize:"0.5rem" }}>Price Range</p>
                        <p className="text-sm mt-1" style={{ color:"var(--emerald)", fontWeight:300 }}>{col.price_range}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/vip-preorder" className="btn-gold">Reserve Deposit</Link>
                    <Link href="/appointment" className="btn-outline-emerald">Request Private Viewing</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
