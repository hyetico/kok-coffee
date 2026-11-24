"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/store/toast";

/** 읽기 전에 사라지지 않게 4초, 링크 · 되돌리기가 있으면 6초 (05 「팝오버 · 메뉴 · 알림」) */
const DURATION = 4000;
const DURATION_WITH_ACTION = 6000;

/**
 * 알림을 그리는 자리. 레이아웃에 한 번만 둔다. 마우스 · 초점이 올라가 있는 동안은 시간이 멈춘다.
 * @example <Toaster />
 */
export function Toaster() {
  const toast = useToast((s) => s.toast);
  const hide = useToast((s) => s.hide);
  const [paused, setPaused] = useState(false);
  const left = useRef(0);
  const startedAt = useRef(0);

  // 새 알림이 오면 남은 시간을 처음부터
  useEffect(() => {
    if (!toast) return;
    left.current = toast.link || toast.action ? DURATION_WITH_ACTION : DURATION;
  }, [toast]);

  useEffect(() => {
    if (!toast || paused) return;
    startedAt.current = Date.now();
    const id = window.setTimeout(hide, left.current);
    return () => {
      window.clearTimeout(id);
      left.current -= Date.now() - startedAt.current;
    };
  }, [toast, paused, hide]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-20 w-max max-w-[calc(100%-32px)] -translate-x-1/2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {toast && (
        <div
          key={toast.id}
          className="flex items-center gap-4 rounded-xl bg-ink px-4.5 py-3.5 text-sm text-white shadow-[0_6px_24px_rgba(0,0,0,.18)]"
        >
          <span>{toast.text}</span>
          {toast.link && (
            <Link
              href={toast.link.href}
              onClick={hide}
              className="font-bold text-toast-link no-underline"
            >
              {toast.link.label}
            </Link>
          )}
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                hide();
              }}
              className="min-h-8 cursor-pointer px-1 font-bold text-toast-link"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
