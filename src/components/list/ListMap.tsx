"use client";

import Image from "next/image";
import { useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductThumb } from "@/components/product/ProductThumb";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ui } from "@/content/ui";
import type { MappedProduct } from "@/lib/catalog";
import { formatWon } from "@/lib/format";

type Group = { key: string; items: MappedProduct[] };

/**
 * 맛 위치가 같은 원두끼리 묶는다. 순서는 목록에서 처음 나온 순.
 * @example groupByPosition(products).filter((g) => g.items.length > 1)
 */
export function groupByPosition(products: MappedProduct[]): Group[] {
  const map = new Map<string, MappedProduct[]>();
  for (const p of products) {
    const key = `${p.mapPosition.x},${p.mapPosition.y}`;
    map.set(key, [...(map.get(key) ?? []), p]);
  }
  return [...map].map(([key, items]) => ({ key, items }));
}

/**
 * 목록의 「지도」 보기. 지금 조건에 맞는 원두만 점으로 그리고, 고른 원두를 오른쪽(1279px 이하는 아래) 카드로 보여 준다.
 * 맛 위치가 같은 원두는 숫자 점 하나로 합치고, 누르면 「같은 자리 원두 n개」 목록을 보여 준다 (03 「목록 지도 — 겹친 점」).
 * @example <ListMap products={mappedProducts(filtered)} />
 */
export function ListMap({ products }: { products: MappedProduct[] }) {
  const groups = groupByPosition(products);
  const [groupKey, setGroupKey] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 조건이 바뀌어 고른 것이 사라지면 첫 원두를 보여 준다 (프로토타입과 같은 규칙)
  const byId = products.find((p) => p.id === selectedId);
  const keptGroup = groups.find((g) => g.key === groupKey);
  const selected =
    byId ??
    (keptGroup
      ? keptGroup.items.length > 1
        ? undefined
        : keptGroup.items[0]
      : products[0]);
  const activeKey =
    keptGroup?.key ??
    (selected ? `${selected.mapPosition.x},${selected.mapPosition.y}` : null);
  const group = groups.find((g) => g.key === activeKey)?.items ?? [];
  const groupMode = group.length > 1 && !selected;
  const inGroup = group.length > 1 && Boolean(selected);

  const axis = "absolute text-xs text-muted";
  const panel = "rounded-xl border border-line p-5";

  return (
    <div className="mt-4 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div>
        <div className="relative aspect-[1.3/1] overflow-hidden rounded-xl bg-surface">
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
          {groups.map(({ key, items }) => {
            const p = items[0];
            const multi = items.length > 1;
            const on = key === activeKey;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                aria-label={
                  multi
                    ? ui.mapGroup.aria(
                        items.length,
                        items.map((i) => i.title),
                      )
                    : `${p.roastery} ${p.title}, ${p.notes}`
                }
                title={multi ? ui.mapGroup.title(items.length) : undefined}
                onClick={() => {
                  setGroupKey(key);
                  setSelectedId(multi ? null : p.id);
                }}
                style={{
                  left: `${p.mapPosition.x}%`,
                  top: `${p.mapPosition.y}%`,
                }}
                // 보이는 점 14(고른 점 22 · 합친 점 28), 누르는 칸은 바깥으로 5씩 넓혀 24 이상
                className={`absolute grid -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full p-0 text-sm font-bold text-white before:absolute before:-inset-1.25 before:rounded-full before:content-[''] ${
                  multi ? "size-7" : on ? "size-5.5" : "size-3.5"
                } ${
                  on
                    ? "border-3 border-white bg-primary shadow-[0_0_0_2px_var(--color-primary)]"
                    : multi
                      ? "border-0 bg-primary"
                      : "border-0 bg-map-dot"
                }`}
              >
                {multi ? items.length : null}
              </button>
            );
          })}
        </div>
        <p className="mt-2.5 mb-0 text-sm text-muted">{ui.tasteMap.hint}</p>
      </div>

      {groupMode && (
        <div aria-live="polite" className={panel}>
          <p className="m-0 text-base font-bold">
            {ui.mapGroup.title(group.length)}
          </p>
          <p className="mt-1 mb-0 text-sm text-muted">{ui.mapGroup.desc}</p>
          <ul className="m-0 mt-4 list-none p-0">
            {group.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-3 border-t border-line-soft py-3"
              >
                <ProductThumb
                  src={p.image}
                  size={64}
                  padding={12}
                  className="row-span-2"
                />
                <div>
                  <p className="m-0 text-xs text-muted">{p.roastery}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className="mt-0.5 block cursor-pointer p-0 text-left text-base font-bold text-ink hover:text-primary"
                  >
                    {p.title}
                  </button>
                  <p className="mt-0.5 mb-0 text-sm text-muted">
                    {p.notes} · {formatWon(p.price)}
                  </p>
                </div>
                <div className="mt-2 justify-self-start">
                  <AddToCartButton
                    productId={p.id}
                    title={p.title}
                    variant="compact"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected && (
        <div aria-live="polite" className={panel}>
          {inGroup && (
            <Button
              kind="text"
              onClick={() => setSelectedId(null)}
              className="-mt-2 mb-2 -ml-2"
            >
              {ui.mapGroup.back(group.length)}
            </Button>
          )}
          <div className="rounded-md bg-photo-bg">
            <Image
              src={selected.image}
              alt=""
              width={400}
              height={300}
              className="block aspect-[4/3] w-full object-contain p-[6%] mix-blend-multiply"
            />
          </div>
          <p className="mt-3.5 mb-0 text-sm text-muted">{selected.roastery}</p>
          <p className="mt-0.5 mb-0 text-lg font-bold">{selected.title}</p>
          <p className="mt-2 mb-0">
            <Tag>{selected.notes}</Tag>
          </p>
          <p className="mt-2.5 mb-0 text-lg font-bold">
            {formatWon(selected.price)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button href={`/coffee/${selected.id}`} kind="ghost">
              {ui.product.detail}
            </Button>
            <AddToCartButton
              productId={selected.id}
              title={selected.title}
              variant="panel"
              panelSize="md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
