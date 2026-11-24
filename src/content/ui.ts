import type { Grind, PriceBandId, Size, SortKey } from "@/types";

// 화면 고정 글 (메뉴 · 버튼 · 안내 문구 · aria-label). 한국어만 (CLAUDE.md 5장)
// 글은 프로토타입(design/prototype/)에서 확정된 것을 옮겼다. 페이지 전용 글은 그 페이지를 만들 때 이어서 적는다

/** 상단 메뉴 · 메뉴 드로어. 싱글오리진 · 블렌드는 목록 쿼리로 연결한다 (04 문서 4장) */
export const navItems = [
  { key: "home", label: "홈", href: "/" },
  { key: "coffee", label: "모든커피", href: "/coffee" },
  { key: "single", label: "싱글오리진", href: "/coffee?type=single" },
  { key: "blend", label: "블렌드", href: "/coffee?type=blend" },
  { key: "roasteries", label: "로스터리", href: "/roasteries" },
  { key: "taste-test", label: "취향테스트", href: "/taste-test" },
] as const;

export type NavKey = (typeof navItems)[number]["key"];

export const ui = {
  /** 모든 페이지 첫 초점 (CLAUDE.md 7장) */
  skipToContent: "본문으로 건너뛰기",

  header: {
    homeLabel: "코케 홈",
    navLabel: "카테고리",
    openSearch: "원두 검색 열기",
    openMenu: "메뉴 열기",
    /** 담긴 상품 줄 수를 넣어 읽는다 */
    cartLabel: (count: number) => `장바구니, 담긴 상품 ${count}개`,
  },

  roasteryMenu: {
    title: "함께하는 로스터리",
    viewAll: "로스터리 전체 보기",
  },

  search: {
    label: "원두 검색",
    placeholder: "원두, 로스터리, 맛 노트를 검색해 보세요",
    close: "검색 닫기",
    clear: "검색어 지우기",
    goToResults: "검색 결과로 이동",
    recent: "최근 검색어",
    clearRecent: "전체 삭제",
    removeRecent: (keyword: string) => `${keyword} 최근 검색어 지우기`,
    suggested: "추천 검색어",
    suggestedKeywords: [
      "고소한",
      "산미",
      "디카페인",
      "에티오피아",
      "블렌드",
      "초콜릿",
    ],
    popular: "많이 찾는 원두",
    /** 검색 레이어 「많이 찾는 원두」에 보이는 상품 id */
    popularProductIds: ["p1", "p13", "p7", "p17"],
    preview: "미리 보기",
    viewAll: (count: number) => `검색 결과 ${count}개 모두 보기`,
    noHitsTitle: "맞는 원두가 없어요",
    noHitsDesc: "맛 노트(예: 고소, 산미)나 로스터리 이름으로 찾아 보세요.",
  },

  mobileMenu: {
    label: "메뉴",
    close: "메뉴 닫기",
    cart: (count: number) => `장바구니 · ${count}개`,
    tasteTest: "30초 취향 테스트",
  },

  footer: {
    supportLabel: "고객 지원",
  },

  product: {
    typeLabels: { blend: "블렌드", single: "싱글오리진" },
    decaf: "디카페인",
    add: "담기",
    /** 카드 · 맛 지도의 담기는 200g · 홀빈으로 담는다 */
    addLabel: (title: string) => `${title} 장바구니에 담기 (200g, 홀빈)`,
    detail: "자세히 보기",
    buyNow: "바로 구매",
  },

  options: {
    sizeLabels: {
      "200g": "200g",
      "500g": "500g",
      "1kg": "1kg",
    } satisfies Record<Size, string>,
    grindLabels: {
      whole: "홀빈(분쇄 안 함)",
      "coffee-maker": "커피메이커",
      espresso: "에스프레소 머신",
      "french-press": "프렌치 프레스",
      "hand-drip": "핸드 드립",
      "moka-pot": "모카포트",
    } satisfies Record<Grind, string>,
  },

  toast: {
    added: (title: string) => `${title}, 장바구니에 담았어요`,
    viewCart: "장바구니 보기",
    undo: "되돌리기",
  },

  list: {
    typeTabsLabel: "원두 종류",
    all: "전체",
    caffeine: "카페인",
    reset: "초기화",
    resetLabel: "필터 모두 초기화",
    price: "가격",
    priceGroupLabel: "가격대 고르기, 여러 개 선택 가능",
    priceBands: {
      u10: "1만 원 미만",
      "10": "1만 ~ 1만 5천 원",
      "15": "1만 5천 ~ 2만 원",
      o20: "2만 원 이상",
    } satisfies Record<PriceBandId, string>,
    taste: "맛과 향",
    tasteGroupLabel: "맛과 향 고르기, 여러 개 선택 가능",
    multiSelectHint: "여러 개 고를 수 있어요.",
    helpTitle: "고르기 어렵다면",
    helpDesc: "질문 5개로 취향에 맞는 원두를 골라 드려요.",
    helpButton: "취향 테스트 하기",
    filter: "필터",
    closeFilter: "필터 닫기",
    searchLabel: "원두 검색",
    searchPlaceholder: "이 목록에서 원두 검색",
    total: (count: number) => `총 ${count}개`,
    /** 타이틀을 지나 스크롤하면 도구 줄에 페이지 이름과 함께 보인다 (02 PRD 3장) */
    pastTitle: (page: string, count: number) => `${page} · ${count}개`,
    countOnly: (count: number) => `${count}개`,
    clearAll: "전체 해제",
    removeCondition: (label: string) => `${label} 조건 지우기`,
    searchCondition: (q: string) => `검색: ${q}`,
    viewLabel: "보기 방식",
    views: { grid: "목록", map: "지도" },
    sortLabel: "정렬 기준",
    sortCurrent: (label: string) => `정렬 기준: ${label}`,
    sorts: {
      rec: "추천순",
      low: "낮은 가격순",
      high: "높은 가격순",
    } satisfies Record<SortKey, string>,
    resultsLabel: "결과",
    gridLabel: "상품 목록",
    loadingLabel: "상품을 불러오는 중",
    emptyTitle: "조건에 맞는 원두가 없어요",
    emptyDesc: "검색어나 맛과 향 조건을 하나씩 빼 보세요.",
    emptyReset: "조건 모두 지우기",
    sheetDone: (count: number) => `상품 ${count}개 보기`,
  },

  tasteMap: {
    axes: {
      heavy: "묵직한",
      light: "가벼운",
      nutty: "고소한",
      bright: "화사한",
    },
    hint: "점을 누르면 원두 정보가 보여요. 맛과 향 필터와 검색이 지도에도 그대로 적용돼요.",
  },
} as const;
