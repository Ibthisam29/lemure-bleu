import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string }> = {
  available: { label: "Available" },
  reserved: { label: "Reserved" },
  sold: { label: "Sold" },
  private_viewing_only: { label: "Private Viewing" },
};

const SAMPLE_STONES = [
  { id: "1", stone_name: "Blue Sapphire", origin: "Kashmir, India", carat: 5.2, colour: "#1a3a5c", status: "available" },
  { id: "2", stone_name: "Colombian Emerald", origin: "Muzo, Colombia", carat: 3.8, colour: "#1a4a2e", status: "reserved" },
  { id: "3", stone_name: "Burmese Ruby", origin: "Mogok, Myanmar", carat: 2.4, colour: "#8b1a2a", status: "available" },
  { id: "4", stone_name: "Mahenge Spinel", origin: "Tanzania", carat: 4.1, colour: "#9b3060", status: "private_viewing_only" },
  { id: "5", stone_name: "Tanzanite", origin: "Merelani Hills", carat: 7.6, colour: "#3d2060", status: "available" },
  { id: "6", stone_name: "Paraíba Tourmaline", origin: "Brazil", carat: 1.9, colour: "#007d8c", status: "sold" },
];

async function getStones() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return SAMPLE_STONES;
    const { createAdminClient } = await import("@/lib/supabase");
    const supabase = createAdminClient();
    const { data } = await supabase.from("stones").select("*").order("created_at", { ascending: false });
    return data && data.length > 0 ? data : SAMPLE_STONES;
  } catch {
    return SAMPLE_STONES;
  }
}

export default async function StoneVaultPage() {
  const stones = await getStones();

  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 text-center"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.9)" }}>Curated Rarities</p>
          <h1 className="heading-display mb-6" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "var(--ivory)" }}>
            The Stone Vault
          </h1>
          <div className="divider-champagne mx-auto mb-6" />
          <p style={{ color: "rgba(248,243,234,0.65)" }} className="text-sm leading-relaxed">
            A private selection of rare gemstones with verified provenance, certification, and rarity.
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stones.map((stone) => {
              const status = STATUS_LABELS[stone.status] || STATUS_LABELS.available;
              return (
                <div key={stone.id} className="group"
                  style={{ background: "var(--ivory)", border: "1px solid var(--stone)", transition: "box-shadow 0.3s ease" }}>
                  <div className="h-56 relative overflow-hidden flex items-center justify-center"
                    style={{ background: (stone as { colour?: string }).colour || "#003F4F" }}>
                    {(stone as { image_url?: string }).image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={(stone as { image_url: string }).image_url} alt={stone.stone_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rotate-45 group-hover:rotate-[120deg] transition-transform duration-700"
                        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }} />
                    )}
                    <div className="absolute top-3 right-3 px-3 py-1"
                      style={{ background: "rgba(21,21,21,0.7)", backdropFilter: "blur(8px)" }}>
                      <span className="text-xs" style={{ color: stone.status === "available" ? "#7eca8e" : "#d4a574" }}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="heading-display text-xl mb-1" style={{ color: "var(--charcoal)" }}>{stone.stone_name}</h3>
                    {stone.origin && <p className="text-xs mb-1" style={{ color: "var(--champagne)" }}>{stone.origin}</p>}
                    {stone.carat && <p className="text-xs mb-4" style={{ color: "rgba(21,21,21,0.5)" }}>{stone.carat} ct</p>}
                    <p className="text-sm font-medium mb-4" style={{ color: "var(--emerald)" }}>Price on Request</p>
                    {stone.status !== "sold" ? (
                      <Link href="/appointment" className="btn-outline-dark w-full text-center py-2.5 text-xs block">
                        {stone.status === "available" ? "Request Viewing" : "Reserve Interest"}
                      </Link>
                    ) : (
                      <div className="py-2.5 text-center text-xs" style={{ background: "var(--stone)", color: "rgba(21,21,21,0.5)" }}>
                        Sold
                      </div>
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
