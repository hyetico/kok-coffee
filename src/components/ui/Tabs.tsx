"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";

type TabsProps = {
  label: string;
  tabs: readonly string[];
  /** 탭마다 그릴 내용 (고른 탭만 그린다) */
  panels: ReactNode[];
  /** 탭 줄에 더할 클래스 (고정 위치 등) */
  listClassName?: string;
  panelClassName?: string;
};

/**
 * 같은 자리에서 내용을 바꾸는 밑줄 탭 (role=tablist). ←/→/Home/End로 옮기면 바로 그 탭을 고른다.
 * 목록 필터처럼 화면을 다시 거르는 탭은 ScrollTabs(aria-pressed)를 쓴다.
 * @example <Tabs label="상품 정보" tabs={["상품 정보", "배송 · 교환"]} panels={[info, ship]} />
 */
export function Tabs({
  label,
  tabs,
  panels,
  listClassName = "",
  panelClassName = "",
}: TabsProps) {
  const [index, setIndex] = useState(0);
  const id = useId();

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : e.key === "ArrowLeft"
          ? (index - 1 + tabs.length) % tabs.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
    e.currentTarget
      .querySelectorAll<HTMLButtonElement>("[role=tab]")
      [next]?.focus();
  };

  return (
    <>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={`flex overflow-x-auto overflow-y-hidden bg-bg shadow-[inset_0_-1px_0_var(--color-line)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${listClassName}`}
      >
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${id}-panel`}
            // 고른 탭만 Tab 순서에 넣고 나머지는 방향키로 옮긴다 (WAI-ARIA 탭 패턴)
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className="h-13 min-w-40 shrink-0 cursor-pointer border-b-2 border-transparent text-base font-medium text-muted hover:text-ink aria-selected:border-ink aria-selected:font-bold aria-selected:text-ink"
          >
            {t}
          </button>
        ))}
      </div>
      <section
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${index}`}
        className={panelClassName}
      >
        {panels[index]}
      </section>
    </>
  );
}
