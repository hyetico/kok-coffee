// 주문서 · 주문 완료 화면 글. 보드(design/boards/Checkout · Complete) · 프로토타입 글을 그대로 옮겼다 (CLAUDE.md 2장 예외 — CONTENT_TODO [x] 「주문서 안내 · 오류 문구」)
// 결제는 실제로 되지 않는 데모 — 푸터 안내 문장과 같은 범위

export const checkout = {
  title: "주문서",
  steps: {
    label: "주문 단계",
    cart: "장바구니",
    checkout: "주문서",
    complete: "주문 완료",
  },
  items: (n: number) => `주문 상품 ${n}개`,
  itemLine: (option: string, qty: number) => `${option} · ${qty}개`,
  receiver: {
    title: "받는 분",
    requiredNote: "표시는 꼭 입력해 주세요.",
    name: { label: "이름", placeholder: "홍길동" },
    phone: { label: "휴대폰 번호", placeholder: "010-1234-5678" },
    addr: { label: "주소", placeholder: "도로명 주소를 입력해 주세요" },
    addr2: { label: "상세 주소", placeholder: "동, 호수 등" },
  },
  pay: {
    title: "결제 수단",
    options: {
      card: "신용 · 체크카드",
      bank: "계좌이체",
      easy: "간편결제",
    },
  },
  agree: {
    title: "약관 동의",
    all: "전체 동의",
    items: [
      "[필수] 주문 상품과 결제 금액을 확인했어요",
      "[필수] 개인정보 수집 · 이용에 동의해요",
    ],
  },
  errors: {
    name: "이름을 입력해 주세요.",
    phone: "휴대폰 번호를 010-0000-0000 형식으로 입력해 주세요.",
    addr: "주소를 입력해 주세요.",
    addr2: "상세 주소를 입력해 주세요.",
    agree: "필수 약관에 모두 동의해 주세요.",
  },
  summary: {
    label: "결제 금액",
    title: "결제 금액",
    subtotal: "상품 금액",
    shipping: "배송비",
    free: "무료",
    total: "합계",
    pay: (won: string) => `${won} 결제하기`,
    paying: "결제 중…",
    demo: "포트폴리오 데모라 실제 결제는 진행되지 않아요.",
  },
  empty: {
    title: "주문할 상품이 없어요",
    desc: "장바구니에서 주문할 상품을 골라 주세요.",
    cart: "장바구니로",
    list: "원두 보러 가기",
  },
} as const;

export const complete = {
  title: "주문이 완료됐어요",
  desc: "로스터리에서 원두를 볶는 대로 보내 드릴게요. 보통 2~3일 걸려요.",
  no: "주문 번호",
  receiver: "받는 분",
  receiverValue: (name: string, phone: string) => `${name} · ${phone}`,
  address: "배송지",
  pay: "결제 수단",
  total: "결제 금액",
  continue: "쇼핑 계속하기",
  home: "홈으로",
} as const;
