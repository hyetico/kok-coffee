/** 원두 종류. 디카페인은 종류가 아니라 속성(Product.decaf)이다 */
export type ProductType = "blend" | "single";

/** 원두 용량. 가격은 200g 기준가에 용량별 추가 금액을 더해 계산한다 (lib/price.ts) */
export type Size = "200g" | "500g" | "1kg";

/** 분쇄 방식. 화면 이름은 content/ui.ts의 grindLabels */
export type Grind =
  | "whole"
  | "coffee-maker"
  | "espresso"
  | "french-press"
  | "hand-drip"
  | "moka-pot";

/** 맛 지도 좌표 (0–100). x: 고소한 → 화사한, y: 묵직한 → 가벼운 */
export type MapPosition = { x: number; y: number };

/** src/data/products.json 한 줄 */
export type Product = {
  id: string;
  title: string;
  /** 「함께하는 로스터리 16곳」에 없는 로스터리는 null (CONTENT_TODO) */
  roasteryId: string | null;
  roastery: string;
  /** 200g 기준가 (원) */
  price: number;
  /** 맛 노트 두 개를 " & "로 이은 원본 글. 나눌 때는 lib/catalog.ts의 splitNotes */
  notes: string;
  type: ProductType;
  decaf: boolean;
  image: string;
  roasteryLogo: string;
  /** 원본 자료 위치 (기록용, 화면에 쓰지 않음) */
  source: string;
  /** null이면 맛 지도에 그리지 않는다 */
  mapPosition: MapPosition | null;
  /** true면 목록 · 지도 · 검색에 나오지 않고 브랜드 페이지에만 보인다 (c2–c4) */
  brandOnly?: boolean;
  _mapNote?: string;
};

/** src/data/roasteries.json 한 줄 */
export type Roastery = {
  id: string;
  name: string;
  logo: string;
  /** 원본 자료 위치 (기록용, 화면에 쓰지 않음) */
  source: string;
};

/** 장바구니 한 줄. 가격은 저장하지 않고 상품 데이터와 옵션으로 계산한다 (02 PRD 「장바구니 데이터 규칙」) */
export type CartItem = {
  productId: string;
  size: Size;
  grind: Grind;
  qty: number;
  checked: boolean;
};

/** 목록 정렬. rec는 데이터 순서 그대로 */
export type SortKey = "rec" | "low" | "high";

/** 목록 가격대 필터 id — URL 쿼리 ?price=u10,10,15,o20 와 같은 값 */
export type PriceBandId = "u10" | "10" | "15" | "o20";

/** 목록 화면 조건. URL 쿼리와 1:1로 대응한다 (lib/filter.ts의 parseListQuery) */
export type ListFilter = {
  /** 모든커피는 "all" */
  type: ProductType | "all";
  decaf: boolean;
  prices: PriceBandId[];
  tastes: string[];
  q: string;
  sort: SortKey;
};
