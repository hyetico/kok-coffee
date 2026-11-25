"use client";

import { useEffect } from "react";

/** 이만큼 내려가기 전에는 헤더를 늘 보인다 (03 「스크롤 시 헤더」) */
const HIDE_AFTER = 200;
const MIN_DELTA = 8;
const ATTR = "data-header-hidden";

/**
 * 목록 페이지에서 200px 넘게 아래로 스크롤하면 헤더를 숨기고, 위로 스크롤하면 바로 다시 보인다
 * (design/snippets/list-scroll-header.js 2026-11-25 판).
 * <html data-header-hidden>을 붙이고 CSS(globals.css)가 헤더 · 왼쪽 필터 위치를 바꾼다.
 * 페이지 스크롤만 본다 — 필터 칸 · 시트 · 드로어 안 스크롤은 window scroll이 아니라 무시된다.
 * 숨은 헤더 안으로 초점이 오면 헤더를 다시 보인다 (CLAUDE.md 7장).
 * @example useHideOnScroll();
 */
export function useHideOnScroll(): void {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.getElementById("site-header");
    let lastY = window.scrollY;

    const setHidden = (hidden: boolean) => {
      if (hidden) root.setAttribute(ATTR, "");
      else root.removeAttribute(ATTR);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const d = y - lastY;
      if (Math.abs(d) < MIN_DELTA) return;
      lastY = y;
      setHidden(y > HIDE_AFTER && d > 0);
    };

    const onFocusIn = () => setHidden(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    header?.addEventListener("focusin", onFocusIn);
    return () => {
      window.removeEventListener("scroll", onScroll);
      header?.removeEventListener("focusin", onFocusIn);
      setHidden(false);
    };
  }, []);
}
