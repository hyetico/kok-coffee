import type { Metadata } from "next";
import { Suspense } from "react";
import { navItems } from "@/content/ui";
import { ListView } from "@/components/list/ListView";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const type = (await searchParams).type;
  const key = type === "single" || type === "blend" ? type : "coffee";
  return { title: navItems.find((n) => n.key === key)?.label };
}

export default function CoffeeListPage() {
  return (
    // 목록은 URL 쿼리(조건)를 읽어 그리므로 쿼리를 읽는 동안의 자리를 둔다
    <Suspense fallback={<main id="main" className="flex-1" />}>
      <ListView />
    </Suspense>
  );
}
