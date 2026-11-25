"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CheckIcon } from "@/components/icons";

type Option<K extends string> = { key: K; label: string };

type SortSelectProps<K extends string> = {
  options: readonly Option<K>[];
  /** null이면 메뉴에서 아무것도 고르지 않은 상태 (맛 지도에서 점을 고른 동안) */
  value: K | null;
  onChange: (key: K) => void;
  /** 버튼 읽는 이름 앞부분 (「정렬 기준: 추천순」) */
  label: (current: string) => string;
  menuLabel: string;
  /** 버튼에 보일 글을 바꿀 때 — 맛 지도에서 점을 고르면 「고른 원두와 가까운 순」 */
  currentLabel?: string;
  /** 테두리 · 바탕 없는 글자형 버튼 (목록 「원두」 제목 줄) */
  plain?: boolean;
};

/**
 * 버튼 + 메뉴로 만든 정렬 고르기 (브라우저 select 대신 — CLAUDE.md 6장). 높이 40.
 * 메뉴는 ↑/↓로 옮기고 ESC · 바깥 누르기로 닫는다. 닫으면 초점은 버튼으로.
 * @example <SortSelect options={sorts} value={sort} onChange={setSort} label={(l) => `정렬 기준: ${l}`} menuLabel="정렬 기준" />
 */
export function SortSelect<K extends string>({
  options,
  value,
  onChange,
  label,
  menuLabel,
  currentLabel,
  plain,
}: SortSelectProps<K>) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const shown =
    currentLabel ?? (options.find((o) => o.key === value) ?? options[0]).label;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    // 열면 고른 항목으로 초점
    wrapRef.current
      ?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
      ?.focus();
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") return close();
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [
      ...e.currentTarget.querySelectorAll<HTMLButtonElement>(
        "[role=menuitemradio]",
      ),
    ];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      e.key === "ArrowDown"
        ? (i + 1) % items.length
        : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label(shown)}
        onClick={() => setOpen((o) => !o)}
        className={`group inline-flex cursor-pointer items-center gap-2 rounded-lg border text-sm leading-none font-medium text-ink ${
          plain
            ? "h-10 border-transparent bg-transparent pr-0 pl-3"
            : "h-10 border-line-control bg-bg pr-2.5 pl-3 hover:border-ink aria-expanded:border-ink"
        }`}
      >
        {shown}
        <svg
          aria-hidden="true"
          width={plain ? 16 : 14}
          height={plain ? 16 : 14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={plain ? 1.75 : 2.2}
          className="transition-transform duration-200 group-aria-expanded:rotate-180 motion-reduce:transition-none"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={menuLabel}
          onKeyDown={onMenuKey}
          className="absolute top-[calc(100%+6px)] right-0 z-26 min-w-42 rounded-xl border border-line bg-bg p-1.5 shadow-[0_12px_32px_rgba(23,32,27,.12)]"
        >
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              role="menuitemradio"
              aria-checked={o.key === value}
              onClick={() => {
                onChange(o.key);
                close();
              }}
              className="group/item flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 text-left text-sm text-ink hover:bg-surface aria-checked:font-bold aria-checked:text-primary"
            >
              {o.label}
              <CheckIcon className="invisible group-aria-checked/item:visible" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
