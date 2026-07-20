import type { Metadata } from "next";
import PartnershipPage from "./PartnershipPage";

export const metadata: Metadata = {
  title: "Partnership — Lemuré Bleu Private Maison",
  description: "Collaborate with Lemuré Bleu. Venue, dining, exhibition, platform, service, product and network partnerships.",
};

export default function Page() {
  return <PartnershipPage />;
}
