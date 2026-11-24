"use client";

import { create } from "zustand";

export type ToastInput = {
  text: string;
  /** 링크 하나 (예: 장바구니 보기) */
  link?: { href: string; label: string };
  /** 되돌리기 같은 동작 하나 */
  action?: { label: string; onClick: () => void };
};

type ToastState = {
  toast: (ToastInput & { id: number }) | null;
  show: (t: ToastInput) => void;
  hide: () => void;
};

let seq = 0;

/**
 * 화면 아래 알림. 한 번에 하나만 보이고 새 알림이 오면 바꿔 끼운다. 오류는 알림에만 띄우지 않는다 (CLAUDE.md 7장).
 * @example useToast.getState().show({ text: "담았어요", link: { href: "/cart", label: "장바구니 보기" } })
 */
export const useToast = create<ToastState>()((set) => ({
  toast: null,
  show: (t) => set({ toast: { ...t, id: ++seq } }),
  hide: () => set({ toast: null }),
}));
