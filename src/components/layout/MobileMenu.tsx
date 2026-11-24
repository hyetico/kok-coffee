"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { navItems, ui } from "@/content/ui";
import { activeNavKey } from "./nav";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  cartCount: number;
};

/**
 * 1023px 이하 ☰로 여는 오른쪽 드로어. 네이티브 <dialog>의 모달 동작으로 초점 잠금 · ESC 닫기 · 닫은 뒤 ☰로 초점 되돌림을 맡긴다.
 * @example <MobileMenu open={open} onClose={() => setOpen(false)} cartCount={n} />
 */
export function MobileMenu({ open, onClose, cartCount }: MobileMenuProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  // 드로어 안에서는 싱글오리진 · 블렌드 구분 없이 주소로만 현재 메뉴를 정한다 (쿼리를 읽으면 Suspense가 필요)
  const active = activeNavKey(pathname, null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // 열려 있는 동안 뒤 페이지 스크롤 잠금 (CLAUDE.md 6장)
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // 페이지를 옮기면 닫는다
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 주소가 바뀔 때만
  }, [pathname]);

  return (
    <dialog
      ref={ref}
      aria-label={ui.mobileMenu.label}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      // 뒤 어두운 영역(= dialog 자신)을 누르면 닫힌다
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(320px,86vw)] max-w-none overflow-y-auto bg-bg p-0 pb-6 text-ink shadow-[0_24px_64px_rgba(23,32,27,.24)] backdrop:bg-black/50 open:flex open:flex-col open:animate-[drawer-in_.25s_ease] motion-reduce:open:animate-none lg:hidden"
    >
      <div className="flex min-h-14 items-center justify-between border-b border-line px-4 sm:px-5">
        <Link
          href="/"
          aria-label={ui.header.homeLabel}
          className="block w-18 shrink-0"
        >
          <Image
            src="/images/logo.webp"
            alt=""
            width={240}
            height={85}
            className="block h-auto w-full"
          />
        </Link>
        {/* 열리면 초점이 닫기 버튼에 온다 (03 「메뉴 드로어」) */}
        <button
          type="button"
          autoFocus
          aria-label={ui.mobileMenu.close}
          onClick={() => ref.current?.close()}
          className="-mr-2.5 inline-grid size-11 place-items-center rounded-lg text-ink hover:bg-surface"
        >
          <CloseIcon />
        </button>
      </div>

      <nav aria-label={ui.mobileMenu.label} className="flex flex-col py-2">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={item.key === active ? "page" : undefined}
            className="flex min-h-13 items-center px-4 text-lg font-semibold text-ink no-underline hover:bg-surface aria-[current=page]:bg-surface aria-[current=page]:text-primary aria-[current=page]:shadow-[inset_3px_0_0_var(--color-primary)] sm:px-5"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto grid gap-2 border-t border-line px-4 pt-4 sm:px-5">
        <Button href="/cart" kind="secondary" block>
          {ui.mobileMenu.cart(cartCount)}
        </Button>
        <Button href="/taste-test" kind="primary" block>
          {ui.mobileMenu.tasteTest}
        </Button>
      </div>
    </dialog>
  );
}
