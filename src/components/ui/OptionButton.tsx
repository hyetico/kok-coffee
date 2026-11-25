"use client";

type Option<K extends string> = {
  key: K;
  label: string;
  /** 오른쪽 작은 글 (「+4,600원」) */
  extra?: string;
  disabled?: boolean;
};

type OptionGroupProps<K extends string> = {
  /** 묶음 제목 요소의 id — 화면에 보이는 제목을 읽는 이름으로 쓴다 */
  labelledBy: string;
  options: readonly Option<K>[];
  value: K;
  onChange: (key: K) => void;
  className?: string;
};

/**
 * 하나만 고르는 사각 옵션 버튼 묶음 (용량 · 분쇄 · 결제 수단). 여러 개 고르는 필터는 Chip.
 * 고른 버튼은 ink 2px 테두리 + option-on 바탕. 품절은 disabled(취소선).
 * @example <OptionGroup labelledBy="size-t" options={sizes} value={size} onChange={setSize} />
 */
export function OptionGroup<K extends string>({
  labelledBy,
  options,
  value,
  onChange,
  className = "",
}: OptionGroupProps<K>) {
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={o.key === value}
          disabled={o.disabled}
          onClick={() => onChange(o.key)}
          className="inline-flex h-11 cursor-pointer items-center gap-1 rounded-lg border border-line-control bg-bg px-4 text-sm leading-none font-medium text-ink hover:border-ink disabled:cursor-not-allowed disabled:bg-surface disabled:text-disabled-ink disabled:line-through aria-pressed:border-ink aria-pressed:bg-option-on aria-pressed:font-bold aria-pressed:text-ink aria-pressed:shadow-[inset_0_0_0_1px_var(--color-ink)]"
        >
          {o.label}
          {o.extra && (
            <small className="text-xs font-medium opacity-80">{o.extra}</small>
          )}
        </button>
      ))}
    </div>
  );
}
