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
  /** 섹션 오른쪽 「전체 보기 >」 */
  more: "전체 보기",

  /** 모든 페이지 첫 초점 (CLAUDE.md 7장) */
  skipToContent: "본문으로 건너뛰기",

  header: {
    homeLabel: "콕커피 홈",
    navLabel: "카테고리",
    openSearch: "원두 검색 열기",
    openMenu: "메뉴 열기",
    /** 담긴 상품 줄 수를 넣어 읽는다 */
    /** 읽는 이름을 보이는 숫자 앞뒤로 나눈다 — 숫자가 이름 안에 그대로 들어가게 (WCAG 2.5.3) */
    cartLabelBefore: "장바구니, 담긴 상품 ",
    cartLabelAfter: "개",
  },

  roasteryMenu: {
    label: "로스터리",
    title: "함께하는 로스터리",
    count: (n: number) => `${n}곳`,
    viewAll: "로스터리 전체 보기",
  },

  search: {
    label: "원두 검색",
    placeholder: "원두, 로스터리, 맛 노트 검색",
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
    type: "종류",
    all: "전체",
    caffeine: "카페인",
    decafOnly: "디카페인만",
    reset: "초기화",
    resetLabel: "필터 모두 초기화",
    price: "가격",
    priceBands: {
      u10: "1만 원 미만",
      "10": "1만 ~ 1만 5천 원",
      "15": "1만 5천 ~ 2만 원",
      o20: "2만 원 이상",
    } satisfies Record<PriceBandId, string>,
    /** 맛 버튼 — 지도 축과 같은 산미 · 바디 세 칸 */
    tasteRange: "맛 (지도와 같아요)",
    acidity: {
      name: "산미",
      bands: { lo: "낮음", mid: "중간", hi: "높음" },
      ends: ["고소한", "화사한"],
    },
    body: {
      name: "바디",
      bands: { lt: "가벼움", mid: "중간", hv: "묵직" },
      /** 맛 위치 글에서는 「묵직함」 */
      describe: { lt: "가벼움", mid: "중간", hv: "묵직함" },
      ends: ["가벼운", "묵직한"],
    },
    rangeText: (name: string, text: string) => `${name} ${text}`,
    /** 맛 버튼 묶음 읽는 이름 — 「산미 (고소한에서 화사한 쪽), 하나만 고를 수 있어요」 */
    tasteGroupLabel: (name: string, from: string, to: string) =>
      `${name} (${from}에서 ${to} 쪽), 하나만 고를 수 있어요`,
    /** 「산미 높음 · 바디 가벼움」 */
    describe: (ac: string, bd: string) => `산미 ${ac} · 바디 ${bd}`,
    aroma: "향",
    more: (n: number) => `더 보기 (${n})`,
    less: "접기",
    myTaste: {
      title: "내 취향",
      retry: "다시 하기",
      filterOn: "내 취향으로 거르기",
      filterOff: "전체 보기",
    },
    filter: "필터",
    filterCount: (n: number) => `적용한 필터 ${n}개`,
    closeFilter: "필터 닫기",
    searchLabel: "이 목록에서 원두 검색",
    searchPlaceholder: "원두, 로스터리, 맛 노트 검색",
    /** 「총 n개」에서 숫자만 진하게 보이도록 앞뒤 글을 나눠 둔다 */
    totalPrefix: "총",
    totalSuffix: "개",
    countOnly: (count: number) => `${count}개`,
    clearAll: "전체 해제",
    removeCondition: (label: string) => `${label} 조건 지우기`,
    searchCondition: (q: string) => `검색: ${q}`,
    viewLabel: "보기 방식",
    views: { map: "지도 + 목록", list: "목록만" },
    listTitle: "원두",
    sortLabel: "정렬 기준",
    sortCurrent: (label: string) => `정렬 기준: ${label}`,
    sorts: {
      rec: "추천순",
      near: "내 취향과 가까운 순",
      low: "낮은 가격순",
      high: "높은 가격순",
    } satisfies Record<SortKey, string>,
    /** 지도에서 점을 고르면 정렬 이름이 이것으로 바뀐다 */
    sortPick: "고른 원두와 가까운 순",
    pick: {
      group: (n: number) => `같은 자리 원두 ${n}개`,
      /** 받침에 따라 「와 / 과」 */
      chip: (name: string, josa: string) => `${name}${josa} 맛이 가까운 순`,
      clear: "지도에서 고른 원두 해제",
      live: (label: string) => `${label}으로 바꿨어요`,
      picked: "고른 원두",
      similar: "맛이 비슷해요",
    },
    gridLabel: "맛 지도와 상품 목록",
    loadingLabel: "상품을 불러오는 중",
    emptyTitle: "조건에 맞는 원두가 없어요",
    emptyDesc: "검색어나 맛과 향 조건을 하나씩 빼 보세요.",
    emptyReset: "조건 모두 지우기",
    sheetDone: (count: number) => `원두 ${count}개 보기`,
  },

  /** 목록을 불러오지 못했을 때 (보드 States 「잘못됐을 때」) */
  listError: {
    title: "원두 목록을 불러오지 못했어요",
    desc: "인터넷 연결을 확인하고 다시 시도해 주세요.",
    retry: "다시 시도",
  },

  notFound: {
    code: "404",
    title: "페이지를 찾을 수 없어요",
    desc: "주소가 바뀌었거나 사라진 페이지예요. 아래에서 원하는 곳으로 이동해 주세요. 공지사항, 약관 같은 페이지는 포트폴리오 범위에서 빠져 있어요.",
    home: "홈으로",
    list: "모든커피 보기",
  },

  mapGroup: {
    aria: (n: number, titles: string[]) =>
      `같은 자리 원두 ${n}개: ${titles.join(", ")}`,
  },

  tasteMap: {
    axes: {
      heavy: "묵직한",
      light: "가벼운",
      nutty: "고소한",
      bright: "화사한",
    },
    label:
      "맛 지도: 왼쪽은 고소한, 오른쪽은 화사한(산미 높음), 위는 묵직한, 아래는 가벼운 맛. 방향키로 점 사이를 옮겨요",
    roledescription: "맛 지도",
    /** 왼쪽 위 · 오른쪽 위 · 왼쪽 아래 · 오른쪽 아래 */
    corners: [
      "초콜릿 · 견과 쪽",
      "와인 · 베리 쪽",
      "곡물 · 캐러멜 쪽",
      "꽃 · 시트러스 쪽",
    ],
    tip: "점을 누르면 맛이 가까운 원두부터 보여 드려요",
    goList: "목록에서 보기",
    pin: "내 취향",
    legend: {
      pin: "내 취향",
      dot: "원두",
      dim: "필터 밖 원두",
      group: "같은 자리 원두 묶음",
    },
    testHint: {
      question: "내 취향은 어디쯤일까?",
      link: "30초 테스트",
      close: "테스트 안내 닫기",
    },
  },
} as const;
