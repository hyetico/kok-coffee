import type { Metadata } from "next";
import { RoasteryGrid } from "@/components/roastery/RoasteryGrid";
import { navItems } from "@/content/ui";
import { getRoasteries } from "@/lib/catalog";

export const metadata: Metadata = {
  title: navItems.find((n) => n.key === "roasteries")?.label,
};

export default function RoasteriesPage() {
  return (
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <RoasteryGrid roasteries={getRoasteries()} />
      </div>
    </main>
  );
}
