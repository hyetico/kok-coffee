"use client";

import { CheckIcon } from "@/components/icons";

type CheckItem<K extends string> = { key: K; label: string };

type CheckListProps<K extends string> = {
  items: readonly CheckItem<K>[];
  /** 고른 항목. 라디오는 하나만 */
  value: readonly K[];
  onToggle: (key: K) => void;
  /** 묶음의 읽는 이름 (화면 제목과 같게) */
  label: string;
  /** 하나만 고르는 묶음 (목록 필터 「종류」) */
  radio?: boolean;
  /** 줄 높이 — 왼쪽 필터 32 · 아래 시트 36 */
  dense?: boolean;
  /** 짧은 낱말을 두 줄로 나란히 (향) */
  columns?: boolean;
};

/**
 * 흰 바탕 체크 목록 — 목록 필터의 카페인 · 가격 · 향(체크), 종류(라디오) (05 「필터」).
 * 칩보다 차분하게 보이도록 네모 · 동그라미 + 글자 한 줄. 라디오 묶음은 ↑/↓/←/→로 옮기며 고른다.
 * @example <CheckList label="가격" items={prices} value={filter.prices} onToggle={togglePrice} />
 */
export function CheckList<K extends string>({
  items,
  value,
  onToggle,
  label,
  radio,
  dense,
  columns,
}: CheckListProps<K>) {
  // 라디오 묶음: 방향키로 옆 항목을 고르고 초점을 옮긴다 (WAI-ARIA 라디오 패턴)
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!radio) return;
    const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[
      e.key
    ];
    if (!dir) return;
    e.preventDefault();
    const i = items.findIndex((it) => value.includes(it.key));
    const next = (Math.max(i, 0) + dir + items.length) % items.length;
    onToggle(items[next].key);
    e.currentTarget
      .querySelectorAll<HTMLButtonElement>("[role=radio]")
      [next]?.focus();
  };

  return (
    <div
      role={radio ? "radiogroup" : "group"}
      aria-label={label}
      onKeyDown={onKeyDown}
      className={columns ? "grid grid-cols-2 gap-x-2" : undefined}
    >
      {items.map((it, i) => {
        const on = value.includes(it.key);
        const anyOn = items.some((x) => value.includes(x.key));
        return (
          <button
            key={it.key}
            type="button"
            role={radio ? "radio" : "checkbox"}
            aria-checked={on}
            // 라디오는 고른 항목 하나만 Tab 순서에 넣는다
            tabIndex={radio ? (on || (!anyOn && i === 0) ? 0 : -1) : undefined}
            onClick={() => onToggle(it.key)}
            className={`group flex w-full cursor-pointer items-center gap-3 p-0 text-left text-sm text-ink-2 aria-checked:font-semibold aria-checked:text-ink ${
              dense ? "min-h-8" : "min-h-9"
            }`}
          >
            <i
              aria-hidden="true"
              className={`box-border grid size-4.5 flex-none place-items-center border-[1.5px] border-check-line bg-bg text-white not-italic group-hover:border-ink ${
                radio
                  ? "rounded-full group-aria-checked:border-5 group-aria-checked:border-ink"
                  : "rounded-sm group-aria-checked:border-ink group-aria-checked:bg-ink"
              }`}
            >
              {!radio && (
                <CheckIcon
                  size={12}
                  strokeWidth={3}
                  className="opacity-0 group-aria-checked:opacity-100"
                />
              )}
            </i>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
