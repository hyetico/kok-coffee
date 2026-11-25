import type {
  AcidityBand,
  BodyBand,
  ListFilter,
  MapPosition,
  PriceBandId,
  Product,
  SortKey,
} from "@/types";
import {
  ACIDITY_BANDS,
  acidityBand,
  BODY_BANDS,
  bodyBand,
  dist,
  toPos,
} from "./taste";

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

/** 향 필터에 보이는 낱말 (화면 순서). 앞 6개만 먼저 보이고 나머지는 「더 보기」. 여러 개 고르면 모두 맞아야 보인다 */
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

/** 향 필터에서 처음부터 보이는 낱말 수 */
export const TASTE_WORDS_SHOWN = 6;

/** 메뉴 순서. near는 「내 취향」 핀이 있을 때만 메뉴에 나온다 */
export const SORT_KEYS: SortKey[] = ["rec", "near", "low", "high"];

export const DEFAULT_FILTER: ListFilter = {
  type: "all",
  decaf: false,
  prices: [],
  tastes: [],
  ac: [],
  bd: [],
  q: "",
  sort: null,
};

/**
 * 주소에 정렬이 없을 때 쓰는 값 — 테스트 후에는 「내 취향과 가까운 순」 (06 기술서 5장).
 * @example effectiveSort(filter.sort, pin) // "near"
 */
export function effectiveSort(
  sort: SortKey | null,
  pin: MapPosition | null,
): SortKey {
  if (sort === "near" && !pin) return "rec";
  return sort ?? (pin ? "near" : "rec");
}

/**
 * 지도 필터(산미 · 바디)를 뺀 조건에 맞는지 — 지도에서 흐리게 할 점을 고를 때도 쓴다.
 * 맛 점수가 없는 원두는 산미 · 바디를 고르면 빠진다.
 */
function passesBands(p: Product, ac: AcidityBand[], bd: BodyBand[]): boolean {
  if (!ac.length && !bd.length) return true;
  if (!p.taste) return false;
  const pos = toPos(p.taste);
  if (ac.length && !ac.includes(acidityBand(pos))) return false;
  if (bd.length && !bd.includes(bodyBand(pos))) return false;
  return true;
}

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
    if (!passesBands(p, filter.ac, filter.bd)) return false;
    if (q && !`${p.title} ${p.roastery} ${p.notes}`.toLowerCase().includes(q))
      return false;
    return true;
  });
}

/**
 * 정렬. rec(추천순)는 데이터 순서를 그대로 둔다. near는 핀과 가까운 순(거리가 같으면 원래 순서, 맛 점수 없는 원두는 맨 뒤). 원본 배열은 바꾸지 않는다.
 * @example sortProducts(list, "near", pin)
 */
export function sortProducts<T extends Product>(
  products: T[],
  sort: SortKey,
  pin: MapPosition | null = null,
): T[] {
  if (sort === "low") return [...products].sort((a, b) => a.price - b.price);
  if (sort === "high") return [...products].sort((a, b) => b.price - a.price);
  if (sort === "near" && pin) {
    const d = (p: Product) =>
      p.taste ? dist(toPos(p.taste), pin) : Number.POSITIVE_INFINITY;
    return [...products].sort((a, b) => d(a) - d(b));
  }
  return products;
}

/**
 * 필터 + 정렬을 한 번에. 목록 · 검색 결과가 모두 이 함수를 쓴다.
 * @example applyListFilter(listedProducts(), parseListQuery(searchParams), pin)
 */
export function applyListFilter<T extends Product>(
  products: T[],
  filter: ListFilter,
  pin: MapPosition | null = null,
): T[] {
  return sortProducts(
    filterProducts(products, filter),
    effectiveSort(filter.sort, pin),
    pin,
  );
}

/**
 * 슬라이더 범위 쿼리(「mid-hi」 · 「lt」)를 구간 목록으로. 세 칸 전부면 「전체」라 빈 목록.
 * @example readRange("mid-hi", ACIDITY_BANDS) // ["mid", "hi"]
 */
function readRange<B extends string>(v: string | undefined, order: B[]): B[] {
  if (!v) return [];
  const [a, b = a] = v.split("-");
  const i = order.indexOf(a as B);
  const j = order.indexOf(b as B);
  if (i < 0 || j < 0) return [];
  const r = order.slice(Math.min(i, j), Math.max(i, j) + 1);
  return r.length === order.length ? [] : r;
}

/**
 * 구간 목록을 슬라이더 범위 쿼리로. 이웃한 칸만 고를 수 있어 처음과 끝만 적는다.
 * @example rangeQuery(["mid", "hi"]) // "mid-hi"
 */
function rangeQuery(r: string[]): string {
  return r.length > 1 ? `${r[0]}-${r[r.length - 1]}` : (r[0] ?? "");
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
 * URL 쿼리(?type=single&ac=mid-hi&bd=lt&decaf=1&price=u10,10&taste=고소,묵직한&q=케냐&sort=low)를 조건으로.
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
    ac: readRange(readParam(query, "ac"), ACIDITY_BANDS),
    bd: readRange(readParam(query, "bd"), BODY_BANDS),
    q: readParam(query, "q") ?? "",
    sort: SORT_KEYS.includes(sort as SortKey) ? (sort as SortKey) : null,
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
  if (filter.ac.length) params.set("ac", rangeQuery(filter.ac));
  if (filter.bd.length) params.set("bd", rangeQuery(filter.bd));
  if (filter.tastes.length) params.set("taste", filter.tastes.join(","));
  if (filter.q.trim()) params.set("q", filter.q.trim());
  if (filter.sort) params.set("sort", filter.sort);
  // 여러 값을 잇는 쉼표는 주소에서 읽기 좋게 그대로 둔다 (04 문서의 ?price=u10,10 모양)
  const s = params.toString().replace(/%2C/g, ",");
  return s ? `?${s}` : "";
}
