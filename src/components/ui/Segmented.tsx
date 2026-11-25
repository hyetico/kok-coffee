"use client";

type Item<K extends string> = { key: K; label: string };

type SegmentedProps<K extends string> = {
  items: readonly Item<K>[];
  value: K;
  onChange: (key: K) => void;
  /** 묶음의 읽는 이름 */
  label: string;
  /** 목록 도구 줄 (버튼 34 + 안쪽 4) */
  tall?: boolean;
};

/**
 * 하나만 고르는 짧은 전환 버튼 묶음 (높이 36 = 버튼 30 + 안쪽 3). 목록/지도 보기 · 맛 지도 종류.
 * @example <Segmented label="보기 방식" items={views} value={view} onChange={setView} />
 */
export function Segmented<K extends string>({
  items,
  value,
  onChange,
  label,
  tall,
}: SegmentedProps<K>) {
  // 고른 쪽은 흰 바탕 + 진한 글자 + 옅은 그림자 (05 「선택 컨트롤」 Segmented)
  const on =
    "aria-pressed:bg-bg aria-pressed:font-semibold aria-pressed:text-ink aria-pressed:shadow-[0_1px_2px_rgba(23,32,27,.14)]";
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex rounded-lg bg-surface ${tall ? "p-1" : "p-0.75"}`}
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          aria-pressed={item.key === value}
          onClick={() => onChange(item.key)}
          className={`inline-flex ${tall ? "h-8.5" : "h-7.5"} px-3 cursor-pointer items-center rounded-md text-sm leading-none font-medium text-muted hover:text-ink ${on}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
