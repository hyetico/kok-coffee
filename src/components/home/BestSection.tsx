"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollTabs } from "@/components/ui/ScrollTabs";
import type { Product } from "@/types";

type BestSectionProps = {
  tabsLabel: string;
  /** 탭마다 보여 줄 상품 (페이지에서 id → 상품으로 바꿔 넘긴다) */
  tabs: { label: string; products: Product[] }[];
};

/**
 * 「지금 많이 담는 원두」 맛 노트 탭 + 카드 4개.
 * @example <BestSection tabsLabel="맛 노트로 고르기" tabs={tabs} />
 */
export function BestSection({ tabsLabel, tabs }: BestSectionProps) {
  const [index, setIndex] = useState(0);
  return (
    <>
      <ScrollTabs
        label={tabsLabel}
        items={tabs.map((t) => t.label)}
        value={index}
        onChange={setIndex}
        className="mt-5"
      />
      <ProductGrid products={tabs[index]?.products ?? []} />
    </>
  );
}

/** 메인 상품 줄: 웹 4열 · 태블릿 · 모바일 2열 */
export function ProductGrid({
  products,
  badge,
}: {
  products: Product[];
  badge?: string;
}) {
  return (
    <ul className="mt-7 grid list-none grid-cols-2 gap-x-3 gap-y-8 p-0 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} badge={badge} />
        </li>
      ))}
    </ul>
  );
}
