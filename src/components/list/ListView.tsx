"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FilterIcon } from "@/components/icons";
import { ProductCard } from "@/components/product/ProductCard";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { ScrollTabs } from "@/components/ui/ScrollTabs";
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
  parseListQuery,
  SORT_KEYS,
  toListQuery,
} from "@/lib/filter";
import { useSearchStore } from "@/store/search";
import type { ListFilter, PriceBandId, ProductType } from "@/types";
import { ListMap } from "./ListMap";
import { FilterGroups } from "./FilterGroups";

/** 들어올 때 스켈레톤을 보이는 시간 (02 PRD 「들어올 때 약 1초 스켈레톤」 · 프로토타입 값) */
const ENTER_LOADING_MS = 900;
/** 필터 영역이 푸터에 밀려도 이 높이 밑으로는 줄이지 않는다 (03 「목록」) */
const SIDE_MIN_HEIGHT = 320;

type View = "grid" | "map";
type Tab = ProductType | "all";

const label = (key: string) => navItems.find((n) => n.key === key)?.label ?? "";

const toggle = <T,>(list: T[], v: T) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

/** 같은 상품 줄 — 웹 4열 · 1024–1279 3열 · 태블릿 3열 · 모바일 2열 */
const gridClass =
  "m-0 mt-4 grid list-none grid-cols-2 gap-x-3 gap-y-7 p-0 sm:grid-cols-3 lg:gap-x-4 lg:gap-y-8 xl:grid-cols-4";

/**
 * 모든커피 · 싱글오리진 · 블렌드 목록. 같은 화면이고 URL의 type으로 갈린다.
 * 조건은 모두 URL 쿼리에 있어 주소를 공유하면 같은 목록이 열린다 (04 문서 4장).
 * 모든커피의 종류 탭은 페이지 자체(type)와 섞이지 않게 tab 쿼리로 둔다.
 * @example <ListView />
 */
