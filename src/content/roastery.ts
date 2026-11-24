// 로스터리 목록 · 브랜드 화면 글. 프로토타입(design/prototype/) 글을 그대로 옮겼다 (CLAUDE.md 2장 예외 — CONTENT_TODO [x] 「로스터리 소개 글」)
// 커넥츠커피의 매장 사진 · 수상 경력 · 위치는 원본 kokewep 자료 (02 PRD 4장 「상품·로스터리별 페이지」)

export const roasteryContent = {
  list: {
    title: "로스터리",
    count: (n: number) => `${n}곳`,
    desc: "코케에서 원두를 만날 수 있는 로스터리예요.",
    searchLabel: "로스터리 이름으로 찾기",
    emptyTitle: "찾는 로스터리가 없어요",
    emptyDesc: "이름을 다시 확인하거나 검색어를 지워 보세요.",
  },

  brand: {
    breadcrumbLabel: "현재 위치",
    photoAlt: (name: string) => `${name} 매장 내부`,
    logoTag: "로스터리 대표 로고",
    beanCount: (n: number) => `원두 ${n}개`,
    awardsTitle: "수상 경력",
    summaryTitle: "한눈에 보기",
    place: "위치",
    instagram: "인스타그램",
    /** 자료가 없는 로스터리 — 실제처럼 보이는 주소 · 계정은 지어내지 않는다 */
    placeFallback: "로스터리 공식 채널에서 안내해요",
    instagramFallback: "로스터리 공식 계정",
    productsTitle: (name: string) => `${name}의 원두`,
    emptyTitle: "이 로스터리의 원두가 곧 들어와요",
    emptyDesc: "그동안 비슷한 맛의 다른 로스터리 원두를 둘러보세요.",
    emptyButton: "모든커피 보기",
    intro: (name: string, count: number, top: string[]) =>
      `${name}은(는) 코케에서 원두 ${count}종을 소개하는 로스터리예요. ${top.join(", ")} 맛이 두드러지는 원두가 많아요.`,
    introEmpty: (name: string) =>
      `${name}은(는) 코케 큐레이터와 다음 시즌 원두를 함께 고르고 있는 로스터리예요. 첫 원두가 입고되면 맛 지도에 바로 올라와요.`,
    facts: (count: number, top: string[], roast: string) => [
      `코케 판매 원두 ${count}종`,
      `대표 맛: ${top.join(", ")}`,
      roast,
    ],
    factsEmpty: ["다음 시즌 원두 큐레이션 중", "입고 소식은 코케 뉴스레터로"],
    roast: {
      light: "라이트 로스팅 중심",
      dark: "미디엄~다크 로스팅 중심",
      medium: "미디엄 로스팅 중심",
    },
  },

  /** 매장 자료가 있는 로스터리 (id 기준) */
  stores: {
    r01: {
      photo: "/images/roasteries/r01-store.webp",
      awards: [
        "2021 KTBC 챔피언",
        "2021 이카와코리아 로스팅 챔피언십 챔피언",
        "2021 MOC 개인전 2위",
        "2019 KTBC 챔피언",
        "2018 호주 로스팅 대회 동상",
      ],
      place: "서울 마포구 성지길 60",
      instagram: "@connectscoffee",
    },
  } as Record<
    string,
    { photo: string; awards: string[]; place: string; instagram: string }
  >,
} as const;
