import productsJson from "@/data/products.json";
import roasteriesJson from "@/data/roasteries.json";
import type { Product, Roastery } from "@/types";

// JSON을 타입에 맞춰 한 번만 읽는다. 화면은 이 파일의 함수로만 데이터를 가져간다
const products = productsJson as Product[];
const roasteries = roasteriesJson as Roastery[];

/** 맛 지도에 그릴 수 있는 상품 (위치가 있음) */
export type MappedProduct = Product & {
  mapPosition: NonNullable<Product["mapPosition"]>;
};

/**
 * 모든 상품 (브랜드 페이지 전용 상품 포함). 목록 · 검색에는 listedProducts, 지도에는 mappedProducts를 쓴다.
 * @example getAllProducts().length
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * 원두 목록 · 검색에 나오는 상품. 브랜드 페이지 전용(brandOnly) 상품은 뺀다.
 * @example listedProducts().filter((p) => p.decaf)
 */
export function listedProducts(): Product[] {
  return products.filter((p) => !p.brandOnly);
}

/**
 * 맛 지도에 그릴 상품. 목록 상품 중 위치가 있는 것만. 필터를 건 목록을 넘기면 그 안에서만 고른다.
 * @example mappedProducts(applyListFilter(listedProducts(), filter))
 */
export function mappedProducts(
  list: Product[] = listedProducts(),
): MappedProduct[] {
  return list.filter(
    (p): p is MappedProduct => !p.brandOnly && p.mapPosition !== null,
  );
}

/**
 * id로 상품 하나. 없는 id면 undefined — 상세 페이지에서 notFound()로 이어진다.
 * @example getProduct("p1")?.title
 */
export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * 함께하는 로스터리 16곳.
 * @example getRoasteries().map((r) => r.name)
 */
export function getRoasteries(): Roastery[] {
  return roasteries;
}

/**
 * id로 로스터리 하나.
 * @example getRoastery("r01")?.name
 */
export function getRoastery(id: string): Roastery | undefined {
  return roasteries.find((r) => r.id === id);
}

/**
 * 로스터리에 속한 상품 (브랜드 페이지 전용 상품 포함). 상품이 없으면 빈 배열 — 브랜드 페이지 빈 상태.
 * @example getProductsByRoastery("r01")
 */
export function getProductsByRoastery(roasteryId: string): Product[] {
  return products.filter((p) => p.roasteryId === roasteryId);
}

/**
 * 맛 노트 원본 글("달콤 & 묵직한")을 낱말로 나눈다.
 * @example splitNotes("달콤 & 묵직한") // ["달콤", "묵직한"]
 */
export function splitNotes(notes: string): string[] {
  return notes
    .split("&")
    .map((n) => n.trim())
    .filter(Boolean);
}
