"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { Segmented } from "@/components/ui/Segmented";
import { home } from "@/content/home";
import { ui } from "@/content/ui";
import type { MappedProduct } from "@/lib/catalog";
import { formatWon } from "@/lib/format";

type FilterKey = (typeof home.tasteMap.filters)[number]["key"];

const matches = (p: MappedProduct, f: FilterKey) =>
  f === "all" || (f === "decaf" ? p.decaf : p.type === f);

/** 점이 지도 끝 가까이 있으면 이름 말풍선을 안쪽 · 아래로 돌린다 (프로토타입 기준값) */
function tipPlacement({ x, y }: MappedProduct["mapPosition"]) {
  const below = y < 24 ? "top-[calc(100%+10px)]" : "bottom-[calc(100%+10px)]";
  const side =
    x < 16 ? "-left-1.5" : x > 84 ? "-right-1.5" : "left-1/2 -translate-x-1/2";
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
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              aria-label={`${p.roastery} ${p.title}, ${p.notes}`}
              onClick={() => setSelectedId(p.id)}
              style={{
                left: `${p.mapPosition.x}%`,
                top: `${p.mapPosition.y}%`,
              }}
              // 보이는 점은 14(고른 점 22), 누르는 칸은 바깥으로 5씩 넓혀 24 이상
              className={`group/dot absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0 text-primary transition-[box-shadow,filter,background-color] duration-150 before:absolute before:-inset-1.25 before:rounded-full before:content-[''] hover:z-2 focus-visible:z-2 motion-reduce:transition-none ${
                on
                  ? "size-5.5 border-3 border-white bg-primary shadow-[0_0_0_2px_var(--color-primary)] hover:shadow-[0_0_0_2px_currentColor,0_0_0_7px_color-mix(in_srgb,currentColor_22%,transparent)] focus-visible:shadow-[0_0_0_2px_currentColor,0_0_0_7px_color-mix(in_srgb,currentColor_22%,transparent)]"
                  : "size-3.5 border-0 bg-map-dot hover:bg-[color-mix(in_srgb,currentColor_55%,var(--color-map-dot))] hover:shadow-[0_0_0_4px_color-mix(in_srgb,currentColor_28%,transparent)] focus-visible:bg-[color-mix(in_srgb,currentColor_55%,var(--color-map-dot))] focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,currentColor_28%,transparent)]"
              } ${visible ? "opacity-100" : "opacity-15"} group-has-[button:hover]/map:not-hover:[filter:opacity(.45)]`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute rounded-md bg-ink px-2 py-1.25 text-xs leading-[1.2] font-semibold whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover/dot:opacity-100 group-focus-visible/dot:opacity-100 ${tipPlacement(p.mapPosition)}`}
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
          className="mt-3 flex items-center gap-4 rounded-xl bg-bg p-3.5"
        >
          <div className="shrink-0 overflow-hidden rounded-md bg-photo-bg">
            <Image
              src={selected.image}
              alt=""
              width={72}
              height={72}
              className="block size-18 object-contain mix-blend-multiply"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 text-sm text-muted">{selected.roastery}</p>
            <p className="mt-0.5 mb-0 text-base font-bold">
              <Link
                href={`/coffee/${selected.id}`}
                className="text-ink no-underline transition-colors duration-150 hover:text-primary"
              >
                {selected.title}
              </Link>
            </p>
            <p className="mt-0.5 mb-0 text-sm text-muted">
              {selected.notes} · {formatWon(selected.price)}
            </p>
          </div>
          <AddToCartButton
            productId={selected.id}
            title={selected.title}
            variant="primary"
          />
        </div>
      )}
    </div>
  );
}
