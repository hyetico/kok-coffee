"use client";

import type { ReactNode } from "react";
import { CheckIcon } from "@/components/icons";

type CheckboxProps = {
  checked: boolean;
  onChange: () => void;
  /** 보이는 글. 없으면 ariaLabel로 읽는 이름만 준다 (장바구니 줄 선택) */
  children?: ReactNode;
  ariaLabel?: string;
  className?: string;
};

/**
 * 디자인한 체크 상자 — 20 × 20 · 테두리 2 `line-control` · 모서리 4, 켜면 `ink` 채움 + 흰 체크 (05 「선택 컨트롤 › Checkbox」).
 * 진짜 input이라 키보드(Space) · 읽기는 브라우저 그대로. 라벨로 감싸 글자를 눌러도 바뀐다.
 * 목록 필터처럼 줄 전체가 버튼인 곳은 CheckList를 쓴다.
 * @example <Checkbox checked={all} onChange={toggleAll}>전체 선택</Checkbox>
 */
export function Checkbox({
  checked,
  onChange,
  children,
  ariaLabel,
  className = "",
}: CheckboxProps) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 ${className}`}>
      <span className="relative grid size-5 flex-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-label={ariaLabel}
          className="peer m-0 box-border size-5 cursor-pointer appearance-none rounded-sm border-2 border-line-control bg-bg checked:border-ink checked:bg-ink hover:border-ink"
        />
        <CheckIcon
          size={14}
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100"
        />
      </span>
      {children}
    </label>
  );
}
