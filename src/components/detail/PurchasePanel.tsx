"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { OptionGroup } from "@/components/ui/OptionButton";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { detail } from "@/content/detail";
import { ui } from "@/content/ui";
import { formatWon } from "@/lib/format";
import { SIZE_EXTRA, unitPrice } from "@/lib/price";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import type { Grind, Size } from "@/types";

const SIZES: Size[] = ["200g", "500g", "1kg"];
const GRINDS: Grind[] = [
  "whole",
  "coffee-maker",
  "espresso",
  "french-press",
  "hand-drip",
  "moka-pot",
];

const noop = () => () => {};
/** 브라우저에서만 true — 아래 고정 막대를 body 끝에 붙일 때 쓴다 */
const useMounted = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

type PurchasePanelProps = {
  productId: string;
  title: string;
  price: number;
};

/**
 * 용량 · 분쇄 · 수량을 고르고 합계를 보여 주는 구매 영역. 640px 이하에서는 아래 버튼 대신 화면 아래 고정 막대를 쓴다.
 * 「바로 구매」는 이 상품 · 옵션만 골라 둔 채 주문서로 간다 (04 문서 10장).
 * @example <PurchasePanel productId="p1" title="스프링 블렌드" price={12000} />
 */
export function PurchasePanel({ productId, title, price }: PurchasePanelProps) {
  const router = useRouter();
  const mounted = useMounted();
  const [size, setSize] = useState<Size>("200g");
  const [grind, setGrind] = useState<Grind>("whole");
  const [qty, setQty] = useState(1);

  const summary = detail.actions.summary(
    ui.options.sizeLabels[size],
    ui.options.grindLabels[grind],
    qty,
  );
  const total = formatWon(unitPrice({ price }, size) * qty);

  const addToCart = () => {
    useCart.getState().add({ productId, size, grind, qty });
    useToast.getState().show({
      text: detail.actions.added(summary),
      link: { href: "/cart", label: ui.toast.viewCart },
    });
  };
  const buyNow = () => {
    useCart.getState().buyNow({ productId, size, grind, qty });
    router.push("/checkout");
  };

  return (
    <div className="mt-7 border-t border-line-soft pt-6">
      <p id="detail-size" className="m-0 text-sm font-bold">
        {detail.options.size}
      </p>
      <OptionGroup
        labelledBy="detail-size"
        className="mt-2.5"
        value={size}
        onChange={setSize}
        options={SIZES.map((s) => ({
          key: s,
          label: ui.options.sizeLabels[s],
          extra: SIZE_EXTRA[s] ? `+${formatWon(SIZE_EXTRA[s])}` : undefined,
        }))}
      />
      <p id="detail-grind" className="mt-5 mb-0 text-sm font-bold">
        {detail.options.grind}
      </p>
      <OptionGroup
        labelledBy="detail-grind"
        className="mt-2.5"
        value={grind}
        onChange={setGrind}
        options={GRINDS.map((g) => ({
          key: g,
          label: ui.options.grindLabels[g],
        }))}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-md bg-surface p-4.5">
        <QtyStepper
          value={qty}
          onChange={setQty}
          labels={{
            dec: detail.options.qtyDec,
            inc: detail.options.qtyInc,
            qty: detail.options.qty,
          }}
        />
        <div aria-live="polite" className="text-right">
          <p className="m-0 text-sm text-muted">{summary}</p>
          <p className="mt-1 mb-0 text-2xl font-bold">{total}</p>
        </div>
      </div>

      <div className="mt-4 hidden gap-2 sm:flex">
        <Button
          kind="secondary"
          size="lg"
          onClick={addToCart}
          className="flex-1"
        >
          {detail.actions.addToCart}
        </Button>
        <Button kind="primary" size="lg" onClick={buyNow} className="flex-1">
          {detail.actions.buyNow}
        </Button>
      </div>

      {/* 모바일 아래 고정 구매 막대 — 푸터보다 뒤(body 끝)에 붙여 페이지 끝까지 따라오게 한다 */}
      {mounted &&
        createPortal(
          <div className="sticky bottom-0 z-6 flex items-center gap-2 border-t border-line-soft bg-bg px-4 py-3 sm:hidden">
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-xs text-muted">{summary}</p>
              <p className="mt-0.5 mb-0 text-lg font-bold">{total}</p>
            </div>
            <Button
              kind="secondary"
              onClick={addToCart}
              aria-label={`${title} ${detail.actions.addToCart}`}
            >
              {detail.actions.addShort}
            </Button>
            <Button kind="primary" onClick={buyNow}>
              {detail.actions.buyNow}
            </Button>
          </div>,
          document.body,
        )}
    </div>
  );
}
