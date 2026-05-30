import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const SAMPLE_STONES = [
  { id:"1", stone_name:"Blue Sapphire", origin:"Kashmir, India", carat:5.2, colour:"#1B3A5C", status:"available" },
  { id:"2", stone_name:"Colombian Emerald", origin:"Muzo, Colombia", carat:3.8, colour:"#1A4232", status:"reserved" },
  { id:"3", stone_name:"Burmese Ruby", origin:"Mogok, Myanmar", carat:2.4, colour:"#7A1E2E", status:"available" },
  { id:"4", stone_name:"Mahenge Spinel", origin:"Tanzania", carat:4.1, colour:"#7A2850", status:"private_viewing_only" },
  { id:"5", stone_name:"Tanzanite", origin:"Merelani Hills", carat:7.6, colour:"#2E1E60", status:"available" },
  { id:"6", stone_name:"Paraíba Tourmaline", origin:"Brazil", carat:1.9, colour:"#0A6B7A", status:"sold" },
];

const STATUS: Record<string,{label:string,color:string}> = {
  available:           { label:"Available",       color:"#3D8B5E" },
  reserved:            { label:"Reserved",         color:"#B8882A" },
  sold:                { label:"Sold",             color:"#8B3A3A" },
  private_viewing_only:{ label:"Private Viewing",  color:"var(--emerald-lt)" },
};

async function getStones() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return SAMPLE_STONES;
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("stones").select("*").order("created_at",{ascending:false});
    return data && data.length > 0 ? data : SAMPLE_STONES;
  } catch { return SAMPLE_STONES; }
}

export default async function StoneVaultPage() {
  const stones = await getStones();
  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 text-center relative overflow-hidden" style={{ background: "var(--emerald)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 60% 50%, rgba(196,150,90,0.06) 0%, transparent 60%)" }} />
        <div className="container relative z-10">
          <p className="eyebrow mb-6" style={{ color: "rgba(196,150,90,0.8)" }}>Curated Rarities</p>
          <h1 className="display mb-8" style={{ fontSize: "clamp(3rem,7vw,6rem)", color: "var(--ivory)" }}>The Stone Vault</h1>
          <span className="rule-champagne mx-auto block mb-6" style={{ opacity: 0.5 }} />
          <p className="text-sm leading-loose max-w-lg mx-auto" style={{ color: "rgba(247,242,232,0.5)", fontWeight: 300 }}>
            A private selection of rare gemstones with verified provenance, certification, and rarity. Offered by private viewing or appointment only.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ivory-deep)" }}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stones.map((s: typeof SAMPLE_STONES[0]) => {
              const st = STATUS[s.status] || STATUS.available;
              return (
                <div key={s.id} className="group overflow-hidden" style={{ background: "var(--ivory)", border: "1px solid var(--stone)", transition: "box-shadow 0.4s" }}>
                  <div className="h-56 relative flex items-center justify-center overflow-hidden" style={{ background: s.colour }}>
                    <div className="w-20 h-20 rotate-45 transition-all duration-700 group-hover:rotate-[120deg] group-hover:scale-110"
                      style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)" }}>
                      <div className="absolute inset-2" style={{ border:"1px solid rgba(255,255,255,0.08)" }} />
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1" style={{ background:"rgba(26,26,22,0.75)", backdropFilter:"blur(8px)" }}>
                      <span className="text-xs" style={{ color: s.status==="available"?"#7EC87E":s.status==="sold"?"#C87E7E":"#C8B47E", fontFamily:"Jost", fontWeight:300, letterSpacing:"0.1em" }}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="display text-xl mb-1" style={{ color:"var(--emerald)" }}>{s.stone_name}</h3>
                    <p className="text-xs mb-1" style={{ color:"var(--champagne)", fontWeight:300 }}>{s.origin}</p>
                    <p className="text-xs mb-4" style={{ color:"var(--warm-grey)", fontWeight:300 }}>{s.carat} ct · Price on Request</p>
                    {s.status !== "sold" ? (
                      <Link href="/appointment" className="btn-outline-emerald w-full text-center block py-2.5" style={{ fontSize:"0.58rem" }}>
                        {s.status === "available" ? "Request Viewing" : "Reserve Interest"}
                      </Link>
                    ) : (
                      <div className="py-2.5 text-center eyebrow" style={{ background:"var(--stone)", color:"var(--warm-grey)", fontSize:"0.55rem" }}>Sold</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
