"use client";

import { useRef } from "react";
import { SearchIcon } from "@/components/icons";
import { ClearButton } from "./ClearButton";

type SearchInputProps = {
  id: string;
  /** 보이지 않는 라벨 (검색창은 눈에 보이는 라벨 대신 읽는 이름만 둔다) */
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: (value: string) => void;
  /** 목록 도구 줄은 40, 로스터리 목록은 44 */
  height?: "h-10" | "h-11";
  className?: string;
};

/**
 * 페이지 안 검색창 — 목록 도구 줄 · 로스터리 목록이 같은 컴포넌트를 쓴다 (05 「입력」). 왼쪽 돋보기, 값이 있으면 지우기 버튼.
 * @example <SearchInput id="list-q" label="이 목록에서 원두 검색" placeholder="…" value={q} onChange={setQ} />
 */
export function SearchInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  onEnter,
  height = "h-11",
  className = "",
}: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div role="search" className={`relative min-w-0 ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon
        size={18}
        strokeWidth={2}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
      />
      <input
        ref={ref}
        id={id}
        type="search"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnter?.(e.currentTarget.value);
            e.currentTarget.blur();
          }
        }}
        className={`${height} w-full rounded-lg border border-line-control bg-bg pr-11 pl-10 text-base text-ink placeholder:text-muted hover:not-focus:border-ink focus:border-primary focus:shadow-[0_0_0_3px_rgba(31,77,58,.16)] focus:outline-none`}
      />
      {value && <ClearButton onClear={() => onChange("")} inputRef={ref} />}
    </div>
  );
}
