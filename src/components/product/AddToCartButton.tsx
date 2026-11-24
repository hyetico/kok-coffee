"use client";

import { CartIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { ui } from "@/content/ui";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";

type AddToCartButtonProps = {
  productId: string;
  title: string;
  /** card: 카드 아래 작은 버튼(꽉 채움, 36) · panel: 맛 지도 고른 원두 · 목록 지도 카드(40) · compact: 글 아래 작은 버튼(36, 내용 폭) */
  variant?: "card" | "panel" | "compact";
  /** panel 높이 — 메인 맛 지도 40(기본), 목록 지도 카드 44 (보드 측정값) */
  panelSize?: "panel" | "md";
};

/**
 * 200g · 홀빈으로 한 개 담고 알림을 띄운다. 옵션을 고르는 담기는 상세 페이지에서.
 * 같은 「담기」 글자가 여러 개라 읽는 이름에 상품명을 넣는다 (CLAUDE.md 7장).
 * @example <AddToCartButton productId="p1" title="스프링 블렌드" />
 */
export function AddToCartButton({
  productId,
  title,
  variant = "card",
  panelSize = "panel",
}: AddToCartButtonProps) {
  const add = () => {
    useCart.getState().add({ productId, size: "200g", grind: "whole", qty: 1 });
    useToast.getState().show({
      text: ui.toast.added(title),
      link: { href: "/cart", label: ui.toast.viewCart },
    });
  };
  // 「담기」는 어디서나 보조 버튼 + 아이콘 (05 「담기」 버튼). 지도 패널은 높이 40
  if (variant === "panel")
    return (
      <Button
        kind="secondary"
        onClick={add}
        aria-label={ui.product.addLabel(title)}
        size={panelSize}
      >
        <CartIcon size={16} />
        {ui.product.add}
      </Button>
    );
  return (
    <Button
      kind="secondary"
      size="sm"
      block={variant === "card"}
      onClick={add}
      aria-label={ui.product.addLabel(title)}
      className={variant === "card" ? "mt-3" : undefined}
    >
      <CartIcon size={16} />
      {ui.product.add}
    </Button>
  );
}
