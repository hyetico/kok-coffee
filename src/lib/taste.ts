import { ui } from "@/content/ui";
import type { AcidityBand, BodyBand, MapPosition, Taste } from "@/types";

// 맛 지도 계산 — 화면 없이 확인할 수 있게 순수 함수만 둔다 (06 기술서 6 · 8장)
// 저장하는 값은 맛 점수(taste) 하나. 좌표 · 구간 · 글은 모두 여기서 계산한다

/** 구간 경계 (좌표 0–100). 37.5 · 62.5에서 세 칸으로 나눈다 */
const EDGES = [37.5, 62.5] as const;

/** 슬라이더 왼쪽부터의 순서 */
export const ACIDITY_BANDS: AcidityBand[] = ["lo", "mid", "hi"];
export const BODY_BANDS: BodyBand[] = ["lt", "mid", "hv"];

/**
 * 맛 점수 → 지도 좌표. 산미가 높을수록 오른쪽, 바디가 무거울수록 위.
 * @example toPos({ acidity: 4, body: 2 }) // { x: 75, y: 75 }
 */
export function toPos(t: Taste): MapPosition {
  return { x: (t.acidity - 1) * 25, y: (5 - t.body) * 25 };
}

/** 좌표 한 축을 0 · 1 · 2 칸으로 */
function cell(v: number): 0 | 1 | 2 {
  return v < EDGES[0] ? 0 : v < EDGES[1] ? 1 : 2;
}

/**
 * 좌표가 속한 산미 구간.
 * @example acidityBand({ x: 74, y: 70 }) // "hi"
 */
export function acidityBand(p: MapPosition): AcidityBand {
  return ACIDITY_BANDS[cell(p.x)];
}

/**
 * 좌표가 속한 바디 구간. y가 작을수록(위) 묵직하다.
 * @example bodyBand({ x: 74, y: 70 }) // "lt"
 */
export function bodyBand(p: MapPosition): BodyBand {
  return BODY_BANDS[2 - cell(p.y)];
}

/**
 * 「산미 높음 · 바디 가벼움」처럼 좌표를 맛 위치 글로.
 * @example describePos({ x: 74, y: 70 })
 */
export function describePos(p: MapPosition): string {
  return ui.list.describe(
    ui.list.acidity.bands[acidityBand(p)],
    ui.list.body.describe[bodyBand(p)],
  );
}

/** 구간이 덮는 좌표 범위 [시작, 끝) — 지도 구간 상자에 쓴다 */
export function acidityRange(b: AcidityBand): [number, number] {
  const i = ACIDITY_BANDS.indexOf(b);
  return [[0, ...EDGES][i], [...EDGES, 100][i]];
}
export function bodyRange(b: BodyBand): [number, number] {
  const i = 2 - BODY_BANDS.indexOf(b);
  return [[0, ...EDGES][i], [...EDGES, 100][i]];
}

/**
 * 두 좌표 사이 거리.
 * @example dist({ x: 0, y: 0 }, { x: 3, y: 4 }) // 5
 */
export function dist(a: MapPosition, b: MapPosition): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * 같은 자리 묶음 키 — 점수가 완전히 같은 원두끼리 묶는다.
 * @example tasteKey({ acidity: 3.3, body: 3.2 }) // "3.3,3.2"
 */
export function tasteKey(t: Taste): string {
  return `${t.acidity},${t.body}`;
}

/**
 * 맛 점수가 같은 원두끼리 묶는다. 순서는 목록에서 처음 나온 순.
 * @example groupByTaste(mappedProducts()).filter((g) => g.items.length > 1)
 */
export function groupByTaste<T extends { taste: Taste }>(
  list: T[],
): { key: string; items: T[] }[] {
  const m = new Map<string, T[]>();
  for (const p of list) {
    const k = tasteKey(p.taste);
    m.set(k, [...(m.get(k) ?? []), p]);
  }
  return [...m].map(([key, items]) => ({ key, items }));
}

/**
 * 기준 원두와 맛이 가까운 순. 같은 자리 원두는 뺀다(이미 묶음으로 보이므로).
 * @example nearest(base, mappedProducts(), 3)
 */
export function nearest<T extends { taste: Taste }>(
  base: Taste,
  all: T[],
  n = Infinity,
): T[] {
  const k = tasteKey(base);
  const at = toPos(base);
  return all
    .filter((p) => tasteKey(p.taste) !== k)
    .map((p, i) => ({ p, i, d: dist(toPos(p.taste), at) }))
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .slice(0, n)
    .map((x) => x.p);
}

/** 점 이동값 — 질문 1 · 2 · 3번 답마다 [x, y] (06 기술서 7장) */
const MOVE: ([number, number][] | null)[] = [
  [
    [8, 8],
    [-10, -14],
    [0, 0],
  ],
  [
    [-24, -22],
    [-14, -14],
    [26, 14],
    [0, 4],
  ],
  [
    [14, 0],
    [0, 0],
    [-14, 0],
  ],
  null,
  null,
];

/**
 * 취향 테스트 답 → 「내 취향」 핀 좌표. 가운데에서 출발해 가장자리에 붙지 않게 12–88 안으로 자른다.
 * @example pinFromAnswers([0, 2, 0, 0, 0]) // { x: 88, y: 72 }
 */
export function pinFromAnswers(answers: (number | null)[]): MapPosition {
  let x = 50;
  let y = 50;
  answers.forEach((a, i) => {
    const m = MOVE[i];
    if (a != null && m?.[a]) {
      x += m[a][0];
      y += m[a][1];
    }
  });
  const clamp = (v: number) => Math.max(12, Math.min(88, v));
  return { x: clamp(x), y: clamp(y) };
}
