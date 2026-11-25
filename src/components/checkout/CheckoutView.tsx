"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ProductThumb } from "@/components/product/ProductThumb";
import { Button } from "@/components/ui/Button";
import { ButtonPair } from "@/components/ui/ButtonPair";
import { Checkbox } from "@/components/ui/Checkbox";
import { OptionGroup } from "@/components/ui/OptionButton";
import { checkout as t } from "@/content/checkout";
import { ui } from "@/content/ui";
import { getProduct } from "@/lib/catalog";
import { formatPhone, formatWon } from "@/lib/format";
import { lineTotal, shippingFee, subtotal } from "@/lib/price";
import { useCart } from "@/store/cart";
import { orderNumber, useOrder, type PayMethod } from "@/store/order";
import type { CartItem, Product } from "@/types";

/** 결제 중 기다리는 시간 — 데모라 실제 결제 대신 잠깐 「결제 중…」을 보인다 (프로토타입 값) */
const PAYING_MS = 1500;
const FIELDS = ["name", "phone", "addr", "addr2"] as const;
type Field = (typeof FIELDS)[number];
type ErrorKey = Field | "agree";
const PHONE = /^01[016789]-\d{3,4}-\d{4}$/;

const withoutKey = <T extends object>(o: T, k: keyof T): T => {
  const next = { ...o };
  delete next[k];
  return next;
};

const useItems = () =>
  useSyncExternalStore(
    useCart.subscribe,
    () => useCart.getState().items,
    () => null,
  );

/** 오류 글 앞 아이콘 (05 「입력 › 오류」 — 색만으로 알리지 않는다) */
function ErrorText({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="m-0 mt-2 flex items-center gap-1 text-sm text-error">
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5M12 16.5v.01" />
      </svg>
      {children}
    </p>
  );
}

/**
 * 주문서 — 주문 상품 · 받는 분 · 결제 수단 · 약관 동의 · 결제 금액 (02 PRD 「주문서」, 보드 Checkout).
 * 장바구니에서 고른 줄만 주문한다. 결제하기를 누르면 칸마다 검사하고 첫 오류 칸으로 초점을 옮긴다.
 * 데모라 실제 결제 없이 주문을 저장하고, 주문한 줄을 장바구니에서 뺀 뒤 주문 완료로 간다.
 * @example <CheckoutView />
 */
