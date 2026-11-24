"use client";

import { useEffect, useState } from "react";

/** 140px 넘게 아래로 내려가면 1줄 (02 PRD 4장 「홈 헤더 스크롤」) */
const THRESHOLD = 140;
/** 손 떨림 같은 작은 움직임은 방향 판단에서 뺀다 (프로토타입 값) */
const MIN_DELTA = 8;

/**
 * 홈 헤더를 1줄로 접을지. 아래로 140px 넘게 내리면 true, 위로 올리거나 140 안이면 false.
 * 1024px 미만에서는 값이 바뀌어도 모양이 같다(헤더가 원래 1줄). enabled가 false면 늘 false.
 * @example const compact = useHomeHeaderCompact(isHome);
 */
export function useHomeHeaderCompact(enabled: boolean): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - lastY;
      if (Math.abs(d) < MIN_DELTA && y > 0) return;
      lastY = y;
      setCompact((prev) =>
        y > THRESHOLD && d > 0 ? true : d < 0 || y <= THRESHOLD ? false : prev,
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      setCompact(false);
    };
  }, [enabled]);

  return enabled && compact;
}
