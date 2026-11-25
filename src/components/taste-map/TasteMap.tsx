"use client";

import Link from "next/link";
import { useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductThumb } from "@/components/product/ProductThumb";
import { Segmented } from "@/components/ui/Segmented";
import { home } from "@/content/home";
import { ui } from "@/content/ui";
import type { MappedProduct } from "@/lib/catalog";
import { formatWon } from "@/lib/format";
import { toPos } from "@/lib/taste";
import type { MapPosition } from "@/types";

type FilterKey = (typeof home.tasteMap.filters)[number]["key"];

const matches = (p: MappedProduct, f: FilterKey) =>
  f === "all" || (f === "decaf" ? p.decaf : p.type === f);

/** 점이 지도 끝 가까이 있으면 이름 말풍선을 안쪽 · 아래로 돌린다 (프로토타입 기준값) */
function tipPlacement({ x, y }: MapPosition) {
  const below = y < 24 ? "top-[calc(100%+5px)]" : "bottom-[calc(100%+5px)]";
  const side =
    x < 16
      ? "left-[-1px]"
      : x > 84
        ? "right-[-1px]"
        : "left-1/2 -translate-x-1/2";
  return `${below} ${side}`;
}

/**
 * 메인 맛 지도. 가로 고소한 ↔ 화사한, 세로 묵직한 ↔ 가벼운. 종류를 고르면 다른 점은 옅어지고, 점을 누르면 아래 카드에 원두가 보인다.
 * @example <TasteMap products={mappedProducts()} />
 */
export function TasteMap({ products }: { products: MappedProduct[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string>(
    home.tasteMap.defaultProductId,
  );
  const selected = products.find((p) => p.id === selectedId) ?? products[0];

  const pickFilter = (f: FilterKey) => {
    setFilter(f);
    // 고른 원두가 새 종류에 없으면 그 종류의 첫 원두로 옮긴다
    if (selected && !matches(selected, f)) {
      const first = products.find((p) => matches(p, f));
      if (first) setSelectedId(first.id);
    }
  };

  const axis = "absolute text-xs text-muted";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-base font-bold">{home.tasteMap.title}</h2>
        <Segmented
          label={home.tasteMap.filterLabel}
          items={home.tasteMap.filters}
          value={filter}
          onChange={pickFilter}
        />
      </div>

      {/* 점에 올리면 그 점만 진하게, 나머지는 옅게 (has 선택자) */}
      <div className="group/map relative mt-3 aspect-[1.45/1] overflow-hidden rounded-xl bg-bg">
        <div
          aria-hidden="true"
          className="absolute top-[8%] bottom-[8%] left-1/2 w-px bg-line"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-[5%] left-[5%] h-px bg-line"
        />
        <span
          aria-hidden="true"
          className={`${axis} top-2.5 left-1/2 -translate-x-1/2`}
        >
          {ui.tasteMap.axes.heavy}
        </span>
        <span
          aria-hidden="true"
          className={`${axis} bottom-2.5 left-1/2 -translate-x-1/2`}
        >
          {ui.tasteMap.axes.light}
        </span>
        <span
          aria-hidden="true"
          className={`${axis} top-1/2 left-3 -translate-y-1/2`}
        >
          {ui.tasteMap.axes.nutty}
        </span>
        <span
          aria-hidden="true"
          className={`${axis} top-1/2 right-3 -translate-y-1/2`}
        >
          {ui.tasteMap.axes.bright}
        </span>

        {products.map((p) => {
          const on = p.id === selected?.id;
          const visible = matches(p, filter);
          const pos = toPos(p.taste);
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              aria-label={`${p.roastery} ${p.title}, ${p.notes}`}
              onClick={() => setSelectedId(p.id)}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              // 누르는 칸은 24(Lighthouse target-size가 버튼 상자 크기로 잰다), 보이는 점은 안쪽 14(고른 점 22)
              className={`group/dot absolute grid size-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full p-0 text-primary hover:z-2 focus-visible:z-2 ${visible ? "opacity-100" : "opacity-15"} group-has-[button:hover]/map:not-hover:[filter:opacity(.45)]`}
            >
              <span
                aria-hidden="true"
                className={`block rounded-full transition-[box-shadow,background-color] duration-150 motion-reduce:transition-none ${
                  on
                    ? "size-5.5 border-3 border-white bg-primary shadow-[0_0_0_2px_var(--color-primary)] group-hover/dot:shadow-[0_0_0_2px_currentColor,0_0_0_7px_color-mix(in_srgb,currentColor_22%,transparent)] group-focus-visible/dot:shadow-[0_0_0_2px_currentColor,0_0_0_7px_color-mix(in_srgb,currentColor_22%,transparent)]"
                    : "size-3.5 bg-map-dot-home group-hover/dot:bg-[color-mix(in_srgb,currentColor_55%,var(--color-map-dot-home))] group-hover/dot:shadow-[0_0_0_4px_color-mix(in_srgb,currentColor_28%,transparent)] group-focus-visible/dot:bg-[color-mix(in_srgb,currentColor_55%,var(--color-map-dot-home))] group-focus-visible/dot:shadow-[0_0_0_4px_color-mix(in_srgb,currentColor_28%,transparent)]"
                }`}
              />
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute rounded-md bg-ink px-2 py-1 text-xs leading-[1.2] font-semibold whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover/dot:opacity-100 group-focus-visible/dot:opacity-100 ${tipPlacement(pos)}`}
              >
                {p.title}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          aria-live="polite"
          className="mt-3 flex items-center gap-4 rounded-xl bg-bg p-4 max-sm:flex-wrap"
        >
          <ProductThumb src={selected.image} size={72} />
          <div className="min-w-0 flex-1">
            <p className="m-0 text-sm text-muted">{selected.roastery}</p>
            <p className="mt-1 mb-0 text-base font-bold">
              <Link
                href={`/coffee/${selected.id}`}
                className="text-ink no-underline transition-colors duration-150 hover:text-primary"
              >
                {selected.title}
              </Link>
            </p>
            <p className="mt-1 mb-0 text-sm text-muted">
              {selected.notes} · {formatWon(selected.price)}
            </p>
          </div>
          {/* 모바일은 담기를 아래 줄 전체 폭(44)으로 (보드 값) */}
          <div className="max-sm:flex max-sm:basis-full max-sm:*:h-11 max-sm:*:flex-1">
            <AddToCartButton
              productId={selected.id}
              title={selected.title}
              variant="panel"
            />
          </div>
        </div>
      )}
    </div>
  );
}
