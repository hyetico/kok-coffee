"use client";

import { useRef, type RefObject } from "react";
import { SearchIcon } from "@/components/icons";
import { ClearButton } from "./ClearButton";

/**
 * 검색창 모양 — 회색 알약 · 테두리 없음 · 올리면 조금 진하게 · 초점이면 흰 바탕 + ink 테두리 (05 「입력 › 검색창」).
 * 헤더 검색 트리거(버튼)도 같은 바탕을 쓰도록 꺼내 둔다.
 */
export const searchFieldLook =
  "rounded-full border border-transparent bg-surface text-ink hover:bg-search-hover";

const SIZES = {
  /** 목록 도구 줄 */
  sm: { box: "h-10 text-base", icon: 18, iconPos: "left-3" },
  /** 로스터리 목록 */
  md: { box: "h-11 text-base", icon: 18, iconPos: "left-3" },
  /** 헤더 검색 레이어 */
  lg: { box: "h-13 pl-12! text-lg", icon: 20, iconPos: "left-4" },
} as const;

type SearchInputProps = {
  id: string;
  /** 보이지 않는 라벨 (검색창은 눈에 보이는 라벨 대신 읽는 이름만 둔다) */
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: (value: string) => void;
  /** 높이만 자리마다 다르다 — 목록 40 · 로스터리 44 · 검색 레이어 52 */
  size?: keyof typeof SIZES;
  /** 검색 레이어처럼 열리자마자 입력할 때 */
  autoFocus?: boolean;
  /** 밖에서 초점을 다뤄야 할 때 (검색 레이어) */
  inputRef?: RefObject<HTMLInputElement | null>;
  className?: string;
};

/**
 * 검색창 하나 — 검색 레이어 · 목록 도구 줄 · 로스터리 목록이 같은 컴포넌트를 쓴다 (05 「입력」). 왼쪽 돋보기, 값이 있으면 지우기 버튼.
 * @example <SearchInput id="list-q" label="이 목록에서 원두 검색" placeholder="…" value={q} onChange={setQ} size="sm" />
 */
export function SearchInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  onEnter,
  size = "md",
  autoFocus,
  inputRef,
  className = "",
}: SearchInputProps) {
  const ownRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? ownRef;
  const s = SIZES[size];
  return (
    <div role="search" className={`relative min-w-0 ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon
        size={s.icon}
        strokeWidth={2}
        className={`pointer-events-none absolute top-1/2 ${s.iconPos} -translate-y-1/2 text-muted`}
      />
      <input
        ref={ref}
        id={id}
        type="search"
        autoFocus={autoFocus}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            onEnter(e.currentTarget.value);
            if (!inputRef) e.currentTarget.blur();
          }
        }}
        className={`${s.box} w-full pr-11 pl-10 placeholder:text-muted focus:border-ink focus:bg-bg focus:shadow-[0_0_0_3px_rgba(23,32,27,.12)] focus:outline-none ${searchFieldLook}`}
      />
      {value && <ClearButton onClear={() => onChange("")} inputRef={ref} />}
    </div>
  );
}
