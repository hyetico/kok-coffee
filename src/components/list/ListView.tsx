"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FilterIcon, SlidersIcon } from "@/components/icons";
import { ProductCard } from "@/components/product/ProductCard";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Segmented } from "@/components/ui/Segmented";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { SortSelect } from "@/components/ui/SortSelect";
import { navItems, ui } from "@/content/ui";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { listedProducts, mappedProducts } from "@/lib/catalog";
import {
  applyListFilter,
  DEFAULT_FILTER,
  effectiveSort,
  parseListQuery,
  PRICE_BAND_IDS,
  SORT_KEYS,
  toListQuery,
} from "@/lib/filter";
import { dist, tasteKey, toPos } from "@/lib/taste";
import { useSearchStore } from "@/store/search";
import { useTaste, useTasteStore } from "@/store/taste";
import type { ListFilter, Product, ProductType } from "@/types";
import { FilterPanel } from "./FilterPanel";
import { ListMap } from "./ListMap";

/** 들어올 때 스켈레톤을 보이는 시간 (02 PRD 「들어올 때 약 1초 스켈레톤」 · 프로토타입 값) */
const ENTER_LOADING_MS = 900;

type View = "map" | "list";
type TypeKey = ProductType | "all";

const label = (key: string) => navItems.find((n) => n.key === key)?.label ?? "";

