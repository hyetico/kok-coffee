import type { RefObject } from "react";
import { ui } from "@/content/ui";

type ClearButtonProps = {
  onClear: () => void;
  /** 지운 뒤 초점을 돌려줄 입력창 */
  inputRef: RefObject<HTMLInputElement | null>;
  className?: string;
};

/**
 * 검색 입력 안 오른쪽 원형 지우기 버튼. 값이 있을 때만 그린다. 브라우저 기본 X 대신 쓴다 (CLAUDE.md 6장).
 * @example {q && <ClearButton onClear={() => setQ("")} inputRef={ref} />}
 */
export function ClearButton({
  onClear,
  inputRef,
  className = "",
}: ClearButtonProps) {
  return (
    <button
      type="button"
      aria-label={ui.search.clear}
      onClick={() => {
        onClear();
        inputRef.current?.focus();
      }}
      // 보이는 원은 24, 누르는 칸은 바깥으로 10씩 넓혀 44
      className={`absolute top-1/2 right-2.5 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-disabled-ink text-white before:absolute before:-inset-2.5 before:content-[''] hover:bg-muted ${className}`}
    >
      <svg
        aria-hidden="true"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}
