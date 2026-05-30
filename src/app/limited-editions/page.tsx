import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const SAMPLE = [
  {
    id: "1",
    collection_name: "The Blue Legacy Collection",
    description: "A curated selection of deep-ocean blue sapphires and teal spinels, each with GIA or AGL certification. Limited to 12 pieces worldwide.",
    quantity_total: 12,
    quantity_available: 7,
    price_range: "SGD 8,000 – 45,000",
    status: "published",
    image_url: null,
  },
  {
    id: "2",
    collection_name: "Emerald Heritage",
    description: "Colombian and Zambian emeralds of exceptional clarity, set in 18k gold with hand-engraved filigree. Heirloom-grade pieces for generational keeping.",
    quantity_total: 8,
    quantity_available: 3,
    price_range: "SGD 15,000 – 80,000",
    status: "published",
    image_url: null,
  },
];

async function getCollections() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return SAMPLE;
    const { createAdminClient } = await import("@/lib/supabase");
    const supabase = createAdminClient();
    const { data } = await supabase.from("collections").select("*").eq("status", "published").order("launch_date", { ascending: false });
    return data && data.length > 0 ? data : SAMPLE;
  } catch {
    return SAMPLE;
  }
}

export default async function LimitedEditionsPage() {
  const collections = await getCollections();

  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 text-center"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.9)" }}>Exclusive Releases</p>
          <h1 className="heading-display mb-6" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "var(--ivory)" }}>
            Limited Editions
          </h1>
          <div className="divider-champagne mx-auto mb-6" />
          <p style={{ color: "rgba(248,243,234,0.65)" }} className="text-sm">
            Private-access collections released exclusively to VIP members.
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="space-y-8">
            {collections.map((col, i) => (
              <div key={col.id} className="grid grid-cols-1 lg:grid-cols-5 overflow-hidden"
                style={{ border: "1px solid var(--stone)" }}>
                <div className={`lg:col-span-2 h-64 lg:h-auto flex items-center justify-center ${i % 2 === 1 ? "lg:order-last" : ""}`}
                  style={{ background: i === 0 ? "var(--emerald)" : "#2a1a0a" }}>
                  {col.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={col.image_url} alt={col.collection_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-20 h-20 rotate-45 mx-auto mb-4"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(184,138,114,0.4)" }} />
                      <p className="label-luxury" style={{ color: "rgba(184,138,114,0.7)" }}>Preview by Appointment</p>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-3 p-10 flex flex-col justify-center" style={{ background: "var(--ivory)" }}>
                  <p className="label-luxury mb-4">{col.status === "published" ? "Now Available" : "Coming Soon"}</p>
                  <h2 className="heading-display text-3xl md:text-4xl mb-4" style={{ color: "var(--charcoal)" }}>
                    {col.collection_name}
                  </h2>
                  <div className="divider-champagne mb-6" />
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(21,21,21,0.6)" }}>{col.description}</p>
                  <div className="flex flex-wrap gap-6 mb-8">
                    <div>
                      <p className="label-luxury" style={{ fontSize: "0.55rem" }}>Pieces Available</p>
                      <p className="heading-display text-2xl mt-1" style={{ color: "var(--emerald)" }}>
                        {col.quantity_available} / {col.quantity_total}
                      </p>
                    </div>
                    {col.price_range && (
                      <div>
                        <p className="label-luxury" style={{ fontSize: "0.55rem" }}>Price Range</p>
                        <p className="text-sm mt-1 font-medium" style={{ color: "var(--charcoal)" }}>{col.price_range}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/vip-preorder" className="btn-primary">Reserve Deposit</Link>
                    <Link href="/appointment" className="btn-outline-dark">Request Private Viewing</Link>
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
