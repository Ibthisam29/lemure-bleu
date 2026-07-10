import type { Metadata } from "next";
import WaitlistForm from "./WaitlistForm";

export const metadata: Metadata = {
  title: "Private Maison Guest Waitlist — Lemuré Bleu",
  description: "Join the private waitlist for Lemuré Bleu maison events, previews and exclusive access.",
};

export default function WaitlistPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#EDE6D6" }}>
      <div style={{ background: "#1C3D35", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <p style={{ fontFamily: "Jost,sans-serif", fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#C4965A", marginBottom: "1rem" }}>
          Lemuré Bleu · Private Maison
        </p>
        <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, color: "#F7F2E8", lineHeight: 1.15, marginBottom: "1.25rem" }}>
          Private Maison Guest Waitlist
        </h1>
        <p style={{ fontFamily: "Jost,sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "rgba(247,242,232,0.6)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.8 }}>
          Join our exclusive guest list for private previews, maison events, and curated access to rare collections.
        </p>
      </div>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <WaitlistForm />
      </div>
    </main>
  );
}
