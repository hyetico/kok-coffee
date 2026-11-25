import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/detail/Gallery";
import { PurchasePanel } from "@/components/detail/PurchasePanel";
import { ProductCard } from "@/components/product/ProductCard";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { detail } from "@/content/detail";
import { site } from "@/content/site";
import { navItems } from "@/content/ui";
import { coffeeNote, relatedProducts } from "@/lib/coffeeNote";
import { getAllProducts, getProduct } from "@/lib/catalog";
import { formatWon } from "@/lib/format";
import { roasteryOf } from "@/lib/roastery";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export default async function CoffeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const note = coffeeNote(product);
  const related = relatedProducts(product);
  const roastery = roasteryOf(product);
  const listLabel = navItems.find((n) => n.key === "coffee")?.label;
  const crumb =
    "-mx-1.5 -my-0.75 inline-block px-2 py-1 text-muted no-underline hover:text-ink";

  const infoPanel = (
    <div className="mx-auto max-w-205">
      <div className="rounded-xl bg-surface px-8 py-10 text-center">
        <Tag tone="brand">{detail.note.badge}</Tag>
        <p className="mt-4 mb-0 text-sm text-muted">{product.roastery}</p>
        <h2 className="mt-2 mb-0 text-[30px] font-bold tracking-[-0.03em]">
          {product.title}
        </h2>
        <p className="mx-auto mt-4 mb-0 max-w-[34em] text-base leading-[1.8] text-ink-2">
          {note.intro}
        </p>
        <Image
          src={note.images[0]}
          alt=""
          width={320}
          height={320}
          className="mx-auto mt-7 block aspect-square w-[min(320px,70%)] object-contain mix-blend-multiply"
        />
      </div>
      <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-3">
        {note.cards.map((c) => (
          <li key={c.k} className="rounded-xl border border-line p-6">
            <p className="m-0 text-sm text-muted">{c.k}</p>
            <p className="mt-2 mb-0 text-xl font-bold">{c.v}</p>
            {/* 설명이 없는 낱말도 빈 줄(위 여백 8)을 남긴다 — 보드와 같은 카드 높이 */}
            <p className="mt-2 mb-0 text-sm leading-[1.7] text-ink-2">{c.d}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-xl border border-line p-7">
        <h3 className="m-0 text-lg font-bold">{detail.note.brewTitle}</h3>
        <div
          role="table"
          aria-label={detail.note.brewTitle}
          className="mt-4 overflow-x-auto text-sm [scrollbar-color:var(--color-footer-line)_transparent] [scrollbar-width:thin]"
        >
          <div
            role="row"
            className="grid min-w-130 grid-cols-[1.2fr_1fr_.7fr_1.3fr_1.2fr] gap-3 border-b border-ink font-bold"
          >
            {detail.note.brewHead.map((h) => (
              <span key={h} role="columnheader" className="py-3">
                {h}
              </span>
            ))}
          </div>
          {note.brew.map((row) => (
            <div
              key={row[0]}
              role="row"
              className="grid min-w-130 grid-cols-[1.2fr_1fr_.7fr_1.3fr_1.2fr] gap-3 border-b border-line-soft"
            >
              {row.map((cell, i) => (
                <span
                  key={i}
                  role="cell"
                  className={`py-3 ${i === 0 ? "font-semibold" : ""}`}
                >
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-surface p-7">
        <h3 className="m-0 text-lg font-bold">{detail.note.infoTitle}</h3>
        <dl className="m-0 mt-4 grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-base">
          {note.info.map((f) => (
            <div key={f.k} className="contents">
              <dt className="text-muted">{f.k}</dt>
              <dd className="m-0">{f.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 mb-0 text-sm leading-[1.7] text-muted">
          {detail.note.disclaimer}
        </p>
      </div>
    </div>
  );

  const s = detail.shipping;
  const shippingPanel = (
    <div className="mx-auto grid max-w-205 gap-4 text-sm leading-[1.75]">
      <div className="rounded-lg bg-surface p-6">
        <h2 className="m-0 text-lg font-bold">{s.sameDayTitle}</h2>
        <p className="mt-2 mb-0">{s.sameDayLead}</p>
        <ul className="mt-2 mb-0 list-disc pl-5">
          {s.sameDayItems.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-line-soft p-6">
        <h2 className="m-0 text-lg font-bold">{s.returnTitle}</h2>
        <p className="mt-2 mb-0">{s.returnBody}</p>
        <p className="mt-2 mb-0">{s.returnContact(site.support.phone)}</p>
      </div>
    </div>
  );

  return (
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <nav
          aria-label={detail.breadcrumbLabel}
          className="mt-6 text-sm text-muted"
        >
          <Link href="/" className={crumb}>
            {navItems[0].label}
          </Link>{" "}
          <span aria-hidden="true">/</span>{" "}
          <Link href="/coffee" className={crumb}>
            {listLabel}
          </Link>{" "}
          <span aria-hidden="true">/</span>{" "}
          <span aria-current="page">{product.title}</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-start gap-6 sm:gap-12">
          <div className="min-w-0 flex-[1_1_420px] lg:sticky lg:top-21">
            <Gallery title={product.title} images={note.images} />
          </div>
          <div className="min-w-0 flex-[1_1_420px]">
            <p className="m-0 flex items-center gap-2 text-sm text-muted">
              <Image
                src={product.roasteryLogo}
                alt=""
                width={28}
                height={28}
                className="size-7 shrink-0 rounded-full bg-bg object-contain p-px shadow-[0_0_0_1px_var(--color-line)]"
              />
              {/* 「함께하는 로스터리」에 있는 곳만 소개 페이지가 있다 — 이름으로도 찾는다 (lib/roastery.ts) */}
              {roastery ? (
                <Link
                  href={`/roasteries/${roastery.id}`}
                  className="-my-0.5 inline-block py-1 text-muted"
                >
                  {product.roastery}
                </Link>
              ) : (
                product.roastery
              )}
            </p>
            <h1 className="mt-3 mb-0 text-[28px] leading-[1.35] font-bold tracking-[-0.03em]">
              {product.title}
            </h1>
            <p className="mt-3 mb-0 flex gap-2">
              {note.notes.map((n) => (
                <Tag key={n}>{n}</Tag>
              ))}
            </p>
            <p className="mt-5 mb-0 text-[26px] font-bold">
              {formatWon(product.price)}
              <span className="ml-2 text-sm font-medium text-muted">
                {detail.basePriceNote}
              </span>
            </p>
            <dl className="m-0 mt-6 grid grid-cols-[88px_1fr] gap-x-3 gap-y-3 text-sm">
              {note.facts.map((f) => (
                <div key={f.k} className="contents">
                  <dt className="text-muted">{f.k}</dt>
                  <dd className="m-0">{f.v}</dd>
                </div>
              ))}
            </dl>

            <section
              aria-labelledby="detail-profile"
              className="mt-6 rounded-xl border border-line p-5"
            >
              <h2 id="detail-profile" className="m-0 text-sm font-bold">
                {detail.profile.title}{" "}
                <span className="font-medium text-muted">
                  {note.profileNote}
                </span>
              </h2>
              <dl className="m-0 mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {note.profile.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <dt className="basis-12 shrink-0 text-ink-2">{f.label}</dt>
                    <dd className="m-0 flex flex-1 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft"
                      >
                        <span
                          className="block h-full bg-primary"
                          style={{ width: `${f.value * 20}%` }}
                        />
                      </span>
                      <span className="shrink-0 font-bold">{f.value}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 mb-0 text-sm">
                <span className="text-ink-2">{detail.profile.roast}</span>
                <strong className="ml-3">{note.roast.label}</strong>
              </p>
            </section>

            <PurchasePanel
              productId={product.id}
              title={product.title}
              price={product.price}
            />
          </div>
        </div>

        <Tabs
          label={detail.tabsLabel}
          tabs={detail.tabs}
          panels={[infoPanel, shippingPanel]}
          // 탭 줄은 헤더 아래에 붙는다 (03 「상세」)
          listClassName="sticky top-14 z-3 mt-18 lg:top-15"
          panelClassName="pt-8"
        />

        <section aria-labelledby="detail-related" className="mt-20">
          <h2 id="detail-related" className="m-0 text-[22px] font-bold">
            {detail.relatedTitle}
          </h2>
          <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4">
            {related.map((p) => (
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
