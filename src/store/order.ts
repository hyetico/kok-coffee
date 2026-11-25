"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

export type PayMethod = "card" | "bank" | "easy";

/** 주문 완료 화면에 보여 줄 마지막 주문. 금액은 주문한 순간 값으로 고정한다 */
export type Order = {
  no: string;
  name: string;
  phone: string;
  address: string;
  pay: PayMethod;
  subtotal: number;
  shipping: number;
  items: Omit<CartItem, "checked">[];
};

type OrderState = {
  last: Order | null;
  place: (order: Order) => void;
};

/**
 * 마지막 주문 (데모 — 실제 결제 없음). 새로고침해도 주문 완료 화면이 다시 보이도록 localStorage에 남긴다.
 * @example useOrder.getState().place(order)
 */
export const useOrder = create<OrderState>()(
  persist(
    (set) => ({
      last: null,
      place: (order) => set({ last: order }),
    }),
    { name: "kok-order" },
  ),
);

/**
 * 마지막 주문을 읽는다. 서버 렌더 · 첫 화면은 undefined(아직 모름), 읽은 뒤 Order 또는 null.
 * @example const order = useLastOrder();
 */
export function useLastOrder(): Order | null | undefined {
  return useSyncExternalStore(
    useOrder.subscribe,
    () => useOrder.getState().last,
    () => undefined,
  );
}

/**
 * 주문 번호 — 날짜 + 네 자리 (예: 20261125-4821). 데모라 겹치지 않음을 보장하지 않는다.
 * @example orderNumber(new Date())
 */
export function orderNumber(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`;
}
