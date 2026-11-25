"use client";

import { useRef, type PointerEvent } from "react";

type RangeSliderProps = {
  /** 제목 줄에 붙는 이름 — 「산미」 · 「바디」 */
  name: string;
  /** 칸 이름 (왼쪽부터 3개) */
  steps: readonly [string, string, string];
  /** 양 끝 아래 글 */
  ends: readonly [string, string];
  /** 고른 칸 범위 [낮은 쪽, 높은 쪽] (0–2) */
  value: [number, number];
  onChange: (value: [number, number]) => void;
  /** 「산미 전체」 · 「산미 중간 – 높음」 */
  summary: string;
  loLabel: string;
  hiLabel: string;
};

/**
 * 세 칸짜리 범위 슬라이더 — 목록 필터 「맛」의 산미 · 바디 (05 「필터」, 06 기술서 5장).
 * 손잡이 두 개로 이웃한 칸만 고를 수 있다. 마우스 · 터치는 28 줄 어디를 눌러도 가까운 손잡이가 그 칸으로 오고, 누른 채 끌면 칸 단위로 따라온다.
 * 키보드(←/→) · 읽기는 겹쳐 둔 range 입력 두 개가 맡는다 (05 「맛 슬라이더」).
 * @example <RangeSlider name="산미" steps={["낮음","중간","높음"]} ends={["고소한","화사한"]} value={[0, 2]} onChange={set} summary="산미 전체" loLabel="산미 낮은 쪽" hiLabel="산미 높은 쪽" />
 */
export function RangeSlider({
  steps,
  ends,
  value: [lo, hi],
  onChange,
  summary,
  loLabel,
  hiLabel,
}: RangeSliderProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  /** 끌고 있는 손잡이 — 0: 낮은 쪽 · 1: 높은 쪽 */
  const dragging = useRef<0 | 1 | null>(null);

  /** 누른 자리의 칸 (0–2) */
  const cellAt = (clientX: number) => {
    const r = rowRef.current!.getBoundingClientRect();
    return Math.max(
      0,
      Math.min(2, Math.round(((clientX - r.left) / r.width) * 2)),
    );
  };
  const moveTo = (handle: 0 | 1, cell: number) => {
    const [l, h] = [lo, hi];
    const next: [number, number] =
      handle === 0 ? [Math.min(cell, h), h] : [l, Math.max(cell, l)];
    if (next[0] !== l || next[1] !== h) onChange(next);
    rowRef.current
      ?.querySelectorAll("input")
      [handle]?.focus({ preventScroll: true });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cell = cellAt(e.clientX);
    const [l, h] = [lo, hi];
    // 칸이 범위 밖이면 그쪽 손잡이, 사이면 가까운 손잡이(같은 거리면 낮은 쪽)
    const handle: 0 | 1 =
      cell < l ? 0 : cell > h ? 1 : cell - l <= h - cell ? 0 : 1;
    dragging.current = handle;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(handle, cell);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current === null) return;
    moveTo(dragging.current, cellAt(e.clientX));
  };
  const endDrag = () => {
    dragging.current = null;
  };

  return (
    <>
      <p className="mt-2 mb-0 text-sm text-ink-2">{summary}</p>
      <div
        ref={rowRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="range-pair relative mx-2 mt-1 h-7 cursor-pointer touch-none"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-3.25 h-0.5 rounded-[1px] bg-line before:absolute before:top-[-3px] before:left-1/2 before:-ml-1 before:size-2 before:rounded-full before:bg-line before:content-['']"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3.25 h-0.5 rounded-[1px] bg-ink"
          style={{ left: `${lo * 50}%`, width: `${(hi - lo) * 50}%` }}
        />
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={lo}
          aria-label={loLabel}
          aria-valuetext={steps[lo]}
          onChange={(e) => onChange([Math.min(+e.target.value, hi), hi])}
        />
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={hi}
          aria-label={hiLabel}
          aria-valuetext={steps[hi]}
          onChange={(e) => onChange([lo, Math.max(+e.target.value, lo)])}
        />
      </div>
      <p className="mt-1 mb-0 flex justify-between text-xs text-range-label">
        <span>{ends[0]}</span>
        <span>{ends[1]}</span>
      </p>
    </>
  );
}
