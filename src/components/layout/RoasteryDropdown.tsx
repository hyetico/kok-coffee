"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { ui } from "@/content/ui";
import { getRoasteries } from "@/lib/catalog";

/**
 * 홈(웹)의 「로스터리」 메뉴. 누르면 헤더 아래 전체 폭으로 16곳이 펼쳐진다 (원본 kokewep 브랜드 드롭다운 계승).
 * 다른 페이지 · 1023px 이하는 그냥 /roasteries 링크를 쓴다.
 * @example <RoasteryDropdown itemHeight="h-11" />
 */
export function RoasteryDropdown({ itemHeight }: { itemHeight: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const roasteries = getRoasteries();

  useEffect(() => {
    // <details>는 바깥을 누르거나 ESC를 눌러도 닫히지 않아 직접 닫는다
    const onClick = (e: MouseEvent) => {
      const d = ref.current;
      if (d?.open && !d.contains(e.target as Node)) d.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      const d = ref.current;
      if (e.key === "Escape" && d?.open) {
        d.open = false;
        d.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => {
    if (ref.current) ref.current.open = false;
  };

  return (
    // 펼침 패널은 헤더(sticky = 기준 상자) 기준으로 전체 폭에 놓이도록 details는 static
    <details ref={ref} className="group static">
      <summary
        className={`relative flex ${itemHeight} cursor-pointer list-none items-center border-b-2 border-transparent text-base font-medium text-muted before:absolute before:inset-y-0 before:-inset-x-2 hover:text-ink group-open:border-primary group-open:font-bold group-open:text-ink`}
      >
        {ui.roasteryMenu.label}
        <ChevronDownIcon className="ml-1 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="absolute inset-x-0 top-full z-35 border-y border-line bg-bg pt-7 pb-8 whitespace-normal shadow-[0_16px_32px_rgba(23,32,27,.10)]">
        <div className="page-wrap">
          <div className="mb-4 flex items-center justify-between">
            <p className="m-0 text-base font-bold text-ink">
              {ui.roasteryMenu.title}{" "}
              <span className="font-medium text-muted">
                {ui.roasteryMenu.count(roasteries.length)}
              </span>
            </p>
            <Button href="/roasteries" kind="ghost" size="sm" onClick={close}>
              {ui.roasteryMenu.viewAll}
            </Button>
          </div>
          <ul className="m-0 grid list-none grid-cols-4 gap-x-4 gap-y-1 p-0">
            {roasteries.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/roasteries/${r.id}`}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium text-ink no-underline hover:bg-surface"
                >
                  <Image
                    src={r.logo}
                    alt=""
                    width={36}
                    height={36}
                    className="size-9 rounded-full object-cover shadow-[0_0_0_1px_var(--color-line-soft)]"
                  />
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
