"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CartIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { navItems, ui, type NavKey } from "@/content/ui";
import { useCartCount } from "@/hooks/useCartCount";
import { activeNavKey } from "./nav";
import { MobileMenu } from "./MobileMenu";

const iconButton =
  "inline-grid size-11 shrink-0 place-items-center rounded-lg text-ink hover:bg-surface aria-expanded:bg-surface";

function Logo() {
  return (
    <Link
      href="/"
      aria-label={ui.header.homeLabel}
      className="block w-18 shrink-0 lg:w-24 lg:justify-self-start"
    >
      {/* 로고 원본은 240×85 래스터뿐 (CONTENT_TODO) — 글자 이미지라 이름은 링크가 읽는다 */}
      <Image
        src="/images/logo.webp"
        alt=""
        width={240}
        height={85}
        priority
        className="block h-auto w-full"
      />
    </Link>
  );
}

/** 현재 메뉴는 ink 굵게 + primary 밑줄이 헤더 아래 선 위에 겹친다 (margin-bottom -1) */
function NavLinks({
  active,
  className,
  itemHeight,
}: {
  active: NavKey | null;
  className: string;
  itemHeight: string;
}) {
  return (
    <nav aria-label={ui.header.navLabel} className={className}>
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={item.key === active ? "page" : undefined}
          className={`relative flex ${itemHeight} items-center border-b-2 border-transparent text-base font-medium text-muted no-underline before:absolute before:inset-y-0 before:-inset-x-2 hover:text-ink aria-[current=page]:border-primary aria-[current=page]:font-bold aria-[current=page]:text-ink`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** 싱글오리진 · 블렌드 구분에 쿼리가 필요해 Suspense 안에서만 읽는다 */
function ActiveNav(props: { className: string; itemHeight: string }) {
  const pathname = usePathname();
  const type = useSearchParams().get("type");
  return <NavLinks active={activeNavKey(pathname, type)} {...props} />;
}

function Nav(props: { className: string; itemHeight: string }) {
  const pathname = usePathname();
  return (
    <Suspense
      fallback={<NavLinks active={activeNavKey(pathname, null)} {...props} />}
    >
      <ActiveNav {...props} />
    </Suspense>
  );
}

/**
 * 모든 페이지 위 헤더. 홈은 2줄(가운데 검색 트리거 + 메뉴 줄), 그 밖은 1줄(가운데 메뉴). 1023px 이하는 어디서나 1줄 + ☰ 드로어.
 * 레이아웃에 한 번만 둔다.
 * @example <Header />
 */
export function Header() {
  const isHome = usePathname() === "/";
  const cartCount = useCartCount();
  const [menuOpen, setMenuOpen] = useState(false);

  // TODO: 검색 레이어 · 로스터리 드롭다운 · 스크롤 시 숨김 · 홈 1줄 전환은 다음 작업에서 잇는다
  const searchButton = (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={ui.header.openSearch}
      className={`${iconButton} ${isHome ? "lg:hidden" : ""}`}
    >
      <SearchIcon />
    </button>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg">
      <div
        className={`page-wrap flex min-h-14 items-center gap-1 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-x-6 ${
          isHome
            ? "lg:min-h-16 lg:grid-cols-[1fr_minmax(0,480px)_1fr]"
            : "lg:min-h-15"
        }`}
      >
        <Logo />

        {isHome ? (
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={ui.header.openSearch}
            className="hidden h-11 w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-line-control bg-bg pr-3 pl-4 text-left text-base text-muted hover:border-ink lg:flex"
          >
            <span className="truncate">{ui.search.placeholder}</span>
            <SearchIcon className="shrink-0 text-ink" />
          </button>
        ) : (
          <Nav
            className="-mb-px hidden gap-8 self-stretch whitespace-nowrap lg:flex"
            itemHeight="h-15"
          />
        )}

        <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:justify-self-end">
          {searchButton}
          <Link
            href="/cart"
            aria-label={ui.header.cartLabel(cartCount)}
            className={`${iconButton} relative lg:-mr-2.5`}
          >
            <CartIcon />
            <span
              aria-hidden="true"
              className="absolute top-0.75 right-px grid h-4.5 min-w-4.5 place-items-center rounded-full bg-primary px-1.25 text-xs leading-none font-bold text-white"
            >
              {cartCount}
            </span>
          </Link>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label={ui.header.openMenu}
            onClick={() => setMenuOpen(true)}
            className={`${iconButton} -mr-2.5 lg:hidden`}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {isHome && (
        <div className="page-wrap hidden lg:flex">
          <Nav
            className="-mb-px flex h-11 gap-8 whitespace-nowrap"
            itemHeight="h-11"
          />
        </div>
      )}

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        cartCount={cartCount}
      />
    </header>
  );
}
