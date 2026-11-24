import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { roasteryContent } from "@/content/roastery";
import { navItems } from "@/content/ui";
import { getRoasteries, getRoastery } from "@/lib/catalog";
import { roasteryProducts, roasterySummary } from "@/lib/roastery";

export function generateStaticParams() {
  return getRoasteries().map((r) => ({ id: r.id }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const roastery = getRoastery(id);
  if (!roastery) notFound();

  const t = roasteryContent.brand;
  const store = roasteryContent.stores[roastery.id];
  const products = roasteryProducts(roastery);
  const summary = roasterySummary(roastery.name, products);
  const listLabel = navItems.find((n) => n.key === "roasteries")?.label;

  return (
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <nav aria-label={t.breadcrumbLabel} className="mt-6 text-sm text-muted">
          <Link
            href="/roasteries"
            className="-mx-1.5 -my-0.75 inline-block px-1.5 py-0.75 text-muted no-underline hover:text-ink"
          >
            {listLabel}
          </Link>{" "}
          <span aria-hidden="true">/</span>{" "}
          <span aria-current="page">{roastery.name}</span>
        </nav>

        <section
          aria-labelledby="brand-name"
          className="mt-5 flex flex-wrap items-center gap-10"
        >
          <div className="min-w-0 flex-[1_1_420px]">
            {store ? (
              <Image
                src={store.photo}
                alt={t.photoAlt(roastery.name)}
                width={640}
                height={480}
                className="block aspect-[4/3] w-full rounded-xl object-cover"
              />
            ) : (
              // 매장 사진이 없는 로스터리는 로고를 크게 보여 준다
              <div className="grid aspect-[4/3] w-full place-items-center content-center gap-3.5 rounded-xl bg-ghost-hover">
                <Image
                  src={roastery.logo}
                  alt=""
                  width={120}
                  height={120}
                  className="size-30 rounded-full object-cover shadow-[0_0_0_1px_var(--color-line)]"
                />
                <Tag>{t.logoTag}</Tag>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-[1_1_380px]">
            <div className="flex items-center gap-4">
              <Image
                src={roastery.logo}
                alt=""
                width={72}
                height={72}
                className="size-18 rounded-full object-cover shadow-[0_0_0_1px_var(--color-line-soft)]"
              />
              <div>
                <h1
                  id="brand-name"
                  className="m-0 text-[28px] font-bold tracking-[-0.03em]"
                >
                  {roastery.name}
                </h1>
                <p className="mt-1 mb-0 text-sm text-muted">
                  {t.beanCount(products.length)}
                </p>
              </div>
            </div>
            {!store && (
              <p className="mt-5 mb-0 text-base leading-[1.8] text-ink-2">
                {summary.intro}
              </p>
            )}
            <h2 className="mt-7 mb-0 text-base font-bold">
              {store ? t.awardsTitle : t.summaryTitle}
            </h2>
            <ul className="mt-2.5 mb-0 list-disc pl-5 text-base leading-[1.9]">
              {(store ? store.awards : summary.facts).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <dl className="m-0 mt-6 grid grid-cols-[80px_1fr] gap-x-3 gap-y-2 rounded-xl bg-surface px-5 py-4.5 text-sm">
              <dt className="text-muted">{t.place}</dt>
              <dd className="m-0">{store?.place ?? t.placeFallback}</dd>
              <dt className="text-muted">{t.instagram}</dt>
              <dd className="m-0">{store?.instagram ?? t.instagramFallback}</dd>
            </dl>
          </div>
        </section>

        <section aria-labelledby="brand-products" className="mt-16">
          <h2 id="brand-products" className="m-0 text-[22px] font-bold">
            {t.productsTitle(roastery.name)}
          </h2>
          {products.length > 0 ? (
            <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-x-3 gap-y-7 p-0 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-9">
              {products.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-xl bg-surface px-6 py-14 text-center">
              <p className="m-0 text-lg font-bold">{t.emptyTitle}</p>
              <p className="mt-2 mb-0 text-sm text-muted">{t.emptyDesc}</p>
              <Button href="/coffee" kind="primary" className="mt-5">
                {t.emptyButton}
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
