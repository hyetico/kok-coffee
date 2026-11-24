"use client";

import { useEffect, useState, type RefObject } from "react";

/** 이만큼 내려가기 전에는 헤더를 늘 보인다 (03 「스크롤 시 헤더」) */
const HIDE_AFTER = 200;
/** 이만큼 내려가면 도구 줄 개수 자리에 페이지 이름을 붙인다 */
const PAST_TITLE = 180;
const MIN_DELTA = 8;
const ATTR = "data-header-hidden";

type Options = {
  /** 위로 스크롤할 때 이 요소(첫 카드 줄)가 헤더 + 도구 줄 아래로 다 보이면 헤더를 다시 보인다 */
  firstRowRef: RefObject<HTMLElement | null>;
  /** 헤더 아래 고정된 도구 줄 — 첫 카드 줄이 이 아래로 보이는지 잴 때 쓴다 */
  toolbarRef: RefObject<HTMLElement | null>;
};

/**
 * 목록 페이지에서 아래로 스크롤하면 헤더를 숨기고, 첫 카드 줄이 보일 만큼 올라오면 다시 보인다.
 * <html data-header-hidden>을 붙이고 CSS(globals.css)가 헤더 · 도구 줄 · 필터 위치를 바꾼다.
 * 페이지 스크롤만 본다 — 필터 상자 · 드로어 안 스크롤은 window scroll이 아니라 무시된다.
 * 숨은 헤더 안으로 초점이 오면 헤더를 다시 보인다 (CLAUDE.md 7장).
 * @example const { past } = useHideOnScroll({ firstRowRef, toolbarRef });
 */
export function useHideOnScroll({ firstRowRef, toolbarRef }: Options): {
  past: boolean;
} {
  const [past, setPast] = useState(false);

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
      setPast(y > PAST_TITLE);
      const d = y - lastY;
      if (Math.abs(d) < MIN_DELTA && y > 0) return;
      lastY = y;
      if (y <= HIDE_AFTER) return setHidden(false);
      if (d > 0) return setHidden(true);
      // 위로 올라갈 때: 첫 카드 줄 위끝이 (헤더 + 도구 줄) 아래로 내려왔을 때만 다시 보인다
      const row = firstRowRef.current;
      const bar = toolbarRef.current;
      const headerH = header?.offsetHeight ?? 0;
      const barH = bar?.offsetHeight ?? 0;
      if (row && row.getBoundingClientRect().top >= headerH + barH)
        setHidden(false);
    };

    const onFocusIn = () => setHidden(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    header?.addEventListener("focusin", onFocusIn);
    return () => {
      window.removeEventListener("scroll", onScroll);
      header?.removeEventListener("focusin", onFocusIn);
      setHidden(false);
    };
  }, [firstRowRef, toolbarRef]);

  return { past };
}
