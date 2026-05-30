import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { createAdminClient } from "@/lib/supabase";
import type { Stone } from "@/types";
import Link from "next/link";

async function getStones(): Promise<Stone[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("stones")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Stone[]) || [];
  } catch {
    return [];
  }
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: "Available", color: "#2a6b3a" },
  reserved: { label: "Reserved", color: "#7d5a0a" },
  sold: { label: "Sold", color: "#7a1a1a" },
  private_viewing_only: { label: "Private Viewing", color: "#003F4F" },
};

const SAMPLE_STONES: Partial<Stone>[] = [
  { id: "1", stone_name: "Blue Sapphire", origin: "Kashmir, India", carat: 5.2, colour: "#1a3a5c", status: "available", price_visibility: "price_on_request" },
  { id: "2", stone_name: "Colombian Emerald", origin: "Muzo, Colombia", carat: 3.8, colour: "#1a4a2e", status: "reserved", price_visibility: "price_on_request" },
  { id: "3", stone_name: "Burmese Ruby", origin: "Mogok, Myanmar", carat: 2.4, colour: "#8b1a2a", status: "available", price_visibility: "price_on_request" },
  { id: "4", stone_name: "Mahenge Spinel", origin: "Tanzania", carat: 4.1, colour: "#9b3060", status: "private_viewing_only", price_visibility: "price_on_request" },
  { id: "5", stone_name: "Tanzanite", origin: "Merelani Hills", carat: 7.6, colour: "#3d2060", status: "available", price_visibility: "price_on_request" },
  { id: "6", stone_name: "Paraíba Tourmaline", origin: "Brazil", carat: 1.9, colour: "#007d8c", status: "sold", price_visibility: "price_on_request" },
];

export default async function StoneVaultPage() {
  const stones = await getStones();
  const displayStones = stones.length > 0 ? stones : SAMPLE_STONES;

  return (
    <main>
      <Navigation />

      <section
        className="pt-40 pb-20 text-center"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.9)" }}>
            Curated Rarities
          </p>
          <h1
            className="heading-display mb-6"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "var(--ivory)" }}
          >
            The Stone Vault
          </h1>
          <div className="divider-champagne mx-auto mb-6" />
          <p style={{ color: "rgba(248,243,234,0.65)" }} className="text-sm leading-relaxed">
            A private selection of rare gemstones with verified provenance, certification, and rarity.
            Each stone is offered by private viewing or appointment only.
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayStones.map((stone) => {
              const status = STATUS_LABELS[stone.status || "available"] || STATUS_LABELS.available;
              return (
                <div
                  key={stone.id}
                  className="group"
                  style={{
                    background: "var(--ivory)",
                    border: "1px solid var(--stone)",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  {/* Stone visual */}
                  <div
                    className="h-56 relative overflow-hidden flex items-center justify-center"
                    style={{ background: (stone as Stone & { colour: string }).colour || "#003F4F" }}
                  >
                    {stone.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={stone.image_url}
                        alt={stone.stone_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-20 h-20 rotate-45 group-hover:rotate-[120deg] transition-transform duration-700"
                        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
                      />
                    )}

                    {/* Status badge */}
                    <div
                      className="absolute top-3 right-3 px-3 py-1"
                      style={{ background: "rgba(21,21,21,0.7)", backdropFilter: "blur(8px)" }}
                    >
                      <span
                        className="text-xs font-medium"
                        style={{ color: status.color === "#2a6b3a" ? "#7eca8e" : "#d4a574" }}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="heading-display text-xl mb-1" style={{ color: "var(--charcoal)" }}>
                      {stone.stone_name}
                    </h3>
                    {stone.origin && (
                      <p className="text-xs mb-1" style={{ color: "var(--champagne)" }}>
                        {stone.origin}
                      </p>
                    )}
                    <div className="flex gap-4 mb-2">
                      {stone.carat && (
                        <p className="text-xs" style={{ color: "rgba(21,21,21,0.55)" }}>
                          {stone.carat} ct
                        </p>
                      )}
                      {(stone as Stone).cut && (
                        <p className="text-xs" style={{ color: "rgba(21,21,21,0.55)" }}>
                          {(stone as Stone).cut}
                        </p>
                      )}
                    </div>
                    {(stone as Stone).treatment && (
                      <p className="text-xs mb-1" style={{ color: "rgba(21,21,21,0.4)" }}>
                        Treatment: {(stone as Stone).treatment}
                      </p>
                    )}
                    {(stone as Stone).certificate_lab && (
                      <p className="text-xs mb-4" style={{ color: "rgba(21,21,21,0.4)" }}>
                        Cert: {(stone as Stone).certificate_lab} #{(stone as Stone).certificate_number}
                      </p>
                    )}

                    <p className="text-sm font-medium mb-4" style={{ color: "var(--emerald)" }}>
                      Price on Request
                    </p>

                    {stone.status !== "sold" ? (
                      <Link
                        href="/appointment"
                        className="btn-outline-dark w-full text-center py-2.5 text-xs block"
                      >
                        {stone.status === "available" ? "Request Viewing" : "Reserve Interest"}
                      </Link>
                    ) : (
                      <div
                        className="py-2.5 text-center text-xs"
                        style={{ background: "var(--stone)", color: "rgba(21,21,21,0.5)" }}
                      >
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
