"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { roasteryContent } from "@/content/roastery";
import type { Roastery } from "@/types";

/**
 * 로스터리 목록 — 이름 검색 + 로고 카드 그리드 (웹 6열 · 태블릿 3열 · 모바일 2열).
 * @example <RoasteryGrid roasteries={getRoasteries()} />
 */
export function RoasteryGrid({ roasteries }: { roasteries: Roastery[] }) {
  const [q, setQ] = useState("");
  const t = roasteryContent.list;
  const query = q.trim();
  const items = roasteries.filter((r) => !query || r.name.includes(query));

  return (
    <>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 text-[28px] font-bold">
            {t.title}{" "}
            <span className="text-primary">{t.count(items.length)}</span>
          </h1>
          <p className="mt-2 mb-0 text-base text-muted">{t.desc}</p>
        </div>
        <SearchInput
          id="roastery-q"
          label={t.searchLabel}
          placeholder={t.searchLabel}
          value={q}
          onChange={setQ}
          className="min-w-60 flex-[0_1_360px]"
        />
      </div>

      {items.length > 0 ? (
        <ul className="m-0 mt-7 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {items.map((r) => (
            <li key={r.id}>
              <Link
                href={`/roasteries/${r.id}`}
                className="flex flex-col items-center gap-3 rounded-lg border border-line-soft px-3 py-6 text-center no-underline"
              >
                <Image
                  src={r.logo}
                  alt=""
                  width={88}
                  height={88}
                  className="size-22 rounded-full object-cover shadow-[0_0_0_1px_var(--color-line-soft)]"
                />
                <span className="text-base leading-[1.4] font-bold text-ink">
                  {r.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-7 rounded-lg bg-surface px-6 py-14 text-center">
          <p className="m-0 text-lg font-bold">{t.emptyTitle}</p>
          <p className="mt-2 mb-0 text-sm text-muted">{t.emptyDesc}</p>
        </div>
      )}
    </>
  );
}
