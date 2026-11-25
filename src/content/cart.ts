// 장바구니 화면 글. 보드(design/boards/Cart) · 프로토타입 글을 그대로 옮겼다 (CLAUDE.md 2장 예외 — CONTENT_TODO [x] 「장바구니 「인기 원두 2개 담아 보기」」)

export const cart = {
  title: "장바구니",
  listLabel: "담은 상품",
  selectAll: (checked: number, total: number) =>
    `전체 선택 (${checked}/${total})`,
  removeChecked: "선택 삭제",
  check: (title: string) => `${title} 선택`,
  qtyDec: (title: string) => `${title} 수량 줄이기`,
  qtyInc: (title: string) => `${title} 수량 늘리기`,
  qty: "수량",
  remove: "삭제",
  removeLabel: (title: string) => `${title} 삭제`,
  option: (size: string, grind: string) => `${size}, ${grind}`,
  removed: (title: string) => `${title}, 장바구니에서 뺐어요`,
  removedMany: (n: number) => `${n}개 상품을 뺐어요`,

  summary: {
    label: "결제 금액",
    title: "결제 예정 금액",
    subtotal: "상품 금액",
    shipping: "배송비",
    free: "무료",
    freeLeft: (won: string) => `${won} 더 담으면 무료배송이에요.`,
    freeDone: "무료배송으로 받아요.",
    noneSelected: "주문할 상품을 선택해 주세요.",
    progressLabel: "무료배송까지 남은 금액",
    total: "합계",
    order: (n: number) => `${n}개 상품 주문하기`,
    orderNone: "상품을 선택해 주세요",
    orderNoneToast: "주문할 상품을 선택해 주세요",
    demo: "포트폴리오 데모라 실제 결제는 진행되지 않아요.",
    continue: "쇼핑 계속하기",
  },

  empty: {
    title: "장바구니가 비어 있어요",
    desc: "마음에 드는 원두를 담거나, 취향 테스트로 추천을 받아 보세요.",
    list: "원두 보러 가기",
    test: "취향 테스트",
    /** 데모용 — 보드의 처음 장바구니(스프링 블렌드 200g 핸드 드립 · 에티오피아 반코 고고티 200g 홀빈)를 다시 담는다 */
    restore: "인기 원두 2개 담아 보기",
    restoreItems: [
      { productId: "p1", size: "200g", grind: "hand-drip", qty: 1 },
      { productId: "p7", size: "200g", grind: "whole", qty: 1 },
    ],
  },

  rec: {
    title: "함께 담기 좋은 원두",
    productIds: ["p13", "p17", "p10", "p4"],
  },
} as const;
