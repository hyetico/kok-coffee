"use client";

import type { KeyboardEvent } from "react";

type ScrollTabsProps = {
  items: readonly string[];
  /** 고른 칸의 순서 */
  value: number;
  onChange: (index: number) => void;
  label: string;
  className?: string;
};

/**
 * 가로로 넘치는 밑줄 탭 줄. 스크롤바는 숨기고 1279px 이하에서 오른쪽 48px를 흐리게 해 더 있음을 알린다.
 * ←/→/Home/End로 옮기면 그 탭을 고르고 보이게 스크롤한다.
 * @example <ScrollTabs label="맛 노트로 고르기" items={labels} value={i} onChange={setI} />
 */
export function ScrollTabs({
  items,
  value,
  onChange,
  label,
  className = "",
}: ScrollTabsProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight"
        ? Math.min(value + 1, last)
        : e.key === "ArrowLeft"
          ? Math.max(value - 1, 0)
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    onChange(next);
    const button = e.currentTarget.querySelectorAll("button")[next];
    button?.focus();
    button?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <div
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      // 아래 1px 선은 탭 밑줄과 겹치도록 그림자로 그린다
      className={`flex gap-6 overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--color-line)] [scroll-padding-inline:48px] [scrollbar-width:none] max-xl:pr-12 max-xl:[mask-image:linear-gradient(to_right,#000_calc(100%-48px),transparent)] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {items.map((item, i) => (
        <button
          key={item}
          type="button"
          aria-pressed={i === value}
          onClick={() => onChange(i)}
          className="min-h-11 shrink-0 cursor-pointer border-b-2 border-transparent text-base font-medium text-muted hover:text-ink aria-pressed:border-primary aria-pressed:font-bold aria-pressed:text-ink"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
