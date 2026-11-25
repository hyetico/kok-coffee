"use client";

import Link from "next/link";
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { ArrowDownIcon, ArrowRightIcon, CloseIcon } from "@/components/icons";
import { ui } from "@/content/ui";
import type { MappedProduct } from "@/lib/catalog";
import {
  acidityRange,
  bodyRange,
  describePos,
  groupByTaste,
  nearest,
  tasteKey,
  toPos,
} from "@/lib/taste";
import type { AcidityBand, BodyBand, MapPosition } from "@/types";

/** 안쪽 여백(--m) 안에서 0–100 좌표를 그린다 — 기기마다 --m만 바꾸면 가장자리 점이 잘리지 않는다 (06 기술서 9장) */
const at = ({ x, y }: MapPosition): CSSProperties => ({
  left: `calc(var(--m) + (100% - 2 * var(--m)) * ${x / 100})`,
  top: `calc(var(--m) + (100% - 2 * var(--m)) * ${y / 100})`,
});

const DIR = {
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
} as const;

/**
 * 방향키로 옮길 다음 점 — 그 방향 45° 부채꼴 안에서 「방향 거리 + 옆 거리 × 2」가 가장 작은 점 (06 기술서 10-3장).
 * @example nextInDirection({ x: 50, y: 50 }, dots, "ArrowRight")
 */
export function nextInDirection(
  cur: MapPosition,
  all: { key: string; pos: MapPosition }[],
  key: keyof typeof DIR,
): string | null {
  const [ux, uy] = DIR[key];
  let best: string | null = null;
  let score = Infinity;
  for (const d of all) {
    const dx = d.pos.x - cur.x;
    const dy = d.pos.y - cur.y;
    const along = dx * ux + dy * uy;
    const side = Math.abs(dx * uy - dy * ux);
    if (along <= 0 || side > along) continue;
    const s = along + side * 2;
    if (s < score) {
      score = s;
      best = d.key;
    }
  }
  return best;
}

type ListMapProps = {
  /** 지금 종류 안의 원두 전부 — 필터 밖 원두도 흐리게 그린다 */
  products: MappedProduct[];
  /** 필터를 통과한 원두 id */
  passing: Set<string>;
  /** 고른 원두 id (묶음이면 그중 하나) */
  pickId: string | null;
  onPick: (id: string | null) => void;
  ac: AcidityBand[];
  bd: BodyBand[];
  pin: MapPosition | null;
  /** 테스트 전 「30초 테스트」 안내를 보일지 */
  showHint: boolean;
  onCloseHint: () => void;
  /** 「목록에서 보기」 — 목록 제목으로 내려간다 */
  onGoList: () => void;
};

/**
 * 목록 맨 위 맛 지도 — 점을 고르면 정보 창 없이 아래 목록이 「고른 원두 → 맛이 가까운 순」으로 바뀐다 (06 기술서 4 · 5장).
 * 산미 · 바디를 고르면 구간 상자, 필터 밖 점은 흐리게. 키보드는 Tab 한 번으로 들어와 방향키로 점 사이를 옮긴다.
 * @example <ListMap products={typed} passing={ids} pickId={pick} onPick={setPick} ac={[]} bd={[]} pin={null} showHint onCloseHint={close} onGoList={go} />
 */
