import { roasteryContent } from "@/content/roastery";
import type { Product, Roastery } from "@/types";
import { getAllProducts, getRoasteries, splitNotes } from "./catalog";

const norm = (s: string) => s.replace(/\s/g, "");

/**
 * 로스터리의 원두. roasteryId가 이어진 상품과, 이름이 같은 상품(「리플렉트」 ↔ 「리플렉트 커피 로스터스」처럼 앞부분이 같은 이름 포함).
 * 상품 데이터의 roasteryId가 비어 있는 경우가 많아 이름으로도 찾는다 (CONTENT_TODO). 브랜드 전용 상품도 넣는다.
 * @example roasteryProducts(getRoastery("r10")!)
 */
export function roasteryProducts(r: Roastery): Product[] {
  const b = norm(r.name);
  return getAllProducts().filter((p) => {
    if (p.roasteryId === r.id) return true;
    const a = norm(p.roastery);
    return a === b || b.startsWith(a) || a.startsWith(b);
  });
}

/**
 * 브랜드 화면의 소개 문장 · 「한눈에 보기」. 원두의 맛 노트로 대표 맛 2개와 로스팅 경향을 뽑는다.
 * @example roasterySummary("하늘에커피", products)
 */
export function roasterySummary(name: string, products: Product[]) {
  const b = roasteryContent.brand;
  if (products.length === 0)
    return { intro: b.introEmpty(name), facts: [...b.factsEmpty] };
  const counts = new Map<string, number>();
  for (const p of products)
    for (const w of splitNotes(p.notes))
      counts.set(w, (counts.get(w) ?? 0) + 1);
  // 많이 나온 낱말 순, 같으면 먼저 나온 순 (프로토타입과 같은 정렬)
  const top = [...counts.entries()]
    .sort((x, y) => y[1] - x[1])
    .slice(0, 2)
    .map(([w]) => w);
  const all = products.map((p) => p.notes).join(" ");
  const roast =
    /화사|꽃향기|과일|상큼/.test(all) && !/묵직|쌉쌀/.test(all)
      ? b.roast.light
      : /묵직|쌉쌀/.test(all)
        ? b.roast.dark
        : b.roast.medium;
  return {
    intro: b.intro(name, products.length, top),
    facts: b.facts(products.length, top, roast),
  };
}

/**
 * 상품이 속한 로스터리(소개 페이지가 있는 16곳 중). 없으면 undefined — 상세에서 이름을 링크 없이 보여 준다.
 * @example roasteryOf(getProduct("p20")!)?.id // "r10"
 */
export function roasteryOf(p: Product): Roastery | undefined {
  return getRoasteries().find((r) =>
    roasteryProducts(r).some((x) => x.id === p.id),
  );
}
