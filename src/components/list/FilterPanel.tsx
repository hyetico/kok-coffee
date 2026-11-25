"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { CheckList } from "@/components/ui/CheckList";
import { TasteOptions } from "@/components/ui/TasteOptions";
import { ui } from "@/content/ui";
import { PRICE_BAND_IDS, TASTE_WORDS, TASTE_WORDS_SHOWN } from "@/lib/filter";
import { acidityBand, bodyBand, describePos } from "@/lib/taste";
import type {
  AcidityBand,
  BodyBand,
  ListFilter,
  MapPosition,
  ProductType,
} from "@/types";

type TypeKey = ProductType | "all";

type FilterPanelProps = {
  filter: ListFilter;
  /** 모든커피에서만 종류 라디오가 보인다 (싱글오리진 · 블렌드는 페이지가 이미 종류) */
  type: TypeKey | null;
  onType: (t: TypeKey) => void;
  onChange: (next: Partial<ListFilter>) => void;
  /** 테스트 후에만 맨 위에 「내 취향」 박스 */
  pin: MapPosition | null;
  /** 아래 시트는 줄이 조금 높다 (36) */
  sheet?: boolean;
};

const toggle = <T,>(list: readonly T[], v: T): T[] =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

/**
 * 「내 취향」 핀이 들어 있는 산미 · 바디 칸 — 「내 취향으로 거르기」가 맛 버튼을 여기에 맞춘다.
 * @example pinBands({ x: 74, y: 70 }) // { ac: "hi", bd: "lt" }
 */
export function pinBands(pin: MapPosition): { ac: AcidityBand; bd: BodyBand } {
  return { ac: acidityBand(pin), bd: bodyBand(pin) };
}

/**
 * 목록 필터 — 흰 바탕 체크 목록 5묶음(종류 · 카페인 · 가격 · 맛 · 향) + 테스트 후 「내 취향」 박스.
 * 웹은 왼쪽 칸, 1023px 이하는 같은 내용을 아래 시트에 넣는다 (05 「필터」, 06 기술서 4 · 5장).
 * @example <FilterPanel filter={filter} type="all" onType={setType} onChange={update} pin={pin} />
 */
export function FilterPanel({
  filter,
  type,
  onType,
  onChange,
  pin,
  sheet,
}: FilterPanelProps) {
  const t = ui.list;
  const hiddenOn = filter.tastes.some(
    (w) =>
      TASTE_WORDS.indexOf(w as (typeof TASTE_WORDS)[number]) >=
      TASTE_WORDS_SHOWN,
  );
  const [open, setOpen] = useState(false);
  // 가려진 향이 골라져 있으면 펼쳐 둔다 (06 기술서 8장)
  const showAll = open || hiddenOn;
  const words = showAll ? TASTE_WORDS : TASTE_WORDS.slice(0, TASTE_WORDS_SHOWN);

  const mine = pin ? pinBands(pin) : null;
  const filteredByMine =
    !!mine && filter.ac === mine.ac && filter.bd === mine.bd;

  const h3 = "m-0 mb-1 text-sm font-bold text-ink";

  return (
    <div className="flex flex-col gap-5">
      {pin && mine && (
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 rounded-lg bg-map-bg px-4 py-3 text-sm text-ink-2">
          <b className="text-ink">{t.myTaste.title}</b>
          <Link
            href="/taste-test"
            className="col-start-2 row-start-1 text-ink-2 underline underline-offset-3"
          >
            {t.myTaste.retry}
          </Link>
          <span>{describePos(pin)}</span>
          <Button
            kind="secondary"
            size="sm"
            aria-pressed={filteredByMine}
            onClick={() =>
              onChange(
                filteredByMine
                  ? { ac: null, bd: null }
                  : { ac: mine.ac, bd: mine.bd },
              )
            }
            className="col-span-full mt-2 w-full bg-bg"
          >
            {filteredByMine ? t.myTaste.filterOff : t.myTaste.filterOn}
          </Button>
        </div>
      )}

      {type && (
        <div>
          <h3 className={h3}>{t.type}</h3>
          <CheckList
            radio
            dense={!sheet}
            label={t.type}
            items={[
              { key: "all", label: t.all },
              { key: "blend", label: ui.product.typeLabels.blend },
              { key: "single", label: ui.product.typeLabels.single },
            ]}
            value={[type]}
            onToggle={onType}
          />
        </div>
      )}

      <div>
        <h3 className={h3}>{t.caffeine}</h3>
        <CheckList
          dense={!sheet}
          label={t.caffeine}
          items={[{ key: "decaf", label: t.decafOnly }]}
          value={filter.decaf ? ["decaf"] : []}
          onToggle={() => onChange({ decaf: !filter.decaf })}
        />
      </div>

      <div>
        <h3 className={h3}>{t.price}</h3>
        <CheckList
          dense={!sheet}
          label={t.price}
          items={PRICE_BAND_IDS.map((id) => ({
            key: id,
            label: t.priceBands[id],
          }))}
          value={filter.prices}
          onToggle={(id) => onChange({ prices: toggle(filter.prices, id) })}
        />
      </div>

      <div>
        <h3 className={h3}>{t.tasteRange}</h3>
        <TasteOptions
          name={t.acidity.name}
          ends={t.acidity.ends}
          options={[
            { key: "lo", label: t.acidity.bands.lo },
            { key: "mid", label: t.acidity.bands.mid },
            { key: "hi", label: t.acidity.bands.hi },
          ]}
          value={filter.ac}
          onChange={(ac) => onChange({ ac })}
          label={t.tasteGroupLabel(t.acidity.name, ...t.acidity.ends)}
        />
        <TasteOptions
          name={t.body.name}
          ends={t.body.ends}
          options={[
            { key: "lt", label: t.body.bands.lt },
            { key: "mid", label: t.body.bands.mid },
            { key: "hv", label: t.body.bands.hv },
          ]}
          value={filter.bd}
          onChange={(bd) => onChange({ bd })}
          label={t.tasteGroupLabel(t.body.name, ...t.body.ends)}
        />
      </div>

      <div>
        <h3 className={h3}>{t.aroma}</h3>
        <CheckList
          columns
          dense={!sheet}
          label={t.aroma}
          items={words.map((w) => ({ key: w, label: w }))}
          value={filter.tastes}
          onToggle={(w) => onChange({ tastes: toggle(filter.tastes, w) })}
        />
        {!hiddenOn && (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="group mx-auto mt-2 flex h-8 cursor-pointer items-center gap-1 rounded-md px-3 text-sm text-ink-2 hover:bg-map-bg hover:text-ink"
          >
            {open ? t.less : t.more(TASTE_WORDS.length - TASTE_WORDS_SHOWN)}
            <ChevronDownIcon
              size={14}
              strokeWidth={1.75}
              className="group-aria-expanded:rotate-180"
            />
          </button>
        )}
      </div>
    </div>
  );
}
