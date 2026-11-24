import type { ListFilter, PriceBandId, Product, SortKey } from "@/types";

// 목록 정렬 · 필터 기준은 이 파일 한 곳에서만 정한다 (CLAUDE.md 5장). 값은 프로토타입 목록 화면과 같다
// 화면에 보이는 이름(가격대 · 정렬)은 content/ui.ts에 있다

/** 가격대: 아래 끝 포함 · 위 끝 미포함. 여러 개 고르면 그중 하나에 맞으면 보인다 */
export const PRICE_BANDS: Record<PriceBandId, { min: number; max: number }> = {
  u10: { min: 0, max: 10000 },
  "10": { min: 10000, max: 15000 },
  "15": { min: 15000, max: 20000 },
  o20: { min: 20000, max: Infinity },
};
/** 화면 순서. 「10」「15」처럼 숫자 모양 키는 객체에서 앞으로 정렬되므로 Object.keys를 쓰지 않는다 */
export const PRICE_BAND_IDS: PriceBandId[] = ["u10", "10", "15", "o20"];

/** 맛과 향 필터에 보이는 낱말 (화면 순서). 여러 개 고르면 모두 맞아야 보인다 */
export const TASTE_WORDS = [
  "달콤",
  "고소",
  "상큼",
  "쌉쌀",
  "밸런스",
  "깔끔한",
  "부드러운",
  "묵직한",
  "과일",
  "꽃향기",
  "은은한",
  "화사한",
] as const;

export const SORT_KEYS: SortKey[] = ["rec", "low", "high"];

export const DEFAULT_FILTER: ListFilter = {
  type: "all",
  decaf: false,
  prices: [],
  tastes: [],
  q: "",
  sort: "rec",
};

/**
 * 맛 낱말이 상품 맛 노트에 들어 있는지. 「묵직한」으로 골라도 「묵직」이 들어간 노트를 찾도록 끝의 「한」을 뺀다.
 * @example matchesTaste("달콤 & 묵직한", "묵직한") // true
 */
export function matchesTaste(notes: string, word: string): boolean {
  return notes.includes(word.replace(/한$/, ""));
}

/**
 * 조건에 맞는 상품만 남긴다. 정렬은 sortProducts에서 따로 한다.
 * @example filterProducts(listedProducts(), { ...DEFAULT_FILTER, decaf: true })
 */
export function filterProducts<T extends Product>(
  products: T[],
  filter: ListFilter,
): T[] {
  // 영문 상품명(BEIGE 블랜드 등)도 찾히게 대소문자는 가리지 않는다
  const q = filter.q.trim().toLowerCase();
  return products.filter((p) => {
    if (filter.type !== "all" && p.type !== filter.type) return false;
    if (filter.decaf && !p.decaf) return false;
    if (
      filter.prices.length > 0 &&
      !filter.prices.some((id) => {
        const band = PRICE_BANDS[id];
        return p.price >= band.min && p.price < band.max;
      })
    )
      return false;
    if (filter.tastes.some((word) => !matchesTaste(p.notes, word)))
      return false;
    if (q && !`${p.title} ${p.roastery} ${p.notes}`.toLowerCase().includes(q))
      return false;
    return true;
  });
}

/**
 * 정렬. rec(추천순)는 데이터 순서를 그대로 둔다. 원본 배열은 바꾸지 않는다.
 * @example sortProducts(list, "low")
 */
export function sortProducts<T extends Product>(
  products: T[],
  sort: SortKey,
): T[] {
  if (sort === "low") return [...products].sort((a, b) => a.price - b.price);
  if (sort === "high") return [...products].sort((a, b) => b.price - a.price);
  return products;
}

/**
 * 필터 + 정렬을 한 번에. 목록 · 검색 결과 · 맛 지도 보기가 모두 이 함수를 쓴다.
 * @example applyListFilter(listedProducts(), parseListQuery(searchParams))
 */
export function applyListFilter<T extends Product>(
  products: T[],
  filter: ListFilter,
): T[] {
  return sortProducts(filterProducts(products, filter), filter.sort);
}

type QueryValue = string | string[] | undefined;
type QueryInput = Record<string, QueryValue> | URLSearchParams;

function readParam(query: QueryInput, key: string): string | undefined {
  if (query instanceof URLSearchParams) return query.get(key) ?? undefined;
  const v = query[key];
  return Array.isArray(v) ? v[0] : v;
}

function readList(query: QueryInput, key: string): string[] {
  return (readParam(query, key) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * URL 쿼리(?type=single&decaf=1&price=u10,10&taste=고소,묵직한&q=케냐&sort=low)를 조건으로.
 * 모르는 값은 버려서, 손으로 고친 주소도 오류 없이 연다.
 * @example parseListQuery(await props.searchParams)
 */
export function parseListQuery(query: QueryInput): ListFilter {
  const type = readParam(query, "type");
  const sort = readParam(query, "sort");
  const taste = new Set<string>(TASTE_WORDS);
  return {
    type: type === "blend" || type === "single" ? type : "all",
    decaf: readParam(query, "decaf") === "1",
    prices: readList(query, "price").filter((id): id is PriceBandId =>
      PRICE_BAND_IDS.includes(id as PriceBandId),
    ),
    tastes: readList(query, "taste").filter((w) => taste.has(w)),
    q: readParam(query, "q") ?? "",
    sort: SORT_KEYS.includes(sort as SortKey) ? (sort as SortKey) : "rec",
  };
}

/**
 * 조건을 URL 쿼리 글로. 기본값은 넣지 않아 주소를 짧게 유지한다.
 * @example `/coffee${toListQuery(filter)}` // "/coffee?type=single&sort=low"
 */
export function toListQuery(filter: ListFilter): string {
  const params = new URLSearchParams();
  if (filter.type !== "all") params.set("type", filter.type);
  if (filter.decaf) params.set("decaf", "1");
  if (filter.prices.length) params.set("price", filter.prices.join(","));
  if (filter.tastes.length) params.set("taste", filter.tastes.join(","));
  if (filter.q.trim()) params.set("q", filter.q.trim());
  if (filter.sort !== "rec") params.set("sort", filter.sort);
  // 여러 값을 잇는 쉼표는 주소에서 읽기 좋게 그대로 둔다 (04 문서의 ?price=u10,10 모양)
  const s = params.toString().replace(/%2C/g, ",");
  return s ? `?${s}` : "";
}
