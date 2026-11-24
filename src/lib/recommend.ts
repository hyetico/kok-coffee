import { DECAF_KEY, tasteQuestions } from "@/data/taste-questions";
import type { Product } from "@/types";
import { listedProducts } from "./catalog";

/**
 * 취향 테스트 답으로 원두에 점수를 매긴다 (02 PRD 「취향 테스트」).
 * 답마다 맛 낱말에 점수를 더하고, 상품 맛 노트에 그 낱말이 들어 있으면 그 점수를 받는다. 디카페인을 고르면 디카페인 원두에 큰 점수.
 * 점수가 같으면 데이터 순서를 지킨다(안정 정렬).
 * @example recommend([0, 1, 2, 0, 0]).top // 원두 3개
 */
export function recommend(answers: number[], count = 3) {
  const weights: Record<string, number> = {};
  answers.forEach((a, qi) => {
    const map = tasteQuestions[qi]?.options[a]?.weights ?? {};
    for (const [k, v] of Object.entries(map))
      weights[k] = (weights[k] ?? 0) + v;
  });

  const scored = listedProducts()
    .map((p) => {
      let score = 0;
      for (const [k, v] of Object.entries(weights)) {
        if (k === DECAF_KEY) {
          if (p.decaf) score += v;
        } else if (p.notes.includes(k)) score += v;
      }
      return { product: p, score };
    })
    .sort((x, y) => y.score - x.score);

  // 결과 제목에 쓸 맛 낱말: 점수가 높은 양수 2개
  const words = Object.entries(weights)
    .filter(([k, v]) => k !== DECAF_KEY && v > 0)
    .sort((x, y) => y[1] - x[1])
    .slice(0, 2)
    .map(([k]) => k);

  return {
    top: scored.slice(0, count).map((s) => s.product) as Product[],
    words,
  };
}
