// 취향 테스트 질문 5개 (04 문서 2장 · 02 PRD 「취향 테스트」). 프로토타입 문구로 확정 (CONTENT_TODO [x])
// weights: 답을 고르면 맛 노트 낱말에 더하는 점수. 상품 맛 노트에 그 낱말이 들어 있으면 점수를 받는다 (lib/recommend.ts)
// "__decaf"는 낱말이 아니라 디카페인 원두에 주는 점수

export type TasteOption = {
  label: string;
  sub: string;
  weights: Record<string, number>;
};

export type TasteQuestion = {
  q: string;
  options: TasteOption[];
};

export const DECAF_KEY = "__decaf";
/** 마지막 질문(추출 도구) — 점수 대신 분쇄 안내에 쓴다 */
export const TOOL_QUESTION_INDEX = 4;
/** 카페인 질문에서 디카페인을 고른 답의 순서 */
export const DECAF_ANSWER = { question: 3, option: 1 };

export const tasteQuestions: TasteQuestion[] = [
  {
    q: "커피를 주로 어떻게 드세요?",
    options: [
      { label: "블랙으로", sub: "아메리카노, 핸드 드립", weights: { 깔끔: 1, 화사: 1, 과일: 1 } },
      { label: "우유와 함께", sub: "라떼, 플랫화이트", weights: { 묵직: 2, 고소: 1, 달콤: 1, 밀키: 2 } },
      { label: "둘 다 좋아요", sub: "그날 기분에 따라", weights: { 밸런스: 1, 부드러운: 1 } },
    ],
  },
  {
    q: "가장 끌리는 맛은 어느 쪽이에요?",
    options: [
      { label: "고소하고 묵직한", sub: "견과류, 다크 초콜릿", weights: { 고소: 3, 묵직: 3, 쌉쌀: 1 } },
      { label: "달콤하고 쌉쌀한", sub: "카라멜, 코코아", weights: { 달콤: 3, 쌉쌀: 3, 묵직: 1 } },
      { label: "화사하고 과일 같은", sub: "베리, 꽃향기", weights: { 화사: 3, 과일: 3, 꽃향기: 2, 상큼: 2 } },
      {
        label: "부드럽고 균형 잡힌",
        sub: "어느 쪽으로도 튀지 않게",
        weights: { 밸런스: 3, 부드러운: 3, 은은: 2, 밀키: 2, 깔끔: 1 },
      },
    ],
  },
  {
    q: "산미(신맛)는 어때요?",
    options: [
      { label: "좋아요", sub: "상큼한 커피가 좋아요", weights: { 상큼: 2, 과일: 2, 화사: 2 } },
      { label: "조금은 괜찮아요", sub: "은은하게 느껴지는 정도", weights: { 은은: 1, 밸런스: 1, 달콤: 1 } },
      {
        label: "싫어요",
        sub: "신맛은 빼 주세요",
        weights: { 고소: 2, 묵직: 2, 쌉쌀: 1, 과일: -3, 화사: -3, 상큼: -3 },
      },
    ],
  },
  {
    q: "카페인은 어떻게 할까요?",
    options: [
      { label: "상관없어요", sub: "", weights: {} },
      { label: "디카페인이 좋아요", sub: "저녁에도 마시고 싶어요", weights: { [DECAF_KEY]: 10 } },
    ],
  },
  {
    q: "집에서 어떻게 내려 드세요?",
    options: [
      { label: "핸드 드립", sub: "", weights: {} },
      { label: "에스프레소 머신", sub: "", weights: {} },
      { label: "모카포트", sub: "", weights: {} },
      { label: "프렌치 프레스", sub: "", weights: {} },
      { label: "아직 도구가 없어요", sub: "", weights: {} },
    ],
  },
];
