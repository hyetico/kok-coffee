import { RoasteryGrid } from "@/components/roastery/RoasteryGrid";
import { getRoasteries } from "@/lib/catalog";

export default function RoasteriesPage() {
  return (
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <RoasteryGrid roasteries={getRoasteries()} />
      </div>
    </main>
  );
}
