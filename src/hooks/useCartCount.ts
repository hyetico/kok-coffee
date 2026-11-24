"use client";

import { useSyncExternalStore } from "react";
import { useCart } from "@/store/cart";

/**
 * 장바구니 줄 수. 서버 렌더와 첫 화면에서는 0을 쓰고, 브라우저 저장값을 읽은 뒤 실제 수로 바뀐다(hydration 불일치 방지).
 * @example const count = useCartCount();
 */
export function useCartCount(): number {
  return useSyncExternalStore(
    useCart.subscribe,
    () => useCart.getState().items.length,
    () => 0,
  );
}
