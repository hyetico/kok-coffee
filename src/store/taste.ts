"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MapPosition } from "@/types";

type TasteState = {
  /** 취향 테스트로 정한 「내 취향」 핀. 테스트 전에는 null */
  pin: (MapPosition & { at: number }) | null;
  /** 지도 위 「30초 테스트」 안내를 닫았는지 — 한 번 닫으면 다시 안 보인다 */
  hintClosed: boolean;
  setPin: (p: MapPosition) => void;
  closeHint: () => void;
};

/**
 * 내 취향 핀 · 테스트 안내 닫음. 다른 페이지 · 다음 방문에도 남는다 (06 기술서 8장).
 * @example useTasteStore.getState().setPin(pinFromAnswers(answers))
 */
export const useTasteStore = create<TasteState>()(
  persist(
    (set) => ({
      pin: null,
      hintClosed: false,
      setPin: (p) => set({ pin: { x: p.x, y: p.y, at: Date.now() } }),
      closeHint: () => set({ hintClosed: true }),
    }),
    { name: "kok-taste" },
  ),
);

const NO_PIN: Pick<TasteState, "pin" | "hintClosed"> = {
  pin: null,
  hintClosed: false,
};

/**
 * 핀 · 안내 닫음을 읽는다. 서버 렌더와 첫 화면은 「테스트 전」으로 그리고, 저장값을 읽은 뒤 바뀐다(hydration 불일치 방지).
 * @example const { pin, hintClosed } = useTaste();
 */
export function useTaste(): Pick<TasteState, "pin" | "hintClosed"> {
  return useSyncExternalStore(
    useTasteStore.subscribe,
    () => useTasteStore.getState(),
    () => NO_PIN,
  );
}