export function ListView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const pageType = params.get("type");
  const isAll = pageType !== "single" && pageType !== "blend";
  const tabParam = params.get("tab");
  const tab: Tab = isAll
    ? tabParam === "single" || tabParam === "blend"
      ? tabParam
      : "all"
    : (pageType as ProductType);
  const filter: ListFilter = { ...parseListQuery(params), type: tab };
  const view: View = params.get("view") === "map" ? "map" : "grid";

  const pageTitle = isAll ? label(tab === "all" ? "coffee" : tab) : label(tab);

  const update = (next: Partial<ListFilter> & { view?: View; tab?: Tab }) => {
    const f = { ...filter, ...next };
    const q = new URLSearchParams(toListQuery({ ...f, type: "all" }).slice(1));
    if (!isAll) q.set("type", tab);
    const nextTab = next.tab ?? tab;
    if (isAll && nextTab !== "all") q.set("tab", nextTab);
    const nextView = next.view ?? view;
    if (nextView === "map") q.set("view", "map");
    const s = q.toString().replace(/%2C/g, ",");
    router.replace(`${pathname}${s ? `?${s}` : ""}`, { scroll: false });
  };

  const items = applyListFilter(listedProducts(), filter);
  const filterCount =
    filter.prices.length + filter.tastes.length + (filter.decaf ? 1 : 0);
  const clearFilters = () => update({ decaf: false, prices: [], tastes: [] });
  const resetAll = () =>
    update({ ...DEFAULT_FILTER, tab: "all", sort: filter.sort });

  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLElement>(null);

  useHideOnScroll({ firstRowRef: resultsRef, toolbarRef: barRef });

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), ENTER_LOADING_MS);
    return () => window.clearTimeout(id);
  }, []);

  // 조건을 바꿨을 때 목록 맨 위가 화면 위로 지나가 있으면 도구 줄 바로 아래로 올린다 (02 PRD 3장)
  const conditionKey = params.toString();
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const sec = sectionRef.current;
    if (sec && sec.getBoundingClientRect().top < 0)
      sec.scrollIntoView({ block: "start" });
  }, [conditionKey]);

  // 목록 끝(푸터)이 화면에 들어오면 필터 영역이 위에 붙은 채 높이만 줄어든다 (03 「목록」)
  useEffect(() => {
    const fit = () => {
      const side = sideRef.current;
      const wrap = wrapRef.current;
      if (!side || !wrap) return;
      if (getComputedStyle(side).position !== "sticky") {
        side.style.height = "";
        return;
      }
      const top = parseFloat(getComputedStyle(side).top) || 0;
      const h =
        Math.min(window.innerHeight, wrap.getBoundingClientRect().bottom) - top;
      side.style.height = `${Math.max(SIDE_MIN_HEIGHT, Math.round(h))}px`;
    };
    fit();
    window.addEventListener("scroll", fit, { passive: true });
    window.addEventListener("resize", fit);
    // 헤더가 숨거나 나타나며 top이 바뀌는 0.25초 뒤에도 다시 잰다
    const mo = new MutationObserver(() => window.setTimeout(fit, 260));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-header-hidden"],
    });
    return () => {
      window.removeEventListener("scroll", fit);
      window.removeEventListener("resize", fit);
      mo.disconnect();
    };
  }, []);

  const filterProps = {
    filter,
    onToggleDecaf: () => update({ decaf: !filter.decaf }),
    onTogglePrice: (id: PriceBandId) =>
      update({ prices: toggle(filter.prices, id) }),
    onToggleTaste: (w: string) => update({ tastes: toggle(filter.tastes, w) }),
  };

  const active: {
    key: string;
    label: string;
    aria: string;
    remove: () => void;
  }[] = [];
  if (filter.q.trim())
    active.push({
      key: "q",
      label: ui.list.searchCondition(filter.q.trim()),
      aria: ui.search.clear,
      remove: () => update({ q: "" }),
    });
  if (filter.decaf)
    active.push({
      key: "decaf",
      label: ui.product.decaf,
      aria: ui.list.removeCondition(ui.product.decaf),
      remove: () => update({ decaf: false }),
    });
  for (const w of filter.tastes)
    active.push({
      key: `t-${w}`,
      label: w,
      aria: ui.list.removeCondition(w),
      remove: () => update({ tastes: filter.tastes.filter((x) => x !== w) }),
    });
  for (const id of filter.prices)
    active.push({
      key: `p-${id}`,
      label: ui.list.priceBands[id],
      aria: ui.list.removeCondition(ui.list.priceBands[id]),
      remove: () => update({ prices: filter.prices.filter((x) => x !== id) }),
    });

  const tabs: Tab[] = ["all", "blend", "single"];

  return (
    // main은 body(세로 flex)의 자식이라 폭을 꽉 채우게 두고, 본문 폭은 안쪽 div가 맡는다.
    // main에 바로 page-wrap(margin auto)을 주면 내용만큼만 폭을 잡아 결과가 적을 때 좁아진다
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <div className="pt-10">
          <h1 className="m-0 text-[28px] font-bold tracking-[-0.03em]">
            {pageTitle}
          </h1>
        </div>
        {isAll && (
          <ScrollTabs
            size="page"
            label={ui.list.typeTabsLabel}
            items={tabs.map((t) =>
              t === "all" ? ui.list.all : ui.product.typeLabels[t],
            )}
            value={tabs.indexOf(tab)}
            onChange={(i) => update({ tab: tabs[i] })}
            className="mt-5"
          />
        )}

        <div
          ref={wrapRef}
          className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-6"
        >
          <aside
            ref={sideRef}
            aria-label={ui.list.filter}
            className="list-side box-border hidden flex-col gap-4 py-6 lg:flex"
          >
            <div className="min-h-0 flex-auto overflow-y-auto overscroll-contain rounded-xl bg-surface p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <FilterGroups
                variant="side"
                {...filterProps}
                resetSlot={
                  filterCount > 0 && (
                    <Button
                      kind="text"
                      onClick={clearFilters}
                      aria-label={ui.list.resetLabel}
                      className="-mr-2"
                    >
                      {ui.list.reset}
                    </Button>
                  )
                }
              />
            </div>
            <div className="flex-none rounded-xl border border-line bg-bg p-5 [word-break:keep-all]">
              <p className="m-0 text-sm font-bold">{ui.list.helpTitle}</p>
              <p className="mt-1.5 mb-0 text-sm leading-[1.6] text-ink-2">
                {ui.list.helpDesc}
              </p>
              <Button
                href="/taste-test"
                kind="secondary"
                size="sm"
                className="mt-3.5"
              >
                {ui.list.helpButton}
              </Button>
            </div>
          </aside>

          <section
            ref={sectionRef}
            aria-label={ui.list.gridLabel}
            className="min-h-[calc(100dvh-60px)] min-w-0 scroll-mt-14 self-stretch lg:scroll-mt-15"
          >
            <div
              ref={barRef}
              className="list-bar flex flex-nowrap items-center gap-x-2 gap-y-3 border-b border-line bg-bg py-4 sm:gap-x-4 lg:pt-6"
            >
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={sheetOpen}
                onClick={(e) => {
                  e.currentTarget.focus();
                  setSheetOpen(true);
                }}
                className="kind-secondary inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-line-control bg-bg px-3 text-sm leading-none font-semibold whitespace-nowrap text-ink hover:border-ink sm:px-3.5 lg:hidden"
              >
                <FilterIcon />
                {ui.list.filter}
                {filterCount > 0 && (
                  <span className="inline-grid h-5 min-w-5 place-items-center rounded-sm bg-primary px-1.5 text-xs leading-none font-bold text-white">
                    {filterCount}
                  </span>
                )}
              </button>
              <SearchInput
                id="list-q"
                label={ui.list.searchPlaceholder}
                placeholder={ui.list.searchPlaceholder}
                value={filter.q}
                onChange={(q) => update({ q })}
                onEnter={(q) => useSearchStore.getState().addRecent(q)}
                height="h-10"
                className="min-w-40 flex-auto"
              />
            </div>

            <div
              aria-label={ui.list.resultsLabel}
              className="mt-4 flex min-h-9 flex-wrap items-center gap-x-1.5 gap-y-2.5"
            >
              <p
                aria-live="polite"
                className="order-0 m-0 text-sm whitespace-nowrap text-muted"
              >
                {ui.list.totalPrefix}{" "}
                <strong className="text-ink">{items.length}</strong>
                {ui.list.totalSuffix}
              </p>
              <div className="order-1 ml-auto flex items-center gap-2">
                <Segmented
                  tall
                  label={ui.list.viewLabel}
                  items={[
                    { key: "grid", label: ui.list.views.grid },
                    { key: "map", label: ui.list.views.map },
                  ]}
                  value={view}
                  onChange={(v) => update({ view: v })}
                />
                <SortSelect
                  options={SORT_KEYS.map((k) => ({
                    key: k,
                    label: ui.list.sorts[k],
                  }))}
                  value={filter.sort}
                  onChange={(sort) => update({ sort })}
                  label={ui.list.sortCurrent}
                  menuLabel={ui.list.sortLabel}
                />
              </div>
              {active.length > 0 && (
                <>
                  <span
                    aria-hidden="true"
                    className="order-2 block h-0 basis-full"
                  />
                  {active.map((a) => (
                    <button
                      key={a.key}
                      type="button"
                      aria-label={a.aria}
                      onClick={a.remove}
                      className="order-3 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-2xl bg-surface pr-2.5 pl-3 text-sm leading-none text-ink hover:bg-ghost-hover"
                    >
                      {a.label}
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
                    </button>
                  ))}
                  <Button kind="text" onClick={resetAll} className="order-3">
                    {ui.list.clearAll}
                  </Button>
                </>
              )}
            </div>

            <div ref={resultsRef}>
              {loading ? (
                <ul aria-label={ui.list.loadingLabel} className={gridClass}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <li key={i}>
                      <ProductCardSkeleton />
                    </li>
                  ))}
                </ul>
              ) : items.length === 0 ? (
                <div className="mt-4 rounded-xl bg-surface px-6 py-16 text-center">
                  <p className="m-0 text-lg font-bold">{ui.list.emptyTitle}</p>
                  <p className="mt-2 mb-0 text-sm text-muted">
                    {ui.list.emptyDesc}
                  </p>
                  <Button kind="primary" onClick={resetAll} className="mt-5">
                    {ui.list.emptyReset}
                  </Button>
                </div>
              ) : view === "map" ? (
                <ListMap products={mappedProducts(items)} />
              ) : (
                <ul className={gridClass}>
                  {items.map((p) => (
                    <li key={p.id}>
                      <ProductCard product={p} />
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
        title={ui.list.filter}
        closeLabel={ui.list.closeFilter}
        footer={
          <>
            <Button kind="secondary" onClick={clearFilters}>
              {ui.list.reset}
            </Button>
            <Button kind="primary" onClick={() => setSheetOpen(false)}>
              {ui.list.sheetDone(items.length)}
            </Button>
          </>
        }
      >
        <FilterGroups variant="sheet" {...filterProps} />
      </BottomSheet>
    </main>
  );
}
