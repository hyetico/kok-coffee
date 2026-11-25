"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CloseIcon } from "@/components/icons";
import { ProductThumb } from "@/components/product/ProductThumb";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { RemovableChip } from "@/components/ui/RemovableChip";
import { SearchInput } from "@/components/ui/SearchInput";
import { ui } from "@/content/ui";
import { getProduct, listedProducts } from "@/lib/catalog";
import { DEFAULT_FILTER, filterProducts, toListQuery } from "@/lib/filter";
import { formatWon } from "@/lib/format";
import { useSearchStore } from "@/store/search";
import type { Product } from "@/types";

const MAX_PREVIEW = 5;
// 서버 렌더용 빈 목록은 같은 참조여야 한다 (useSyncExternalStore 규칙)
const NO_RECENT: string[] = [];

type SearchLayerProps = {
  open: boolean;
  onClose: () => void;
  /** 열릴 때 입력 칸에 넣어 둘 글 (목록에서 열면 지금 검색어) */
  initialQuery?: string;
};

function ProductRow({
  product,
  onPick,
}: {
  product: Product;
  onPick: () => void;
}) {
  return (
    <li>
      <Link
        href={`/coffee/${product.id}`}
        onClick={onPick}
        className="flex items-center gap-3 rounded-lg p-2 text-ink no-underline hover:bg-surface"
      >
        <ProductThumb src={product.image} size={52} />
        <span className="min-w-0">
          <span className="block text-xs text-muted">{product.roastery}</span>
          <span className="block text-base font-semibold">{product.title}</span>
          <span className="block text-sm text-muted">
            {product.notes}, {formatWon(product.price)}
          </span>
        </span>
      </Link>
    </li>
  );
}

function SectionTitle({
  children,
  live,
}: {
  children: React.ReactNode;
  live?: boolean;
}) {
  return (
    <h2
      aria-live={live ? "polite" : undefined}
      className="m-0 text-sm font-bold"
    >
      {children}
    </h2>
  );
}

/**
 * 헤더 위를 덮는 검색 레이어. 입력하는 동안 미리 보기(최대 5개), Enter · 추천어 · 모두 보기는 /coffee?q= 로 이동.
 * 네이티브 <dialog> 모달로 초점 잠금 · ESC 닫기 · 닫은 뒤 초점 되돌림을 맡긴다.
 * @example <SearchLayer open={open} onClose={() => setOpen(false)} />
 */
export function SearchLayer({
  open,
  onClose,
  initialQuery = "",
}: SearchLayerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  // 닫으면 연 버튼으로 초점을 직접 돌려보낸다 (브라우저마다 dialog의 초점 되돌림이 다르다)
  const openerRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const recent = useSyncExternalStore(
    useSearchStore.subscribe,
    () => useSearchStore.getState().recent,
    () => NO_RECENT,
  );
  const { addRecent, removeRecent, clearRecent } = useSearchStore.getState();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const close = () => ref.current?.close();

  const go = (keyword: string) => {
    const k = keyword.trim();
    if (!k) return;
    addRecent(k);
    close();
    router.push(`/coffee${toListQuery({ ...DEFAULT_FILTER, q: k })}`);
  };

  const query = q.trim();
  const hits = query
    ? filterProducts(listedProducts(), { ...DEFAULT_FILTER, q: query })
    : [];
  const popular = ui.search.popularProductIds
    .map((id) => getProduct(id))
    .filter((p): p is Product => Boolean(p));

  return (
    <dialog
      ref={ref}
      aria-label={ui.search.label}
      onClose={() => {
        document.documentElement.style.overflow = "";
        openerRef.current?.focus();
        setQ(initialQuery);
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="fixed inset-x-0 top-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-bg p-0 pt-3 pb-10 text-ink shadow-[0_12px_32px_rgba(23,32,27,.16)] [scrollbar-color:var(--color-footer-line)_transparent] [scrollbar-width:thin] backdrop:bg-[rgba(23,32,27,.5)] lg:bottom-auto lg:h-auto lg:max-h-full lg:pt-6"
    >
      <div className="page-wrap">
        <div className="flex items-center gap-2">
          <SearchInput
            id="header-search"
            label={ui.search.label}
            placeholder={ui.search.placeholder}
            value={q}
            onChange={setQ}
            onEnter={go}
            size="lg"
            autoFocus
            inputRef={inputRef}
            className="flex-1"
          />
          <button
            type="button"
            aria-label={ui.search.close}
            onClick={close}
            className="grid size-13 shrink-0 cursor-pointer place-items-center rounded-lg border border-line-control bg-bg text-ink hover:border-ink hover:bg-surface"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-12">
          <div>
            {recent.length > 0 && (
              <>
                <div className="mb-3 flex min-h-7 items-center justify-between">
                  <SectionTitle>{ui.search.recent}</SectionTitle>
                  <Button kind="text" onClick={clearRecent} className="min-h-7">
                    {ui.search.clearRecent}
                  </Button>
                </div>
                <ul className="m-0 mb-7 flex list-none flex-wrap gap-2 p-0">
                  {recent.map((k) => (
                    <li key={k}>
                      <RemovableChip
                        label={k}
                        removeLabel={ui.search.removeRecent(k)}
                        onPick={() => go(k)}
                        onRemove={() => removeRecent(k)}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="mb-3 flex min-h-7 items-center">
              <SectionTitle>{ui.search.suggested}</SectionTitle>
            </div>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {ui.search.suggestedKeywords.map((k) => (
                <li key={k}>
                  <Chip onClick={() => go(k)}>{k}</Chip>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {!query && (
              <>
                <div className="mb-3 flex min-h-7 items-center">
                  <SectionTitle>{ui.search.popular}</SectionTitle>
                </div>
                <ul className="-mx-2 my-0 grid list-none gap-0.5 p-0">
                  {popular.map((p) => (
                    <ProductRow key={p.id} product={p} onPick={close} />
                  ))}
                </ul>
              </>
            )}
            {hits.length > 0 && (
              <>
                <div className="mb-3 flex min-h-7 items-center">
                  <SectionTitle live>
                    {ui.search.preview}{" "}
                    <span className="font-medium text-muted">
                      {ui.list.countOnly(hits.length)}
                    </span>
                  </SectionTitle>
                </div>
                <ul className="-mx-2 my-0 grid list-none gap-0.5 p-0">
                  {hits.slice(0, MAX_PREVIEW).map((p) => (
                    <ProductRow key={p.id} product={p} onPick={close} />
                  ))}
                </ul>
                <Button
                  kind="primary"
                  block
                  className="mt-4"
                  onClick={() => go(q)}
                >
                  {ui.search.viewAll(hits.length)}
                </Button>
              </>
            )}
            {query && hits.length === 0 && (
              <div className="rounded-xl bg-surface px-5 py-8 text-center">
                <p className="m-0 text-base font-bold">
                  {ui.search.noHitsTitle}
                </p>
                <p className="mt-1.5 mb-0 text-sm text-muted">
                  {ui.search.noHitsDesc}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
