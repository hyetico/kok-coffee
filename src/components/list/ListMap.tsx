"use client";

import Image from "next/image";
import { useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ui } from "@/content/ui";
import type { MappedProduct } from "@/lib/catalog";
import { formatWon } from "@/lib/format";

/**
 * 목록의 「지도」 보기. 지금 조건에 맞는 원두만 점으로 그리고, 고른 원두를 오른쪽(1279px 이하는 아래) 카드로 보여 준다.
 * @example <ListMap products={mappedProducts(filtered)} />
 */
export function ListMap({ products }: { products: MappedProduct[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 고른 원두가 조건에서 빠지면 첫 원두를 보여 준다
  const selected = products.find((p) => p.id === selectedId) ?? products[0];
  const axis = "absolute text-xs text-muted";

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
          {products.map((p) => {
            const on = p.id === selected?.id;
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
                // 보이는 점 14(고른 점 22), 누르는 칸은 바깥으로 5씩 넓혀 24 이상
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0 before:absolute before:-inset-1.25 before:rounded-full before:content-[''] ${
                  on
                    ? "size-5.5 border-3 border-white bg-primary shadow-[0_0_0_2px_var(--color-primary)]"
                    : "size-3.5 border-0 bg-map-dot"
                }`}
              />
            );
          })}
        </div>
        <p className="mt-2.5 mb-0 text-sm text-muted">{ui.tasteMap.hint}</p>
      </div>

      {selected && (
        <div aria-live="polite" className="rounded-xl border border-line p-5">
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
            <Button href={`/coffee/${selected.id}`} kind="secondary">
              {ui.product.detail}
            </Button>
            <AddToCartButton
              productId={selected.id}
              title={selected.title}
              variant="primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
