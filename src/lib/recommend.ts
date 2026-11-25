import {
  DECAF_ANSWER,
  DECAF_KEY,
  tasteQuestions,
} from "@/data/taste-questions";
import type { MapPosition } from "@/types";
import { mappedProducts, type MappedProduct } from "./catalog";
import { dist, pinFromAnswers, toPos } from "./taste";

/** 맛 키워드 점수 1점이 거리 몇 칸에 해당하는지 (06 기술서 7장) */
const KEYWORD_WEIGHT = 0.8;

/**
 * 취향 테스트 답으로 추천 원두를 고른다 (06 기술서 7장).
 * 후보마다 「핀과의 거리 − 0.8 × 맛 키워드 점수(0 이상만)」가 작은 순. 디카페인을 고르면 디카페인 원두에서만 고른다.
 * 점수가 같으면 데이터 순서를 지킨다(안정 정렬).
 * @example recommend([0, 2, 0, 0, 0]).top // 원두 3개
 */
export function recommend(
  answers: number[],
  count = 3,
): { top: MappedProduct[]; pin: MapPosition } {
  const pin = pinFromAnswers(answers);
  const weights: Record<string, number> = {};
  answers.forEach((a, qi) => {
    const map = tasteQuestions[qi]?.options[a]?.weights ?? {};
    for (const [k, v] of Object.entries(map))
      weights[k] = (weights[k] ?? 0) + v;
  });

  const decafOnly = answers[DECAF_ANSWER.question] === DECAF_ANSWER.option;
  const pool = mappedProducts().filter((p) => !decafOnly || p.decaf);

  const top = pool
    .map((p) => {
      let s = 0;
      for (const [k, v] of Object.entries(weights))
        if (k !== DECAF_KEY && p.notes.includes(k)) s += v;
      return {
        p,
        d: dist(toPos(p.taste), pin) - Math.max(0, s) * KEYWORD_WEIGHT,
      };
    })
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map((x) => x.p);

  return { top, pin };
}
