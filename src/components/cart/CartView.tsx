"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductThumb } from "@/components/product/ProductThumb";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { cart as t } from "@/content/cart";
import { ui } from "@/content/ui";
import { getProduct } from "@/lib/catalog";
import { formatWon } from "@/lib/format";
import {
  FREE_SHIPPING_MIN,
  freeShippingLeft,
  lineTotal,
  shippingFee,
  subtotal,
} from "@/lib/price";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import type { CartItem, Grind, Product, Size } from "@/types";

/** 서버 렌더 · 첫 화면은 「아직 모름」(null) — 저장된 장바구니를 읽은 뒤 그린다(hydration 불일치 방지) */
const useItems = () =>
  useSyncExternalStore(
    useCart.subscribe,
    () => useCart.getState().items,
    () => null,
  );

/**
 * 장바구니 — 줄 선택 · 수량 · 삭제(되돌리기) · 결제 예정 금액 · 무료배송 막대 · 함께 담기 좋은 원두 (02 PRD 「장바구니」, 보드 Cart).
 * 결제 금액은 고른 줄만 더한다. 주문하기는 고른 줄을 주문서로 넘긴다(주문서가 checked 줄만 읽는다).
 * @example <CartView />
 */
export function CartView() {
  const items = useItems();
  const router = useRouter();
  const store = useCart.getState();

  const rows = (items ?? [])
    .map((item, index) => ({
      item,
      index,
      product: getProduct(item.productId),
    }))
    .filter((r): r is { item: CartItem; index: number; product: Product } =>
      Boolean(r.product),
    );
  const checked = rows.filter((r) => r.item.checked);
  const sub = subtotal(items ?? [], getProduct);
  const ship = shippingFee(sub);
  const left = freeShippingLeft(sub);
  const allChecked = rows.length > 0 && checked.length === rows.length;

  const removeWithUndo = (indexes: number[], text: string) => {
    const before = store.remove(indexes);
    useToast.getState().show({
      text,
      action: {
        label: ui.toast.undo,
        onClick: () => useCart.getState().restore(before),
      },
    });
  };

  const order = () => {
    if (!checked.length) {
      useToast.getState().show({ text: t.summary.orderNoneToast });
      return;
    }
    router.push("/checkout");
  };

  const s = t.summary;
  const recs = t.rec.productIds
    .map((id) => getProduct(id))
    .filter((p): p is Product => Boolean(p));

  return (
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <h1 className="m-0 mt-8 text-[28px] font-bold">
          {t.title}{" "}
          {items && <span className="text-primary">{rows.length}</span>}
        </h1>

        {items === null ? (
          // 저장된 장바구니를 읽는 짧은 순간 — 자리만 잡아 둔다
          <div className="mt-6 min-h-80" />
        ) : rows.length === 0 ? (
          <div className="mt-6 rounded-lg bg-surface px-6 py-20 text-center">
            <p className="m-0 text-lg font-bold">{t.empty.title}</p>
            <p className="mt-2 mb-0 text-sm text-muted">{t.empty.desc}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button href="/coffee" kind="primary">
                {t.empty.list}
              </Button>
              <Button href="/taste-test" kind="secondary">
                {t.empty.test}
              </Button>
            </div>
            <Button
              kind="text"
              className="mt-4"
              onClick={() =>
                t.empty.restoreItems.forEach((it) =>
                  useCart.getState().add({
                    productId: it.productId,
                    size: it.size as Size,
                    grind: it.grind as Grind,
                    qty: it.qty,
                  }),
                )
              }
            >
              {t.empty.restore}
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-start gap-8">
            <section
              aria-label={t.listLabel}
              className="min-w-0 flex-[999_1_560px]"
            >
              <div className="flex items-center justify-between border-b-2 border-ink py-3">
                <Checkbox
                  checked={allChecked}
                  onChange={() => store.toggleAll(!allChecked)}
                  className="min-h-11 text-base font-bold"
                >
                  {t.selectAll(checked.length, rows.length)}
                </Checkbox>
                <Button
                  kind="secondary"
                  size="sm"
                  onClick={() =>
                    checked.length &&
                    removeWithUndo(
                      checked.map((r) => r.index),
                      t.removedMany(checked.length),
                    )
                  }
                >
                  {t.removeChecked}
                </Button>
              </div>
              <ul className="m-0 list-none p-0">
                {rows.map(({ item, index, product }) => (
                  <li
                    key={`${item.productId}-${item.size}-${item.grind}`}
                    className="grid grid-cols-[auto_72px_1fr] items-start gap-3 border-b border-line-soft py-6 sm:grid-cols-[auto_96px_1fr_auto] sm:gap-4"
                  >
                    <Checkbox
                      checked={item.checked}
                      onChange={() => store.toggle(index)}
                      ariaLabel={t.check(product.title)}
                      className="-mx-0.5 mt-1 p-1"
                    />
                    <Link
                      href={`/coffee/${product.id}`}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="block"
                    >
                      <span className="block sm:hidden">
                        <ProductThumb src={product.image} size={72} />
                      </span>
                      <span className="hidden sm:block">
                        <ProductThumb src={product.image} size={96} />
                      </span>
                    </Link>
                    <div className="min-w-0">
                      <p className="m-0 text-sm text-muted">
                        {product.roastery}
                      </p>
                      <p className="mt-1 mb-0 text-base font-bold">
                        <Link
                          href={`/coffee/${product.id}`}
                          className="text-ink no-underline hover:underline"
                        >
                          {product.title}
                        </Link>
                      </p>
                      <p className="mt-2 mb-0 text-sm text-muted">
                        {t.option(
                          item.size,
                          ui.options.grindLabels[item.grind],
                        )}
                      </p>
                    </div>
                    <div className="col-span-2 col-start-2 flex items-center justify-between gap-3 sm:col-span-1 sm:col-start-auto sm:flex-col sm:items-end">
                      <QtyStepper
                        narrow
                        value={item.qty}
                        onChange={(q) => store.setQty(index, q)}
                        labels={{
                          dec: t.qtyDec(product.title),
                          inc: t.qtyInc(product.title),
                          qty: t.qty,
                        }}
                      />
                      <p className="m-0 text-lg font-bold">
                        {formatWon(lineTotal(product, item))}
                      </p>
                      <Button
                        kind="text"
                        aria-label={t.removeLabel(product.title)}
                        onClick={() =>
                          removeWithUndo([index], t.removed(product.title))
                        }
                      >
                        {t.remove}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <aside
              aria-label={s.label}
              className="min-w-0 flex-[1_1_320px] lg:sticky lg:top-21"
            >
              <div className="rounded-lg bg-surface p-6">
                <h2 className="m-0 text-lg font-bold">{s.title}</h2>
                <dl className="m-0 mt-4 grid grid-cols-[1fr_auto] gap-3 text-sm">
                  <dt>{s.subtotal}</dt>
                  <dd className="m-0 text-right">{formatWon(sub)}</dd>
                  <dt>{s.shipping}</dt>
                  <dd className="m-0 text-right">
                    {ship ? formatWon(ship) : s.free}
                  </dd>
                </dl>
                <div aria-live="polite" className="mt-4">
                  <p className="m-0 text-sm text-ink-2">
                    {sub === 0
                      ? s.noneSelected
                      : left > 0
                        ? s.freeLeft(formatWon(left))
                        : s.freeDone}
                  </p>
                  <div
                    role="progressbar"
                    aria-label={s.progressLabel}
                    aria-valuemin={0}
                    aria-valuemax={FREE_SHIPPING_MIN}
                    aria-valuenow={Math.min(sub, FREE_SHIPPING_MIN)}
                    className="mt-2 h-1.5 overflow-hidden rounded-[3px] bg-line"
                  >
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${Math.min(100, Math.round((sub / FREE_SHIPPING_MIN) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
                  <span className="font-bold">{s.total}</span>
                  <strong className="text-[26px] font-bold">
                    {formatWon(sub + ship)}
                  </strong>
                </div>
                <Button
                  kind="primary"
                  size="lg"
                  block
                  className="mt-5"
                  onClick={order}
                >
                  {checked.length ? s.order(checked.length) : s.orderNone}
                </Button>
                <p className="mt-2 mb-0 text-center text-xs text-muted">
                  {s.demo}
                </p>
                <Button href="/coffee" kind="secondary" block className="mt-2">
                  {s.continue}
                </Button>
              </div>
            </aside>
          </div>
        )}

        <section aria-labelledby="cart-rec" className="mt-18">
          <h2 id="cart-rec" className="m-0 text-[22px] font-bold">
            {t.rec.title}
          </h2>
          <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-x-3 gap-y-7 p-0 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-9">
            {recs.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