export function ListMap({
  products,
  passing,
  pickId,
  onPick,
  ac,
  bd,
  pin,
  showHint,
  onCloseHint,
  onGoList,
}: ListMapProps) {
  const groups = groupByTaste(products);
  const anchor = products.find((p) => p.id === pickId) ?? null;
  const activeKey = anchor ? tasteKey(anchor.taste) : null;
  const nears = anchor ? nearest(anchor.taste, products, 3) : [];

  const [focusKey, setFocusKey] = useState<string | null>(null);
  const tabKey =
    (focusKey && groups.some((g) => g.key === focusKey) && focusKey) ||
    activeKey ||
    groups[0]?.key;
  const boxRef = useRef<HTMLDivElement>(null);
  const focusDot = (key: string) =>
    requestAnimationFrame(() =>
      boxRef.current
        ?.querySelector<HTMLButtonElement>(`[data-key="${key}"]`)
        ?.focus(),
    );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && anchor) {
      onPick(null);
      return;
    }
    if (!(e.key in DIR)) return;
    const el = e.target as HTMLElement;
    const key = el.dataset.key;
    if (!key) return;
    e.preventDefault();
    const cur = groups.find((g) => g.key === key);
    if (!cur) return;
    const next = nextInDirection(
      toPos(cur.items[0].taste),
      groups
        .filter((g) => g.key !== key)
        .map((g) => ({ key: g.key, pos: toPos(g.items[0].taste) })),
      e.key as keyof typeof DIR,
    );
    if (next) {
      setFocusKey(next);
      focusDot(next);
    }
  };

  // 산미 · 바디 구간 상자 — 고른 칸마다 하나, 둘레를 12씩 넓혀 점이 상자 안에 들어오게
  const zones: CSSProperties[] = [];
  if (ac.length || bd.length) {
    const xs = ac.length ? ac.map(acidityRange) : [[0, 100] as const];
    const ys = bd.length ? bd.map(bodyRange) : [[0, 100] as const];
    for (const [x1, x2] of xs)
      for (const [y1, y2] of ys)
        zones.push({
          left: `calc(var(--m) + (100% - 2 * var(--m)) * ${x1 / 100} - 12px)`,
          top: `calc(var(--m) + (100% - 2 * var(--m)) * ${y1 / 100} - 12px)`,
          width: `calc((100% - 2 * var(--m)) * ${(x2 - x1) / 100} + 24px)`,
          height: `calc((100% - 2 * var(--m)) * ${(y2 - y1) / 100} + 24px)`,
        });
  }

  const m = ui.tasteMap;
  const label = "pointer-events-none absolute text-xs font-semibold text-muted";
  const corner =
    "pointer-events-none absolute hidden text-xs font-semibold text-map-corner sm:block";
  const hint = (
    <>
      <span className="flex-1">{m.testHint.question}</span>
      <Link
        href="/taste-test"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex min-h-6 items-center gap-1 font-bold text-primary no-underline hover:underline"
      >
        {m.testHint.link}
        <ArrowRightIcon />
      </Link>
      <button
        type="button"
        aria-label={m.testHint.close}
        onClick={(e) => {
          e.stopPropagation();
          onCloseHint();
        }}
        className="-ml-1 inline-grid size-6 cursor-pointer place-items-center rounded-md p-0 text-muted hover:text-ink"
      >
        <CloseIcon size={16} strokeWidth={2.4} />
      </button>
    </>
  );

  return (
    <>
      {/* 빈 곳을 누르면 고른 점을 푼다(키보드는 Esc) — 점 · 버튼은 stopPropagation으로 번지지 않게 한다 */}
      <div
        ref={boxRef}
        role="group"
        aria-label={m.label}
        aria-roledescription={m.roledescription}
        onKeyDown={onKeyDown}
        onClick={() => anchor && onPick(null)}
        className="relative mt-4 h-110 touch-pan-y overflow-hidden rounded-2xl bg-surface [--m:32px] max-sm:aspect-square max-sm:h-auto max-sm:[--m:24px] lg:h-140 lg:[--m:48px]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-(--m) bottom-(--m) left-1/2 w-px bg-map-axis"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-(--m) left-(--m) h-px bg-map-axis"
        />
        <span
          aria-hidden="true"
          className={`${label} top-3.5 left-1/2 -translate-x-1/2`}
        >
          {m.axes.heavy}
        </span>
        <span
          aria-hidden="true"
          className={`${label} bottom-3.5 left-1/2 -translate-x-1/2`}
        >
          {m.axes.light}
        </span>
        <span
          aria-hidden="true"
          className={`${label} top-1/2 left-3.5 -translate-y-1/2`}
        >
          {m.axes.nutty}
        </span>
        <span
          aria-hidden="true"
          className={`${label} top-1/2 right-3.5 -translate-y-1/2`}
        >
          {m.axes.bright}
        </span>
        <span aria-hidden="true" className={`${corner} top-12 left-14`}>
          {m.corners[0]}
        </span>
        <span aria-hidden="true" className={`${corner} top-12 right-14`}>
          {m.corners[1]}
        </span>
        <span aria-hidden="true" className={`${corner} bottom-12 left-14`}>
          {m.corners[2]}
        </span>
        <span aria-hidden="true" className={`${corner} right-14 bottom-19`}>
          {m.corners[3]}
        </span>

        {zones.map((z, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={z}
            className="pointer-events-none absolute rounded-lg bg-[rgb(31_77_58/.08)] shadow-[inset_0_0_0_1.5px_rgb(31_77_58/.35)]"
          />
        ))}

        {nears.map((p) => (
          <span
            key={p.id}
            aria-hidden="true"
            style={at(toPos(p.taste))}
            className="pointer-events-none absolute -mt-3.5 -ml-3.5 box-border size-7 rounded-full border-[1.5px] border-dashed border-primary"
          />
        ))}

        {groups.map(({ key, items }) => {
          const p = items[0];
          const multi = items.length > 1;
          const on = key === activeKey;
          const live = items.some((q) => passing.has(q.id));
          const name = multi ? ui.list.pick.group(items.length) : p.title;
          return (
            <button
              key={key}
              type="button"
              data-key={key}
              tabIndex={key === tabKey ? 0 : -1}
              aria-pressed={on}
              aria-label={
                multi
                  ? ui.mapGroup.aria(
                      items.length,
                      items.map((q) => q.title),
                    )
                  : `${p.title}, ${describePos(toPos(p.taste))}`
              }
              onFocus={() => setFocusKey(key)}
              onClick={(e) => {
                e.stopPropagation();
                onPick(on ? null : p.id);
              }}
              style={at(toPos(p.taste))}
              // 보이는 점 16(묶음 28), 누르는 칸은 바깥으로 8씩 넓힌다
              className={`group absolute box-border grid cursor-pointer place-items-center rounded-full p-0 text-xs font-bold text-white transition-transform duration-150 after:absolute after:-inset-2 after:rounded-full after:content-[''] motion-reduce:transition-none ${
                multi
                  ? "-mt-3.5 -ml-3.5 size-7 border-0 bg-ink-2"
                  : "-mt-2 -ml-2 size-4 border-2 border-white bg-map-dot hover:scale-125"
              } ${live ? "" : "opacity-28"} ${
                on
                  ? `z-2 border-primary bg-primary shadow-[0_0_0_3px_#fff,0_0_0_5px_var(--color-primary)] ${multi ? "" : "scale-115 hover:scale-115"}`
                  : ""
              }`}
            >
              {multi ? items.length : null}
              {/* 점 이름 말풍선 — 올리거나 초점이 오거나 고르면 보인다 */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-5 -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-xs leading-[1.4] font-semibold whitespace-nowrap text-white group-hover:block group-focus-visible:block ${
                  on ? "block" : "hidden"
                }`}
              >
                {name}
              </span>
            </button>
          );
        })}

        {pin && (
          <span
            aria-hidden="true"
            style={at(pin)}
            className="pointer-events-none absolute z-3 flex -translate-x-1/2 -translate-y-full flex-col items-center max-sm:-translate-y-1/2"
          >
            <b className="h-6 rounded-xl bg-ink px-2 text-xs leading-6 font-bold whitespace-nowrap text-white max-sm:hidden">
              {m.pin}
            </b>
            <i className="h-2.5 w-0.5 bg-ink max-sm:hidden" />
            <s className="-mt-px box-border size-2.5 rounded-full bg-white shadow-[inset_0_0_0_3px_var(--color-ink)] max-sm:m-0 max-sm:size-5.5 max-sm:bg-white/60" />
          </span>
        )}

        {!pin && !anchor && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-10 left-1/2 z-4 hidden -translate-x-1/2 rounded-[14px] bg-white/90 px-3 py-2 text-xs whitespace-nowrap text-ink-2 sm:block"
          >
            {m.tip}
          </span>
        )}

        {anchor ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGoList();
            }}
            className="absolute right-4 bottom-4 z-6 inline-flex h-10 cursor-pointer items-center gap-2 rounded-[20px] bg-primary px-4 text-sm font-bold text-white shadow-[0_2px_8px_rgba(23,32,27,.16)] hover:bg-primary-hover"
          >
            {m.goList}
            <ArrowDownIcon />
          </button>
        ) : (
          showHint && (
            <div className="absolute right-4 bottom-4 z-6 hidden items-center gap-3 rounded-full bg-white py-2 pr-2 pl-4 text-sm text-ink-2 shadow-[0_2px_8px_rgba(23,32,27,.12)] sm:flex">
              {hint}
            </div>
          )
        )}
      </div>

      <div
        aria-hidden="true"
        className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted"
      >
        {pin && (
          <span className="inline-flex items-center gap-2">
            <i className="size-3 flex-none rounded-full bg-white shadow-[inset_0_0_0_3px_var(--color-ink)]" />
            {m.legend.pin}
          </span>
        )}
        <span className="inline-flex items-center gap-2">
          <i className="box-border size-4 flex-none rounded-full border-2 border-white bg-map-dot shadow-[0_0_0_1px_var(--color-line)]" />
          {m.legend.dot}
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="box-border size-4 flex-none rounded-full border-2 border-white bg-map-dot opacity-28 shadow-[0_0_0_1px_var(--color-line)]" />
          {m.legend.dim}
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="inline-grid size-5 flex-none place-items-center rounded-full bg-ink-2 text-[10px] font-bold text-white not-italic">
            2
          </i>
          {m.legend.group}
        </span>
      </div>

      {!anchor && showHint && (
        <div className="mt-2 flex items-center gap-3 rounded-lg bg-map-bg py-2 pr-2 pl-3 text-sm text-ink-2 sm:hidden">
          {hint}
        </div>
      )}
    </>
  );
}
