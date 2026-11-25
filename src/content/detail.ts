// 상세 화면 글. 프로토타입(design/prototype/) 글을 그대로 옮겼다 (CLAUDE.md 2장 예외 — CONTENT_TODO [x] 「상품 상세 소개 · 맛 프로필」)
// 원두마다 따로 쓴 글이 아니라 맛 노트로 조립하는 문장 조각이다. 조립 규칙은 lib/coffeeNote.ts

export const detail = {
  breadcrumbLabel: "현재 위치",
  imageAlt: (title: string) => `${title} 원두 봉투`,
  thumbsLabel: "상품 이미지 고르기",
  thumbLabel: (n: number) => `${n}번째 이미지 보기`,
  basePriceNote: "200g 기준",

  facts: {
    roastery: "로스터리",
    type: "종류",
    shipping: "배송비",
    shippingValue: "2,500원 (3만원 이상 무료)",
    decafSuffix: ", 디카페인",
  },

  profile: {
    title: "맛 프로필",
    note: "(콕커피 큐레이터 테이스팅, 5점 만점)",
    roast: "로스팅",
  },

  options: {
    size: "원두 용량",
    grind: "분쇄 선택",
    qtyDec: "수량 줄이기",
    qtyInc: "수량 늘리기",
    qty: "수량",
  },

  actions: {
    addToCart: "장바구니 담기",
    addShort: "장바구니",
    buyNow: "바로 구매",
    added: (summary: string) => `${summary}, 장바구니에 담았어요`,
    /** 고른 옵션 요약 「200g, 홀빈(분쇄 안 함), 1개」 */
    summary: (size: string, grind: string, qty: number) =>
      `${size}, ${grind}, ${qty}개`,
  },

  tabsLabel: "상품 정보",
  tabs: ["상품 정보", "배송 · 교환"],

  note: {
    badge: "콕 노트",
    /** 소개 문장: 「{로스터리}의 {종류}예요. {노트1}하고 {노트2} 맛이 중심이라 {종류별 문장}」 */
    introLead: (roastery: string, typeLabel: string) =>
      `${roastery}의 ${typeLabel}예요. `,
    introJoiner: "하고 ",
    introMid: " 맛이 중심이라 ",
    introBySingle: "핸드 드립으로 향을 살려 마시기 좋아요.",
    introByBlend: "에스프레소와 라테 모두 잘 어울려요.",
    introDecaf: " 카페인을 걱정하지 않고 저녁에도 마실 수 있어요.",
    noteCard: (n: number) => `맛 노트 ${n}`,
    /** 맛 노트 낱말 설명 — 없는 낱말은 설명 없이 둔다 */
    noteDesc: {
      달콤: "캐러멜처럼 단맛이 먼저 느껴져요.",
      쌉쌀: "다크 초콜릿 같은 쌉쌀함이 뒤를 받쳐 줘요.",
      고소: "견과류처럼 고소한 향이 편안해요.",
      묵직한: "입안을 채우는 무게감이 있어요.",
      상큼: "밝은 산미가 입맛을 깨워요.",
      과일: "잘 익은 과일 같은 단맛과 산미가 있어요.",
      화사한: "향이 화사하게 피어올라요.",
      꽃향기: "꽃처럼 은은한 향이 나요.",
      깔끔한: "끝맛이 깔끔하게 떨어져요.",
      부드러운: "자극 없이 부드럽게 넘어가요.",
      밸런스: "단맛, 산미, 쓴맛이 고르게 어울려요.",
      은은한: "튀지 않고 은은하게 이어져요.",
    } as Record<string, string>,
    roastCard: "로스팅",
    roast: {
      light: {
        label: "라이트 (약배전)",
        desc: "향과 산미를 살리는 밝은 로스팅이에요.",
      },
      medium: {
        label: "미디엄 (중배전)",
        desc: "단맛과 균형을 살리는 중간 로스팅이에요.",
      },
      mediumDark: {
        label: "미디엄 다크 (중강배전)",
        desc: "무게감과 단맛을 끌어내는 진한 로스팅이에요.",
      },
    },
    brewTitle: "추천 추출법",
    brewHead: ["도구", "분쇄", "원두", "물", "시간"],
    brewSingle: [
      ["핸드 드립", "중간 굵기", "15g", "250ml, 92°C", "2분 30초"],
      ["프렌치 프레스", "굵게", "18g", "300ml, 94°C", "4분"],
    ],
    brewBlend: [
      ["에스프레소", "아주 곱게", "18g", "추출량 36ml", "25~30초"],
      ["핸드 드립", "중간 굵기", "16g", "250ml, 90°C", "2분 30초"],
      ["모카포트", "곱게", "15g", "150ml", "끓기 시작 후 1분"],
    ],
    infoTitle: "상품 정보",
    info: {
      roastery: "로스터리",
      type: "종류",
      notes: "맛 노트",
      caffeine: "카페인",
      caffeineDecaf: "디카페인",
      caffeineRegular: "일반",
      size: "용량",
      sizeValue: "200g, 500g, 1kg",
      ship: "출고",
      shipValue: "오후 3시까지 결제하면 당일 로스팅 후 출고",
    },
    disclaimer:
      "콕커피 큐레이터가 직접 내려 마셔 보고 정리한 노트예요. 같은 원두도 로스팅 날짜와 추출법에 따라 맛이 조금씩 달라질 수 있어요.",
  },

  shipping: {
    sameDayTitle: "당일 출고 안내",
    sameDayLead:
      "신선한 원두를 위해 오후 3시까지 결제된 주문은 당일 로스팅 후 당일 출고해요.",
    sameDayItems: [
      "토요일, 일요일, 공휴일 주문은 다음 영업일에 로스팅 후 발송해요.",
      "배송은 출고일부터 1~3일 걸릴 수 있어요.",
      "제주, 도서산간 지역은 추가 요금이 생길 수 있어요.",
      "배송비 2,500원, 3만원 이상 무료배송",
    ],
    returnTitle: "교환과 반품",
    returnBody:
      "갓 볶은 원두는 제조식품이라 단순 변심이나 분쇄 옵션을 잘못 고른 경우에는 교환과 환불이 어려워요. 제품에 문제가 있다면 교환과 환불이 가능해요.",
    /** 연락처는 site.ts에서 넣는다 (CLAUDE.md 10장) */
    returnContact: (phone: string) =>
      `반품하기 전에 고객센터 ${phone}로 먼저 연락해 주세요. 편의점 택배로는 반품할 수 없어요.`,
  },

  relatedTitle: "비슷한 맛의 원두",

  /** 스프링 블렌드(p1)만 로스터리에서 받은 자료가 있다 — 나머지는 맛 노트로 조립 */
  overrides: {
    p1: {
      notes: ["밀키초코", "은은한"],
      images: ["/images/products/p1.webp", "/images/products/p1-2.webp"],
      facts: [
        { k: "제조사", v: "(주)콩볶는 사람들" },
        { k: "원산지", v: "브라질, 콜롬비아, 에티오피아" },
      ],
      profileNote: "(로스터 제공, 5점 만점)",
      profile: [
        ["단맛", 4],
        ["쓴맛", 3],
        ["산미", 3.5],
        ["후미", 4],
        ["밸런스", 4],
        ["바디감", 3],
      ],
      roast: "medium",
    },
  },
} as const;
