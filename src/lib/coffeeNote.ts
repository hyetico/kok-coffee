import { detail } from "@/content/detail";
import { ui } from "@/content/ui";
import type { Product } from "@/types";
import { listedProducts, splitNotes } from "./catalog";

// 상세 「콕 노트」 조립 규칙 (04 문서 8장 temp-content). 값은 프로토타입과 같다
// 실제 자료가 있는 상품(detail.overrides)은 그 값을 먼저 쓴다

type RoastKey = keyof typeof detail.note.roast;
export type ProfileRow = { label: string; value: number };

export type CoffeeNote = {
  notes: string[];
  images: string[];
  facts: { k: string; v: string }[];
  profile: ProfileRow[];
  profileNote: string;
  roast: { label: string; desc: string };
  intro: string;
  cards: { k: string; v: string; d: string }[];
  brew: readonly (readonly string[])[];
  info: { k: string; v: string }[];
};

/** 맛 프로필 기본값과 맛 노트 낱말별 가산점 (5점 만점) */
const PROFILE_BASE: Record<string, number> = {
  단맛: 3,
  쓴맛: 2.5,
  산미: 2.5,
  후미: 3,
  밸런스: 3,
  바디감: 3,
};
const PROFILE_RULES: [RegExp, [string, number][]][] = [
  [/달콤|초콜릿/, [["단맛", 1.5]]],
  [
    /쌉쌀/,
    [
      ["쓴맛", 1.5],
      ["바디감", 0.5],
    ],
  ],
  [/상큼|과일/, [["산미", 1.5]]],
  [
    /화사|꽃향기/,
    [
      ["산미", 1],
      ["후미", 0.5],
    ],
  ],
  [
    /묵직/,
    [
      ["바디감", 1.5],
      ["후미", 0.5],
    ],
  ],
  [/밸런스|부드러운/, [["밸런스", 1.5]]],
  [
    /깔끔/,
    [
      ["후미", 1],
      ["밸런스", 0.5],
    ],
  ],
  [
    /고소/,
    [
      ["단맛", 0.5],
      ["바디감", 0.5],
    ],
  ],
  [
    /은은|밀키/,
    [
      ["밸런스", 0.5],
      ["단맛", 0.5],
    ],
  ],
];

function profileOf(notes: string): ProfileRow[] {
  const w = { ...PROFILE_BASE };
  for (const [re, adds] of PROFILE_RULES)
    if (re.test(notes)) for (const [k, v] of adds) w[k] = Math.min(5, w[k] + v);
  return Object.entries(w).map(([label, value]) => ({ label, value }));
}

function roastOf(notes: string): RoastKey {
  if (/화사|꽃향기|과일|상큼/.test(notes)) return "light";
  if (/쌉쌀|묵직/.test(notes)) return "mediumDark";
  return "medium";
}

/**
 * 상품 하나의 상세 내용(맛 프로필 · 소개 · 맛 노트 카드 · 추천 추출법 · 상품 정보)을 만든다.
 * @example coffeeNote(getProduct("p7")!).intro
 */
export function coffeeNote(p: Product): CoffeeNote {
  const o =
    p.id in detail.overrides
      ? detail.overrides[p.id as keyof typeof detail.overrides]
      : undefined;
  const typeLabel = ui.product.typeLabels[p.type];
  const parts = splitNotes(p.notes);
  const roastKey: RoastKey =
    (o?.roast as RoastKey | undefined) ?? roastOf(p.notes);
  const roast = detail.note.roast[roastKey];
  const n = detail.note;

  const intro =
    n.introLead(p.roastery, typeLabel) +
    parts.join(n.introJoiner) +
    n.introMid +
    (p.type === "single" ? n.introBySingle : n.introByBlend) +
    (p.decaf ? n.introDecaf : "");

  return {
    notes: o ? [...o.notes] : parts,
    images: o ? [...o.images] : [p.image],
    facts: [
      ...(o
        ? o.facts.map((f) => ({ ...f }))
        : [
            { k: detail.facts.roastery, v: p.roastery },
            {
              k: detail.facts.type,
              v: typeLabel + (p.decaf ? detail.facts.decafSuffix : ""),
            },
          ]),
      { k: detail.facts.shipping, v: detail.facts.shippingValue },
    ],
    profile: o
      ? o.profile.map(([label, value]) => ({ label, value }))
      : profileOf(p.notes),
    profileNote: o?.profileNote ?? detail.profile.note,
    roast,
    intro,
    cards: [
      ...parts.map((w, i) => ({
        k: n.noteCard(i + 1),
        v: w,
        d: n.noteDesc[w] ?? "",
      })),
      // 카드에는 괄호 앞 이름만 (「미디엄 (중배전)」 → 「미디엄」)
      { k: n.roastCard, v: roast.label.split(" (")[0], d: roast.desc },
    ],
    brew: p.type === "single" ? n.brewSingle : n.brewBlend,
    info: [
      { k: n.info.roastery, v: p.roastery },
      { k: n.info.type, v: typeLabel },
      { k: n.info.notes, v: p.notes },
      {
        k: n.info.caffeine,
        v: p.decaf ? n.info.caffeineDecaf : n.info.caffeineRegular,
      },
      { k: n.info.size, v: n.info.sizeValue },
      { k: n.info.ship, v: n.info.shipValue },
    ],
  };
}

/**
 * 「비슷한 맛의 원두」 4개: 첫 맛 노트가 같은 원두 먼저, 모자라면 같은 종류로 채운다. 브랜드 전용 상품은 뺀다.
 * @example relatedProducts(getProduct("p7")!)
 */
export function relatedProducts(p: Product, count = 4): Product[] {
  const first = splitNotes(p.notes)[0] ?? "";
  const others = listedProducts().filter((x) => x.id !== p.id);
  const same = others.filter((x) => x.notes.includes(first));
  const byType = others.filter(
    (x) => !x.notes.includes(first) && x.type === p.type,
  );
  return [...same, ...byType].slice(0, count);
}
