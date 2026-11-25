"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  /** 아래 고정 버튼 줄 */
  footer: ReactNode;
  children: ReactNode;
};

/**
 * 화면 아래에서 올라오는 시트 (모바일 · 태블릿 필터). 최대 높이 80%, 위 모서리 16, 머리 56.
 * 네이티브 <dialog> 모달로 초점 잠금 · ESC 닫기 · 초점 되돌림을 맡긴다.
 * @example <BottomSheet open={open} onClose={close} title="필터" closeLabel="필터 닫기" footer={…}>…</BottomSheet>
 */
export function BottomSheet({
  open,
  onClose,
  title,
  closeLabel,
  footer,
  children,
}: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  // 닫으면 연 버튼으로 초점을 직접 돌려보낸다 (브라우저마다 dialog의 초점 되돌림이 다르다)
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={() => {
        document.documentElement.style.overflow = "";
        openerRef.current?.focus();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85%] w-full max-w-none flex-col rounded-t-2xl bg-bg p-0 text-ink shadow-[0_-12px_40px_rgba(23,32,27,.2)] backdrop:bg-[rgba(23,32,27,.5)] open:flex"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line-soft pr-2 pl-5">
        <h2 id={titleId} className="m-0 text-lg font-bold">
          {title}
        </h2>
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => ref.current?.close()}
          className="inline-grid size-11 cursor-pointer place-items-center rounded-lg text-ink hover:bg-surface"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="overflow-y-auto px-5 pb-2 [scrollbar-color:var(--color-footer-line)_transparent] [scrollbar-width:thin]">
        {children}
      </div>
      <div className="grid shrink-0 grid-cols-[1fr_2fr] gap-2 border-t border-line-soft px-5 pt-3 pb-5">
        {footer}
      </div>
    </dialog>
  );
}
