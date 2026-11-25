"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ProductThumb } from "@/components/product/ProductThumb";
import { Button } from "@/components/ui/Button";
import { ButtonPair } from "@/components/ui/ButtonPair";
import { checkout, complete as t } from "@/content/checkout";
import { ui } from "@/content/ui";
import { getProduct } from "@/lib/catalog";
import { formatWon } from "@/lib/format";
import { lineTotal } from "@/lib/price";
import { useLastOrder } from "@/store/order";

/**
 * 주문 완료 — 주문 번호 · 받는 분 · 배송지 · 결제 수단 · 결제 금액 · 주문한 원두 (보드 Complete).
 * 마지막 주문이 없으면(주소로 바로 들어옴) 장바구니로 보낸다. 들어오면 제목으로 초점을 옮겨 완료를 읽게 한다.
 * @example <CompleteView />
 */
export function CompleteView() {
  const order = useLastOrder();
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (order === null) router.replace("/cart");
    else if (order) headingRef.current?.focus();
  }, [order, router]);

  if (!order) return <main id="main" className="min-h-100 flex-1" />;

  return (
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <div className="mx-auto mt-8 max-w-160 text-center sm:mt-12">
          <span className="inline-grid size-16 place-items-center rounded-full bg-primary text-white">
            <svg
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="m-0 mt-5 text-[28px] font-bold outline-none"
          >
            {t.title}
          </h1>
          <p className="mt-2 mb-0 text-base text-muted">{t.desc}</p>

          <dl className="m-0 mt-8 grid grid-cols-1 gap-1 rounded-2xl border border-line px-4 py-5 text-left text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6 sm:gap-y-3 sm:p-6 [&>dd]:m-0 [&>dd]:font-medium [&>dd]:[word-break:keep-all] max-sm:[&>dd]:mb-2 [&>dt]:text-muted">
            <dt>{t.no}</dt>
            <dd>{order.no}</dd>
            <dt>{t.receiver}</dt>
            <dd>{t.receiverValue(order.name, order.phone)}</dd>
            <dt>{t.address}</dt>
            <dd>{order.address}</dd>
            <dt>{t.pay}</dt>
            <dd>{checkout.pay.options[order.pay]}</dd>
            <dt>{t.total}</dt>
            <dd className="text-lg font-bold">
              {formatWon(order.subtotal + order.shipping)}
            </dd>
          </dl>

          <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0 text-left">
            {order.items.map((item) => {
              const product = getProduct(item.productId);
              if (!product) return null;
              return (
                <li
                  key={`${item.productId}-${item.size}-${item.grind}`}
                  className="grid grid-cols-[56px_1fr_auto] items-center gap-3"
                >
                  <ProductThumb src={product.image} size={56} />
                  <div className="min-w-0">
                    <p className="m-0 text-sm text-muted">{product.roastery}</p>
                    <p className="mt-1 mb-0 text-base font-bold">
                      {product.title}
                    </p>
                    <p className="mt-1 mb-0 text-sm text-muted">
                      {checkout.itemLine(
                        `${item.size}, ${ui.options.grindLabels[item.grind]}`,
                        item.qty,
                      )}
                    </p>
                  </div>
                  <p className="m-0 font-bold">
                    {formatWon(lineTotal(product, item))}
                  </p>
                </li>
              );
            })}
          </ul>

          <ButtonPair className="mt-8 justify-center">
            <Button href="/coffee" kind="secondary" size="lg">
              {t.continue}
            </Button>
            <Button href="/" kind="primary" size="lg">
              {t.home}
            </Button>
          </ButtonPair>
        </div>
      </div>
    </main>
  );
}
