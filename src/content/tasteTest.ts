// 취향 테스트 화면 글. 프로토타입(design/prototype/) 글을 그대로 옮겼다 (CLAUDE.md 2장 예외 — CONTENT_TODO [x] 「취향 테스트 질문 · 결과 문구」)

export const tasteTest = {
  intro: {
    eyebrow: "30초 취향 테스트",
    titleLines: ["내 입맛에 꼭 맞는", "원두를 찾아드려요"],
    desc: "질문 5개에 답하면 맛 노트를 바탕으로 코케의 원두 중 잘 맞을 원두 3개를 골라 드려요.",
    start: "테스트 시작하기",
  },
  question: {
    step: (n: number, total: number) => `질문 ${n} / ${total}`,
    restart: "처음으로",
    progressLabel: "진행률",
    prev: "이전",
    next: "다음",
    finish: "결과 보기",
  },
  result: {
    eyebrow: "테스트 결과",
    title: (words: string[]) => `${words.join(", ")} 커피가 잘 맞아요`,
    rank: (n: number) => `${n}위`,
    toolDesc: (tool: string) =>
      `주문할 때 분쇄 선택을 '${tool}'(으)로 고르면 바로 내려 마실 수 있어요.`,
    noToolDesc:
      "도구가 없다면 분쇄 원두를 드립백처럼 우려 마시는 것부터 시작해 보세요.",
    decafDesc: " 디카페인 원두를 우선으로 골랐어요.",
    goTop: "1위 원두 보러 가기",
    again: "다시 하기",
    /** 결과 제목에 쓰는 낱말 → 꾸밈말 */
    adjectives: {
      고소: "고소한",
      묵직: "묵직한",
      달콤: "달콤한",
      쌉쌀: "쌉쌀한",
      화사: "화사한",
      과일: "과일 향이 나는",
      상큼: "상큼한",
      밸런스: "균형 잡힌",
      부드러운: "부드러운",
      은은: "은은한",
      밀키: "밀키한",
      깔끔: "깔끔한",
      꽃향기: "꽃향기가 나는",
    } as Record<string, string>,
  },
} as const;
