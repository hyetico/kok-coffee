"use client";

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
 * 손잡이 두 개로 이웃한 칸만 고를 수 있다. 브라우저 range 입력 두 개라 키보드(←/→)로도 움직인다.
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
  return (
    <>
      <p className="mt-2 mb-0 text-sm text-ink-2">{summary}</p>
      <div className="range-pair relative mx-2 mt-1 h-7">
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
