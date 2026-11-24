import type { CartItem, Product, Size } from "@/types";

// 가격 규칙은 원본 kokewep 기준 (02 PRD 「가격 규칙」 · 「장바구니 데이터 규칙」)

/** 용량별로 200g 기준가에 더하는 금액 */
export const SIZE_EXTRA: Record<Size, number> = {
  "200g": 0,
  "500g": 4600,
  "1kg": 11000,
};

export const SHIPPING_FEE = 2500;
/** 고른 상품 합계가 이 금액 이상이면 배송비 무료 */
export const FREE_SHIPPING_MIN = 30000;
export const QTY_MIN = 1;
/** 같은 상품 · 같은 옵션 한 줄의 최대 수량 */
export const QTY_MAX = 20;

/**
 * 수량을 1–20 안으로 맞춘다. 수량 버튼 · 장바구니 담기에서 쓴다.
 * @example clampQty(25) // 20
 */
export function clampQty(qty: number): number {
  return Math.min(QTY_MAX, Math.max(QTY_MIN, Math.round(qty)));
}

/**
 * 용량을 반영한 한 개 가격.
 * @example unitPrice(product, "500g") // product.price + 4600
 */
export function unitPrice(product: Pick<Product, "price">, size: Size): number {
  return product.price + SIZE_EXTRA[size];
}

/**
 * 장바구니 한 줄 금액 (한 개 가격 × 수량).
 * @example lineTotal(product, item)
 */
export function lineTotal(
  product: Pick<Product, "price">,
  item: Pick<CartItem, "size" | "qty">,
): number {
  return unitPrice(product, item.size) * item.qty;
}

/**
 * 고른 줄(checked)만 더한 상품 합계. 상품 데이터에 없는 줄은 0으로 친다.
 * 주문서처럼 고른 줄만 넘길 때는 checked가 모두 true인 배열을 넘긴다.
 * @example subtotal(items, getProduct)
 */
export function subtotal(
  items: CartItem[],
  findProduct: (id: string) => Pick<Product, "price"> | undefined,
): number {
  return items.reduce((sum, item) => {
    if (!item.checked) return sum;
    const product = findProduct(item.productId);
    return product ? sum + lineTotal(product, item) : sum;
  }, 0);
}

/**
 * 배송비. 고른 상품이 없으면 0, 3만 원 이상이면 무료.
 * @example shippingFee(28000) // 2500
 */
export function shippingFee(sub: number): number {
  return sub === 0 || sub >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
}

/**
 * 무료배송까지 남은 금액 (0 이상). 장바구니 진행 막대에 쓴다.
 * @example freeShippingLeft(28000) // 2000
 */
export function freeShippingLeft(sub: number): number {
  return Math.max(FREE_SHIPPING_MIN - sub, 0);
}
