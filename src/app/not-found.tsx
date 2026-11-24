import { Button } from "@/components/ui/Button";
import { ui } from "@/content/ui";

// Next 기본 404는 기기가 다크 모드일 때 body를 검정 · 흰 글자로 바꾸는 스타일을 넣는다 — 라이트 전용 사이트라 우리 화면으로 대신한다
export default function NotFound() {
  return (
    <main id="main" className="flex-1">
      <div className="page-wrap">
        <div className="mx-auto max-w-140 pt-30 pb-10 text-center">
          <p className="m-0 text-[64px] font-bold tracking-[-0.04em] text-primary">
            {ui.notFound.code}
          </p>
          <h1 className="mt-3 mb-0 text-[28px] font-bold tracking-[-0.03em]">
            {ui.notFound.title}
          </h1>
          <p className="mt-3 mb-0 text-base leading-[1.7] text-muted">
            {ui.notFound.desc}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button href="/" kind="secondary" size="lg">
              {ui.notFound.home}
            </Button>
            <Button href="/coffee" kind="primary" size="lg">
              {ui.notFound.list}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
