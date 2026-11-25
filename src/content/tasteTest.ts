// 취향 테스트 화면 글. 프로토타입 · 보드(design/boards/Test · TestQ · TestR) 글을 그대로 옮겼다 (CLAUDE.md 2장 예외 — CONTENT_TODO [x] 「취향 테스트 질문 · 결과 문구」)

import type { AcidityBand, BodyBand } from "@/types";

export const tasteTest = {
  intro: {
    eyebrow: "30초 취향 테스트",
    titleLines: ["질문 5개로 맛 지도에서", "내 자리를 찾아요"],
    desc: "답을 고르면 산미와 바디로 지도 위 내 자리를 정하고, 가장 가까운 원두 3개를 골라 드려요. 결과는 원두 목록의 맛 지도에도 「내 취향」으로 표시돼요.",
    start: "테스트 시작하기",
    /** 시작 화면 지도의 점선 원 위 말풍선 */
    pinQuestion: "내 취향은 어디?",
  },
  question: {
    step: (n: number, total: number) => `질문 ${n} / ${total}`,
    restart: "처음으로",
    progressLabel: "진행률",
    /** 질문마다 아래 한 줄 도움말 (질문 순서와 같다) */
    help: [
      "마시는 방식으로 바디(묵직함)를 가늠해요.",
      "고른 맛 쪽으로 지도 위 자리가 크게 움직여요.",
      "산미(화사한 쪽)를 얼마나 둘지 정해요.",
      "디카페인을 고르면 결과를 디카페인 원두에서만 골라요.",
      "결과에는 영향이 없고, 분쇄 방식 안내에만 써요.",
    ],
    prev: "이전",
    next: "다음",
    finish: "결과 보기",
  },
  result: {
    eyebrow: "테스트 결과",
    /** 결과 제목 — 핀이 있는 산미 구간 + 바디 구간으로 정한다 (06 기술서 7장) */
    title: (word: string) => `${word} 커피가 잘 맞아요`,
    words: {
      hi: { light: "화사하고 가벼운", other: "화사하고 산뜻한" },
      mid: { heavy: "달콤하고 묵직한", other: "균형 잡힌 부드러운" },
      lo: { heavy: "고소하고 묵직한", other: "고소하고 편안한" },
    },
    lead: "지도에서 내 자리와 가장 가까운 원두 3개예요. ",
    rank: (n: number) => `${n}위`,
    toolDesc: (tool: string) =>
      `주문할 때 분쇄를 '${tool}'(으)로 고르면 바로 내려 마실 수 있어요.`,
    noToolDesc:
      "도구가 없다면 분쇄 원두를 드립백처럼 우려 마시는 것부터 시작해 보세요.",
    decafDesc: " 디카페인 원두에서만 골랐어요.",
    goTop: "1위 원두 보러 가기",
    goMap: "맛 지도에서 내 자리 보기",
    again: "다시 하기",
    pin: "내 취향",
  },
} as const;

/**
 * 핀 구간 → 결과 제목 꾸밈말. 산미 높음은 바디가 가벼우면 「화사하고 가벼운」, 나머지 산미는 바디가 묵직하면 「…묵직한」.
 * @example resultWord("hi", "lt") // "화사하고 가벼운"
 */
export function resultWord(ac: AcidityBand, bd: BodyBand): string {
  const w = tasteTest.result.words;
  if (ac === "hi") return bd === "lt" ? w.hi.light : w.hi.other;
  if (ac === "mid") return bd === "hv" ? w.mid.heavy : w.mid.other;
  return bd === "hv" ? w.lo.heavy : w.lo.other;
}
