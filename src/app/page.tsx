import Image from "next/image";
import Link from "next/link";
import { BestSection, ProductGrid } from "@/components/home/BestSection";
import { TasteMap } from "@/components/taste-map/TasteMap";
import { Button } from "@/components/ui/Button";
import { ButtonPair } from "@/components/ui/ButtonPair";
import { MoreLink } from "@/components/ui/MoreLink";
import { home } from "@/content/home";
import { ui } from "@/content/ui";
import {
  getProduct,
  getRoasteries,
  listedProducts,
  mappedProducts,
} from "@/lib/catalog";
import type { Product } from "@/types";

const byIds = (ids: readonly string[]) =>
  ids.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));

function SectionHead({
  id,
  title,
  href,
}: {
  id: string;
  title: string;
  href: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2
        id={id}
        className="m-0 text-[22px] font-bold tracking-[-0.03em] sm:text-[26px]"
      >
        {title}
      </h2>
      <MoreLink href={href}>{ui.more}</MoreLink>
    </div>
  );
}

export default function Home() {
  const roasteries = getRoasteries();

  return (
    <main id="main" className="flex-1">
      <section aria-labelledby="home-hero" className="bg-hero">
        {/* 웹: [소개 | 지도] 위, [버튼 | 지도] 아래 — 소개는 아래로, 버튼은 위로 붙어 지도 가운데쯤에 모인다. 1023 이하는 소개 → 지도 → 버튼 */}
        <div className="page-wrap grid grid-cols-1 items-center gap-y-8 pt-16 pb-18 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-0">
          <div className="lg:self-end">
            <p className="m-0 text-sm font-semibold text-muted">
              {home.hero.eyebrow(roasteries.length, listedProducts().length)}
            </p>
            <h1
              id="home-hero"
              className="mt-4 mb-0 text-[clamp(34px,4.2vw,54px)] leading-[1.22] font-bold tracking-[-0.04em]"
            >
              {home.hero.titleLines[0]}
              <br />
              {home.hero.titleLines[1]}
            </h1>
            <p className="mt-5 mb-0 max-w-[26em] text-lg leading-[1.7] text-muted">
              {home.hero.desc}
            </p>
          </div>
          {/* 그리드 칸이 버튼 묶음을 칸 폭만큼 늘린다(보드와 같음) */}
          <ButtonPair className="max-lg:order-3 lg:col-start-1 lg:row-start-2 lg:mt-8 lg:self-start">
            <Button href={home.hero.primary.href} kind="primary" size="lg">
              {home.hero.primary.label}
            </Button>
            <Button href={home.hero.secondary.href} kind="secondary" size="lg">
              {home.hero.secondary.label}
            </Button>
          </ButtonPair>
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <TasteMap products={mappedProducts()} />
          </div>
        </div>
      </section>

      <section aria-labelledby="home-best" className="page-wrap pt-22">
        <SectionHead
          id="home-best"
          title={home.best.title}
          href={home.best.moreHref}
        />
        <BestSection
          tabsLabel={home.best.tabsLabel}
          tabs={home.best.tabs.map((t) => ({
            label: t.label,
            products: byIds(t.productIds),
          }))}
        />
      </section>

      <section aria-labelledby="home-new" className="page-wrap pt-24">
        <SectionHead
          id="home-new"
          title={home.newArrivals.title}
          href={home.newArrivals.moreHref}
        />
        <ProductGrid
          products={byIds(home.newArrivals.productIds)}
          badge={home.newArrivals.badge}
        />
      </section>

      <section aria-labelledby="home-roasteries" className="page-wrap pt-24">
        <SectionHead
          id="home-roasteries"
          title={home.roasteries.title}
          href={home.roasteries.moreHref}
        />
        <ul className="mt-7 grid list-none grid-cols-4 gap-x-4 gap-y-6 p-0 lg:grid-cols-8">
          {roasteries.map((r) => (
            <li key={r.id}>
              <Link
                href={`/roasteries/${r.id}`}
                className="flex flex-col items-center gap-3 text-center text-sm text-ink no-underline"
              >
                <Image
                  src={r.logo}
                  alt=""
                  width={72}
                  height={72}
                  className="size-18 rounded-full object-cover shadow-[0_0_0_1px_var(--color-line)]"
                />
                {r.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="home-brand" className="page-wrap pt-24">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] overflow-hidden rounded-xl bg-primary text-white">
          <div className="p-[clamp(32px,5vw,56px)]">
            <h2
              id="home-brand"
              className="m-0 text-[28px] font-bold tracking-[-0.03em]"
            >
              {home.brand.title}
            </h2>
            <p className="mt-4 mb-0 max-w-[28em] text-base leading-[1.8] opacity-88">
              {home.brand.desc}
            </p>
          </div>
          <Image
            src={home.brand.image}
            alt=""
            width={1600}
            height={500}
            sizes="(min-width: 1024px) 640px, 100vw"
            className="block h-full min-h-60 w-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}
