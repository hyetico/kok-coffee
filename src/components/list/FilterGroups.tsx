"use client";

import { Chip } from "@/components/ui/Chip";
import { ui } from "@/content/ui";
import { PRICE_BAND_IDS, TASTE_WORDS } from "@/lib/filter";
import type { ListFilter, PriceBandId } from "@/types";

type FilterGroupsProps = {
  filter: ListFilter;
  onToggleDecaf: () => void;
  onTogglePrice: (id: PriceBandId) => void;
  onToggleTaste: (word: string) => void;
  /** side: 웹 왼쪽 필터 상자 · sheet: 1023px 이하 아래 시트 */
  variant: "side" | "sheet";
  /** side에서 첫 줄 오른쪽에 둘 「초기화」 */
  resetSlot?: React.ReactNode;
};

/**
 * 카페인 · 가격 · 맛과 향 칩 묶음. 왼쪽 필터와 아래 시트가 같은 조건을 같은 칩으로 보여 준다.
 * @example <FilterGroups variant="sheet" filter={f} onToggleDecaf={…} onTogglePrice={…} onToggleTaste={…} />
 */
export function FilterGroups({
  filter,
  onToggleDecaf,
  onTogglePrice,
  onToggleTaste,
  variant,
  resetSlot,
}: FilterGroupsProps) {
  const side = variant === "side";
  const Title = side ? "h2" : "h3";
  const title = `m-0 text-base font-bold ${side ? "leading-8" : ""}`;
  return (
    <>
      {side ? (
        <div className="flex h-10 items-center justify-between">
          <h2 className="m-0 text-base font-bold">{ui.list.caffeine}</h2>
          {resetSlot}
        </div>
      ) : (
        <h3 className={title}>{ui.list.caffeine}</h3>
      )}
      <div
        role="group"
        aria-label={ui.list.caffeine}
        className={`flex gap-2 ${side ? "mt-1 mb-6" : "mt-3 mb-6"}`}
      >
        <Chip pressed={filter.decaf} onClick={onToggleDecaf}>
          {ui.product.decaf}
        </Chip>
      </div>

      <Title className={title}>{ui.list.price}</Title>
      <div
        role="group"
        aria-label={ui.list.priceGroupLabel}
        className={`flex flex-wrap gap-2 ${side ? "mt-2 mb-6" : "mt-3 mb-6"}`}
      >
        {PRICE_BAND_IDS.map((id) => (
          <Chip
            key={id}
            pressed={filter.prices.includes(id)}
            onClick={() => onTogglePrice(id)}
          >
            {ui.list.priceBands[id]}
          </Chip>
        ))}
      </div>

      <Title className={title}>{ui.list.taste}</Title>
      {!side && (
        <p className="mt-1 mb-0 text-sm text-muted">
          {ui.list.multiSelectHint}
        </p>
      )}
      <div
        role="group"
        aria-label={ui.list.tasteGroupLabel}
        className={`flex flex-wrap gap-2 ${side ? "mt-2" : "mt-3.5"}`}
      >
        {TASTE_WORDS.map((w) => (
          <Chip
            key={w}
            pressed={filter.tastes.includes(w)}
            onClick={() => onToggleTaste(w)}
          >
            {w}
          </Chip>
        ))}
      </div>
    </>
  );
}
