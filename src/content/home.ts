// 메인 화면 글 · 큐레이션. 프로토타입(design/prototype/) 글을 그대로 옮겼다 (CLAUDE.md 2장 예외 — 확정 글)
// 상품은 id로만 가리키고, 이름 · 가격은 src/data/products.json에서 가져온다

export const home = {
  hero: {
    /** 숫자는 데이터에서 센다 (로스터리 수 · 목록 원두 수) */
    eyebrow: (roasteries: number, beans: number) =>
      `로스터리 ${roasteries}곳, 원두 ${beans}종`,
    titleLines: ["맛으로 고르는", "스페셜티 커피"],
    desc: "고소한 쪽인지 화사한 쪽인지, 묵직한지 가벼운지. 맛 지도에서 끌리는 자리를 눌러 원두를 찾아보세요.",
    primary: { label: "30초 취향 테스트", href: "/taste-test" },
    secondary: { label: "모든 원두 보기", href: "/coffee" },
  },

  tasteMap: {
    title: "맛 지도",
    filterLabel: "원두 종류",
    filters: [
      { key: "all", label: "전체" },
      { key: "blend", label: "블렌드" },
      { key: "single", label: "싱글오리진" },
      { key: "decaf", label: "디카페인" },
    ],
    /** 처음 고른 원두 */
    defaultProductId: "p7",
  },

  best: {
    title: "지금 많이 담는 원두",
    moreHref: "/coffee",
    tabsLabel: "맛 노트로 고르기",
    tabs: [
      { label: "이번 주 인기", productIds: ["p1", "p2", "p3", "p4"] },
      { label: "달콤 & 쌉쌀", productIds: ["p5", "p10", "p12", "p13"] },
      { label: "고소 & 묵직한", productIds: ["p14", "p15", "p16", "p17"] },
      { label: "화사한 & 풍부한", productIds: ["p18", "p6", "p7", "p8"] },
      { label: "밸런스 & 부드러운", productIds: ["p19", "p20", "p4", "p21"] },
      { label: "은은 & 꽃향기", productIds: ["p9", "p6", "p11", "p8"] },
    ],
  },

  newArrivals: {
    title: "새로 들어온 원두",
    moreHref: "/coffee",
    badge: "NEW",
    productIds: ["p18", "p6", "p7", "p8"],
  },

  roasteries: {
    title: "함께하는 로스터리",
    moreHref: "/roasteries",
  },

  brand: {
    title: "Good Coffee Collector",
    desc: "코케는 좋은 커피를 수집하는 Good Coffee Collector입니다. 당신의 기록이 차곡차곡 쌓여 취향이 되는 즐거움을 함께하며, 커피로 당신의 일상에 특별함이 더해지는 순간을 기대합니다.",
    /** TODO: 배너 원본 이미지가 오면 바꾼다 (CONTENT_TODO 「메인 · 브랜드 배너 이미지 원본」) — 지금은 프로토타입 이미지 */
    image: "/images/banners/home-brand.webp",
  },
} as const;