export function CheckoutView() {
  const items = useItems();
  const router = useRouter();
  const [form, setForm] = useState<Record<Field, string>>({
    name: "",
    phone: "",
    addr: "",
    addr2: "",
  });
  const [agree, setAgree] = useState<[boolean, boolean]>([false, false]);
  const [pay, setPay] = useState<PayMethod>("card");
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [paying, setPaying] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const rows = (items ?? [])
    .filter((i) => i.checked)
    .map((item) => ({ item, product: getProduct(item.productId) }))
    .filter((r): r is { item: CartItem; product: Product } =>
      Boolean(r.product),
    );
  const sub = subtotal(
    rows.map((r) => r.item),
    getProduct,
  );
  const ship = shippingFee(sub);

  const check = (f: Record<Field, string>, ag: [boolean, boolean]) => {
    const e: Partial<Record<ErrorKey, string>> = {};
    if (!f.name.trim()) e.name = t.errors.name;
    if (!PHONE.test(f.phone)) e.phone = t.errors.phone;
    if (!f.addr.trim()) e.addr = t.errors.addr;
    if (!f.addr2.trim()) e.addr2 = t.errors.addr2;
    if (!(ag[0] && ag[1])) e.agree = t.errors.agree;
    return e;
  };

  // 고치면 그 칸의 오류만 사라진다 (05 「입력 › 오류」)
  const setField = (k: Field, raw: string) => {
    const v = k === "phone" ? formatPhone(raw) : raw;
    const next = { ...form, [k]: v };
    setForm(next);
    if (errors[k] && !check(next, agree)[k])
      setErrors((prev) => withoutKey(prev, k));
  };
  const setAgreeAll = (ag: [boolean, boolean]) => {
    setAgree(ag);
    if (ag[0] && ag[1]) setErrors((prev) => withoutKey(prev, "agree"));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (paying) return;
    const er = check(form, agree);
    setErrors(er);
    const first = ([...FIELDS, "agree"] as ErrorKey[]).find((k) => er[k]);
    if (first) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>(`#checkout-${first}`)
          ?.focus(),
      );
      return;
    }
    setPaying(true);
    window.setTimeout(() => {
      useOrder.getState().place({
        no: orderNumber(new Date()),
        name: form.name.trim(),
        phone: form.phone,
        address: `${form.addr.trim()} ${form.addr2.trim()}`,
        pay,
        subtotal: sub,
        shipping: ship,
        items: rows.map(({ item }) => ({
          productId: item.productId,
          size: item.size,
          grind: item.grind,
          qty: item.qty,
        })),
      });
      const cart = useCart.getState();
      cart.restore(cart.items.filter((i) => !i.checked));
      router.push("/order/complete");
    }, PAYING_MS);
  };

  const r = t.receiver;
  const s = t.summary;
  const field = (k: Field, opts: { full?: boolean; type?: string } = {}) => {
    const err = errors[k];
    const meta = r[k];
    return (
      <div className={opts.full ? "sm:col-span-2" : undefined}>
        <label
          htmlFor={`checkout-${k}`}
          className="mb-2 block text-sm font-bold"
        >
          {meta.label}
          <span aria-hidden="true" className="ml-1 text-error">
            *
          </span>
        </label>
        <input
          id={`checkout-${k}`}
          type={opts.type ?? "text"}
          value={form[k]}
          onChange={(e) => setField(k, e.target.value)}
          placeholder={meta.placeholder}
          aria-required="true"
          aria-invalid={Boolean(err)}
          aria-describedby={err ? `checkout-${k}-e` : undefined}
          autoComplete={
            k === "name"
              ? "name"
              : k === "phone"
                ? "tel"
                : k === "addr"
                  ? "street-address"
                  : undefined
          }
          inputMode={k === "phone" ? "numeric" : undefined}
          className="box-border h-11 w-full rounded-lg border border-line-control bg-bg px-4 text-base text-ink placeholder:text-muted hover:not-focus:border-ink focus:border-ink focus:shadow-[0_0_0_3px_rgba(23,32,27,.12)] focus:outline-none aria-invalid:border-error aria-invalid:focus:shadow-[0_0_0_3px_rgba(184,50,29,.16)]"
        />
        {err && <ErrorText id={`checkout-${k}-e`}>{err}</ErrorText>}
      </div>
    );
  };

  const sec =
    "rounded-2xl border border-line bg-bg px-4 py-5 sm:p-6 [&>h2]:m-0 [&>h2]:text-lg [&>h2]:font-extrabold";

  return (
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <nav aria-label={t.steps.label} className="mt-8 text-sm text-muted">
          <Link href="/cart" className="text-muted">
            {t.steps.cart}
          </Link>{" "}
          <span aria-hidden="true">›</span>{" "}
          <strong aria-current="step" className="text-ink">
            {t.steps.checkout}
          </strong>{" "}
          <span aria-hidden="true">›</span> {t.steps.complete}
        </nav>
        <h1 className="m-0 mt-2 text-[28px] font-bold">{t.title}</h1>

        {items === null ? (
          <div className="mt-6 min-h-100" />
        ) : rows.length === 0 ? (
          <div className="mt-6 rounded-md bg-surface px-6 py-20 text-center">
            <p className="m-0 text-lg font-bold">{t.empty.title}</p>
            <p className="mt-2 mb-0 text-sm text-muted">{t.empty.desc}</p>
            <ButtonPair className="mt-5 justify-center">
              <Button href="/cart" kind="secondary">
                {t.empty.cart}
              </Button>
              <Button href="/coffee" kind="primary">
                {t.empty.list}
              </Button>
            </ButtonPair>
          </div>
        ) : (
          <form
            ref={formRef}
            noValidate
            onSubmit={submit}
            className="mt-6 flex flex-wrap items-start gap-8 max-sm:pb-24"
          >
            <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
              <section aria-labelledby="checkout-h1" className={sec}>
                <h2 id="checkout-h1">{t.items(rows.length)}</h2>
                <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                  {rows.map(({ item, product }) => (
                    <li
                      key={`${item.productId}-${item.size}-${item.grind}`}
                      className="grid grid-cols-[64px_1fr_auto] items-center gap-3"
                    >
                      <ProductThumb src={product.image} size={64} />
                      <div className="min-w-0">
                        <p className="m-0 text-sm text-muted">
                          {product.roastery}
                        </p>
                        <p className="mt-1 mb-0 text-base font-bold">
                          {product.title}
                        </p>
                        <p className="mt-1 mb-0 text-sm text-muted">
                          {t.itemLine(
                            `${item.size}, ${ui.options.grindLabels[item.grind]}`,
                            item.qty,
                          )}
                        </p>
                      </div>
                      <p className="m-0 text-base font-bold">
                        {formatWon(lineTotal(product, item))}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="checkout-h2" className={sec}>
                <h2 id="checkout-h2">{r.title}</h2>
                <p className="mt-2 mb-0 text-sm text-muted">
                  <span aria-hidden="true" className="ml-1 text-error">
                    *
                  </span>{" "}
                  {r.requiredNote}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {field("name")}
                  {field("phone", { type: "tel" })}
                  {field("addr", { full: true })}
                  {field("addr2", { full: true })}
                </div>
              </section>

              <section aria-labelledby="checkout-h3" className={sec}>
                <h2 id="checkout-h3">{t.pay.title}</h2>
                <OptionGroup
                  fill
                  labelledBy="checkout-h3"
                  options={(Object.keys(t.pay.options) as PayMethod[]).map(
                    (k) => ({ key: k, label: t.pay.options[k] }),
                  )}
                  value={pay}
                  onChange={setPay}
                  className="mt-4"
                />
              </section>

              <section aria-labelledby="checkout-h4" className={sec}>
                <h2 id="checkout-h4" className="mb-3!">
                  {t.agree.title}
                </h2>
                <div className="mb-1 border-b border-line pb-2">
                  <Checkbox
                    id="checkout-agree"
                    checked={agree[0] && agree[1]}
                    onChange={() => {
                      const all = !(agree[0] && agree[1]);
                      setAgreeAll([all, all]);
                    }}
                    describedBy={errors.agree ? "checkout-agree-e" : undefined}
                    className="min-h-11 text-base font-bold"
                  >
                    {t.agree.all}
                  </Checkbox>
                </div>
                {t.agree.items.map((label, i) => (
                  <Checkbox
                    key={label}
                    checked={agree[i]}
                    onChange={() =>
                      setAgreeAll(
                        agree.map((v, j) => (j === i ? !v : v)) as [
                          boolean,
                          boolean,
                        ],
                      )
                    }
                    className="min-h-11 text-sm"
                  >
                    {label}
                  </Checkbox>
                ))}
                {errors.agree && (
                  <ErrorText id="checkout-agree-e">{errors.agree}</ErrorText>
                )}
              </section>
            </div>

            <aside
              aria-label={s.label}
              className="min-w-0 flex-[1_1_320px] max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:z-20 lg:sticky lg:top-21"
            >
              {/* 모바일은 화면 아래 고정 줄 — 합계와 결제하기만 */}
              <div className="rounded-md bg-surface p-6 max-sm:grid max-sm:grid-cols-[auto_1fr] max-sm:items-center max-sm:gap-3 max-sm:rounded-none max-sm:border-t max-sm:border-line max-sm:bg-bg max-sm:px-4 max-sm:pt-3 max-sm:pb-[calc(12px+env(safe-area-inset-bottom))] max-sm:shadow-[0_-8px_24px_rgba(23,32,27,.08)]">
                <h2 className="m-0 text-lg font-bold max-sm:hidden">
                  {s.title}
                </h2>
                <dl className="m-0 mt-4 grid grid-cols-[1fr_auto] gap-3 text-sm max-sm:hidden">
                  <dt>{s.subtotal}</dt>
                  <dd className="m-0 text-right">{formatWon(sub)}</dd>
                  <dt>{s.shipping}</dt>
                  <dd className="m-0 text-right">
                    {ship ? formatWon(ship) : s.free}
                  </dd>
                </dl>
                <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4 max-sm:m-0 max-sm:flex-col max-sm:items-start max-sm:border-0 max-sm:p-0">
                  <span className="font-bold max-sm:text-xs max-sm:font-normal max-sm:text-muted">
                    {s.total}
                  </span>
                  <strong className="text-[26px] font-bold max-sm:text-xl">
                    {formatWon(sub + ship)}
                  </strong>
                </div>
                <Button
                  type="submit"
                  kind="primary"
                  size="lg"
                  block
                  disabled={paying}
                  className="mt-5 max-sm:mt-0"
                >
                  {paying ? s.paying : s.pay(formatWon(sub + ship))}
                </Button>
                <p className="mt-2 mb-0 text-center text-xs text-muted max-sm:hidden">
                  {s.demo}
                </p>
              </div>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}
