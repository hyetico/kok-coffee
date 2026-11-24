"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clampQty } from "@/lib/price";
import type { CartItem } from "@/types";

type NewItem = Omit<CartItem, "checked">;

type CartState = {
  items: CartItem[];
  /** 같은 상품 · 같은 옵션이면 수량만 늘린다 (최대 20). 새 줄은 선택된 채로 들어간다 */
  add: (item: NewItem) => void;
  setQty: (index: number, qty: number) => void;
  toggle: (index: number) => void;
  toggleAll: (checked: boolean) => void;
  /** 지운 줄을 되돌리기 위해 지우기 전 목록을 돌려준다 */
  remove: (indexes: number[]) => CartItem[];
  restore: (items: CartItem[]) => void;
};

const sameLine = (a: NewItem, b: NewItem) =>
  a.productId === b.productId && a.size === b.size && a.grind === b.grind;

/**
 * 장바구니. 가격은 저장하지 않고 lib/price.ts로 계산한다. localStorage에 남아 새로고침해도 유지된다.
 * 서버 렌더와 첫 화면이 어긋나지 않게, 개수를 보여 줄 때는 useCartCount를 쓴다.
 * @example useCart.getState().add({ productId: "p1", size: "200g", grind: "whole", qty: 1 })
 */
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set(({ items }) => {
          const i = items.findIndex((x) => sameLine(x, item));
          if (i === -1)
            return {
              items: [
                ...items,
                { ...item, qty: clampQty(item.qty), checked: true },
              ],
            };
          return {
            items: items.map((x, j) =>
              j === i ? { ...x, qty: clampQty(x.qty + item.qty) } : x,
            ),
          };
        }),
      setQty: (index, qty) =>
        set(({ items }) => ({
          items: items.map((x, j) =>
            j === index ? { ...x, qty: clampQty(qty) } : x,
          ),
        })),
      toggle: (index) =>
        set(({ items }) => ({
          items: items.map((x, j) =>
            j === index ? { ...x, checked: !x.checked } : x,
          ),
        })),
      toggleAll: (checked) =>
        set(({ items }) => ({ items: items.map((x) => ({ ...x, checked })) })),
      remove: (indexes) => {
        const before = get().items;
        set({ items: before.filter((_, j) => !indexes.includes(j)) });
        return before;
      },
      restore: (items) => set({ items }),
    }),
    { name: "koke-cart" },
  ),
);
