"use client";

import { clampQty } from "@/lib/price";

type QtyStepperProps = {
  value: number;
  onChange: (qty: number) => void;
  labels: { dec: string; inc: string; qty: string };
};

/**
 * 수량 − 숫자 + (버튼 44, 1–20). 숫자 입력 ▲▼ 대신 쓴다 (CLAUDE.md 6장). 상세 · 장바구니가 같은 모양.
 * 끝값(1 · 20)에서는 값만 멈춘다 — 프로토타입처럼 버튼 모양은 그대로.
 * @example <QtyStepper value={qty} onChange={setQty} labels={{ dec: "수량 줄이기", inc: "수량 늘리기", qty: "수량" }} />
 */
export function QtyStepper({ value, onChange, labels }: QtyStepperProps) {
  const btn = "size-11 cursor-pointer text-xl text-ink";
  return (
    <div className="flex items-center rounded-lg border border-line-control bg-bg">
      <button
        type="button"
        aria-label={labels.dec}
        onClick={() => onChange(clampQty(value - 1))}
        className={btn}
      >
        −
      </button>
      <span aria-live="polite" className="min-w-8 text-center font-bold">
        <span className="sr-only">{labels.qty} </span>
        {value}
      </span>
      <button
        type="button"
        aria-label={labels.inc}
        onClick={() => onChange(clampQty(value + 1))}
        className={btn}
      >
        +
      </button>
    </div>
  );
}
