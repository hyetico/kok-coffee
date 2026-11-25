"use client";

import { Button } from "@/components/ui/Button";
import { ui } from "@/content/ui";

// 목록 화면에서 예상하지 못한 오류가 나면 이 화면으로 바꾼다 — 「다시 시도」는 화면을 다시 그린다 (보드 States 「목록을 불러오지 못했을 때」)
export default function CoffeeError({ reset }: { reset: () => void }) {
  const t = ui.listError;
  return (
    <main id="main" className="flex-1">
      <div className="page-wrap pt-10 pb-6">
        <div
          role="alert"
          className="rounded-xl border border-line px-6 py-12 text-center"
        >
          <svg
            aria-hidden="true"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="inline-block text-muted"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v6M12 16.5v.5" />
          </svg>
          <p className="mt-3 mb-0 text-lg font-bold">{t.title}</p>
          <p className="mt-2 mb-0 text-sm text-muted">{t.desc}</p>
          <Button kind="primary" onClick={reset} className="mt-5">
            {t.retry}
          </Button>
        </div>
      </div>
    </main>
  );
}
