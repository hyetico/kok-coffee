"use client";

import { clampQty } from "@/lib/price";

type QtyStepperProps = {
  value: number;
  onChange: (qty: number) => void;
  labels: { dec: string; inc: string; qty: string };
  /** 장바구니 줄은 숫자 칸이 좁다 (24 — 상세는 32) */
  narrow?: boolean;
};

/** 선 아이콘 − · + — 글자 대신 써서 기기 설정에 따라 버튼 글자색이 바뀌어도 보이게 한다 (05 「입력 › 수량」) */
function Sign({ plus }: { plus?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    >
      <path d={plus ? "M12 5v14M5 12h14" : "M5 12h14"} />
    </svg>
  );
}

/**
 * 수량 − 숫자 + (버튼 44, 1–20). 숫자 입력 ▲▼ 대신 쓴다 (CLAUDE.md 6장). 상세 · 장바구니가 같은 모양.
 * 끝값(1 · 20)에서는 값만 멈춘다 — 프로토타입처럼 버튼 모양은 그대로.
 * @example <QtyStepper value={qty} onChange={setQty} labels={{ dec: "수량 줄이기", inc: "수량 늘리기", qty: "수량" }} />
 */
export function QtyStepper({
  value,
  onChange,
  labels,
  narrow,
}: QtyStepperProps) {
  const btn =
    "grid size-11 cursor-pointer place-items-center rounded-lg p-0 text-ink hover:bg-secondary-hover";
  return (
    <div className="flex items-center rounded-lg border border-line-control bg-bg">
      <button
        type="button"
        aria-label={labels.dec}
        onClick={() => onChange(clampQty(value - 1))}
        className={btn}
      >
        <Sign />
      </button>
      <span
        aria-live="polite"
        className={`${narrow ? "min-w-6" : "min-w-8"} text-center font-bold`}
      >
        <span className="sr-only">{labels.qty} </span>
        {value}
      </span>
      <button
        type="button"
        aria-label={labels.inc}
        onClick={() => onChange(clampQty(value + 1))}
        className={btn}
      >
        <Sign plus />
      </button>
    </div>
  );
}