/** 받침이 있으면 「과」, 없으면 「와」 */
function josa(word: string): string {
  const c = word.charCodeAt(word.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0 ? "과" : "와";
}

/** 웹 4열 · 1024–1279 3열 · 태블릿 3열 · 모바일 2열 */
const gridClass =
  "m-0 mt-6 grid list-none grid-cols-2 gap-x-3 gap-y-7 p-0 sm:grid-cols-3 lg:gap-x-4 lg:gap-y-8 xl:grid-cols-4";

/**
 * 모든커피 · 싱글오리진 · 블렌드 목록 — 지도 우선 구조: [필터 | 도구 줄 → 맛 지도 → 「원두」 목록] (06 기술서 4장).
 * 조건 · 보기 · 고른 점은 모두 URL 쿼리에 있어 주소를 공유하면 같은 화면이 열린다 (06 기술서 8장).
 * 싱글오리진 · 블렌드는 type 쿼리가 페이지 자체라, 모든커피의 종류 라디오는 tab 쿼리로 둔다.
 * @example <ListView />
 */
export function ListView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { pin, hintClosed } = useTaste();

  const pageType = params.get("type");
  const isAll = pageType !== "single" && pageType !== "blend";
  const tabParam = params.get("tab");
  const type: TypeKey = isAll
    ? tabParam === "single" || tabParam === "blend"
      ? tabParam
      : "all"
    : (pageType as ProductType);
  const filter: ListFilter = { ...parseListQuery(params), type };
  const view: View = params.get("view") === "list" ? "list" : "map";
  const pickParam = params.get("pick");

  const pageTitle = label(isAll ? "coffee" : type);

  type Next = Partial<ListFilter> & {
    view?: View;
    tab?: TypeKey;
    pick?: string | null;
  };
  // 조건을 바꾸면 고른 점은 풀린다 — 검색어 · 보기 전환만 고른 점을 그대로 둔다 (프로토타입 규칙)
  const update = (next: Next) => {
    const f = { ...filter, ...next };
    const q = new URLSearchParams(toListQuery({ ...f, type: "all" }).slice(1));
    if (!isAll) q.set("type", type);
    const nextTab = next.tab ?? type;
    if (isAll && nextTab !== "all") q.set("tab", nextTab);
    if ((next.view ?? view) === "list") q.set("view", "list");
    const keepPick = Object.keys(next).every((k) => k === "q" || k === "view");
    const pick = "pick" in next ? next.pick : keepPick ? pickParam : null;
    if (pick) q.set("pick", pick);
    const s = q.toString().replace(/%2C/g, ",");
    router.replace(`${pathname}${s ? `?${s}` : ""}`, { scroll: false });
  };

  const typed = mappedProducts(
    listedProducts().filter((p) => type === "all" || p.type === type),
  );
  const filtered = applyListFilter(listedProducts(), filter, pin);
  const passing = new Set(filtered.map((p) => p.id));

  // 고른 원두(묶음이면 같은 자리 전부) → 나머지를 맛이 가까운 순 (06 기술서 6장)
  const anchor = typed.find((p) => p.id === pickParam) ?? null;
  let items: { product: Product; badge?: string }[] = filtered.map((p) => ({
    product: p,
  }));
  let pickChip = "";
  if (anchor) {
    const k = tasteKey(anchor.taste);
    const at = toPos(anchor.taste);
    const d = (p: Product) =>
      p.taste ? dist(toPos(p.taste), at) : Number.POSITIVE_INFINITY;
    const front = typed.filter((p) => tasteKey(p.taste) === k);
    const rest = filtered
      .filter((p) => !p.taste || tasteKey(p.taste) !== k)
      .map((p, i) => ({ p, i }))
      .sort((a, b) => d(a.p) - d(b.p) || a.i - b.i)
      .map((x) => x.p);
    const nearIds = new Set(
      typed
        .filter((p) => tasteKey(p.taste) !== k)
        .sort((a, b) => d(a) - d(b))
        .slice(0, 3)
        .map((p) => p.id),
    );
    items = [
      ...front.map((p) => ({ product: p, badge: ui.list.pick.picked })),
      ...rest.map((p) => ({
        product: p,
        badge: nearIds.has(p.id) ? ui.list.pick.similar : undefined,
      })),
    ];
    const name =
      front.length > 1 ? ui.list.pick.group(front.length) : anchor.title;
    pickChip = ui.list.pick.chip(name, josa(name));
  }

  const filterCount =
    (filter.decaf ? 1 : 0) +
    (filter.ac ? 1 : 0) +
    (filter.bd ? 1 : 0) +
    filter.tastes.length +
    filter.prices.length;
  const clearFilters = () =>
    update({ decaf: false, prices: [], tastes: [], ac: null, bd: null });
  const resetAll = () =>
    update({ ...DEFAULT_FILTER, tab: "all", sort: filter.sort });

  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const listHeadRef = useRef<HTMLDivElement>(null);

  useHideOnScroll();

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), ENTER_LOADING_MS);
    return () => window.clearTimeout(id);
  }, []);

  const goList = () =>
    listHeadRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });

  const t = ui.list;
  const active: {
    key: string;
    label: string;
    aria: string;
    remove: () => void;
  }[] = [];
  if (filter.q.trim())
    active.push({
      key: "q",
      label: t.searchCondition(filter.q.trim()),
      aria: ui.search.clear,
      remove: () => update({ q: "" }),
    });
  if (filter.decaf)
    active.push({
      key: "decaf",
      label: ui.product.decaf,
      aria: t.removeCondition(ui.product.decaf),
      remove: () => update({ decaf: false }),
    });
  if (filter.ac) {
    const l = t.rangeText(t.acidity.name, t.acidity.bands[filter.ac]);
    active.push({
      key: "ac",
      label: l,
      aria: t.removeCondition(l),
      remove: () => update({ ac: null }),
    });
  }
  if (filter.bd) {
    const l = t.rangeText(t.body.name, t.body.bands[filter.bd]);
    active.push({
      key: "bd",
      label: l,
      aria: t.removeCondition(l),
      remove: () => update({ bd: null }),
    });
  }
  for (const w of filter.tastes)
    active.push({
      key: `t-${w}`,
      label: w,
      aria: t.removeCondition(w),
      remove: () => update({ tastes: filter.tastes.filter((x) => x !== w) }),
    });
  for (const id of PRICE_BAND_IDS)
    if (filter.prices.includes(id))
      active.push({
        key: `p-${id}`,
        label: t.priceBands[id],
        aria: t.removeCondition(t.priceBands[id]),
        remove: () => update({ prices: filter.prices.filter((x) => x !== id) }),
      });

  const sortKey = effectiveSort(filter.sort, pin);
  const panelProps = {
    filter,
    type: isAll ? type : null,
    onType: (tab: TypeKey) => update({ tab }),
    onChange: (next: Partial<ListFilter>) => update(next),
    pin,
  };
  const chipClass =
    "inline-flex h-8 cursor-pointer items-center gap-2 rounded-2xl px-3 text-sm leading-none";
  const xIcon = (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );

  return (
    // main은 body(세로 flex)의 자식이라 폭을 꽉 채우게 두고, 본문 폭은 안쪽 div가 맡는다
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <div className="pt-10">
          <h1 className="m-0 text-[28px] font-bold tracking-[-0.03em]">
            {pageTitle}
          </h1>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-8">
          <aside
            aria-label={t.filter}
            className="list-side box-border hidden flex-col pb-4 lg:flex"
          >
            <div className="min-h-0 flex-auto overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="mb-4 flex h-10 items-center justify-between">
                <h2 className="m-0 flex items-center gap-2 text-lg font-bold tracking-[-0.02em] text-ink">
                  <SlidersIcon />
                  {t.filter}
                  {filterCount > 0 && (
                    <span
                      aria-label={t.filterCount(filterCount)}
                      className="box-border inline-grid h-5 min-w-5 place-items-center rounded-[10px] bg-ink px-2 text-xs font-bold text-white"
                    >
                      {filterCount}
                    </span>
                  )}
                </h2>
                {filterCount > 0 && (
                  <button
                    type="button"
                    aria-label={t.resetLabel}
                    onClick={clearFilters}
                    className="-mr-2 inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-sm text-muted hover:bg-map-bg hover:text-ink"
                  >
                    {t.reset}
                  </button>
                )}
              </div>
              <FilterPanel {...panelProps} />
            </div>
          </aside>

          <section aria-label={t.gridLabel} className="min-w-0">
            <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:gap-2">
              <SearchInput
                id="list-q"
                label={t.searchLabel}
                placeholder={t.searchPlaceholder}
                value={filter.q}
                onChange={(q) => update({ q })}
                onEnter={(q) => useSearchStore.getState().addRecent(q)}
                size="sm"
                className="flex-auto max-sm:basis-full sm:max-lg:flex-[0_1_320px]"
              />
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={sheetOpen}
                onClick={(e) => {
                  e.currentTarget.focus();
                  setSheetOpen(true);
                }}
                className="kind-secondary inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-line-control bg-bg px-4 text-sm leading-none font-semibold whitespace-nowrap text-ink hover:border-ink lg:hidden"
              >
                <FilterIcon />
                {t.filter}
                {filterCount > 0 && (
                  <span className="inline-grid h-5 min-w-5 place-items-center rounded-[10px] bg-ink px-2 text-xs leading-none font-bold text-white">
                    {filterCount}
                  </span>
                )}
              </button>
              <div className="max-lg:ml-auto">
                <Segmented
                  tall
                  label={t.viewLabel}
                  items={[
                    { key: "map", label: t.views.map },
                    { key: "list", label: t.views.list },
                  ]}
                  value={view}
                  onChange={(v) => update({ view: v })}
                />
              </div>
            </div>

            {view === "map" && (
              <ListMap
                products={typed}
                passing={passing}
                pickId={anchor?.id ?? null}
                onPick={(id) => update({ pick: id })}
                ac={filter.ac}
                bd={filter.bd}
                pin={pin}
                showHint={!pin && !hintClosed}
                onCloseHint={() => useTasteStore.getState().closeHint()}
                onGoList={goList}
              />
            )}

            <div ref={listHeadRef} className="mt-10 scroll-mt-20">
              <h2 className="m-0 text-xl font-bold">{t.listTitle}</h2>
              <div className="mt-2 flex min-h-10 items-center justify-between gap-3">
                <p className="m-0 text-sm text-muted">
                  {t.totalPrefix}{" "}
                  <strong className="text-ink">{items.length}</strong>
                  {t.totalSuffix}
                </p>
                <SortSelect
                  plain
                  options={SORT_KEYS.filter((k) => k !== "near" || pin).map(
                    (k) => ({ key: k, label: t.sorts[k] }),
                  )}
                  value={anchor ? null : sortKey}
                  currentLabel={anchor ? t.sortPick : undefined}
                  onChange={(sort) => update({ sort })}
                  label={t.sortCurrent}
                  menuLabel={t.sortLabel}
                />
              </div>
              {(anchor || active.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {anchor && (
                    <button
                      type="button"
                      aria-label={t.pick.clear}
                      onClick={() => update({ pick: null })}
                      className={`${chipClass} bg-primary text-white hover:bg-primary-hover`}
                    >
                      {pickChip}
                      {xIcon}
                    </button>
                  )}
                  {active.map((a) => (
                    <button
                      key={a.key}
                      type="button"
                      aria-label={a.aria}
                      onClick={a.remove}
                      className={`${chipClass} bg-surface text-ink hover:bg-ghost-hover`}
                    >
                      {a.label}
                      {xIcon}
                    </button>
                  ))}
                  {active.length > 0 && (
                    <Button kind="text" onClick={resetAll}>
                      {t.clearAll}
                    </Button>
                  )}
                </div>
              )}
              {/* 지도에서 점을 고르면 목록 순서가 바뀐 것을 화면 낭독기에 알린다 */}
              <p aria-live="polite" className="sr-only">
                {anchor ? t.pick.live(pickChip) : ""}
              </p>
            </div>

            <div className="pb-6">
              {loading ? (
                <ul aria-label={t.loadingLabel} className={gridClass}>
                  {Array.from({ length: items.length || 4 }, (_, i) => (
                    <li key={i}>
                      <ProductCardSkeleton />
                    </li>
                  ))}
                </ul>
              ) : items.length === 0 ? (
                <div className="mt-4 rounded-xl bg-surface px-6 py-16 text-center">
                  <p className="m-0 text-lg font-bold">{t.emptyTitle}</p>
                  <p className="mt-2 mb-0 text-sm text-muted">{t.emptyDesc}</p>
                  <Button kind="primary" onClick={resetAll} className="mt-5">
                    {t.emptyReset}
                  </Button>
                </div>
              ) : (
                <ul className={gridClass}>
                  {items.map(({ product, badge }) => (
                    <li key={product.id}>
                      <ProductCard product={product} badge={badge} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={t.filter}
        closeLabel={t.closeFilter}
        footer={
          <>
            <Button kind="secondary" onClick={clearFilters}>
              {t.reset}
            </Button>
            <Button kind="primary" onClick={() => setSheetOpen(false)}>
              {t.sheetDone(items.length)}
            </Button>
          </>
        }
      >
        <FilterPanel {...panelProps} sheet />
      </BottomSheet>
    </main>
  );
}
