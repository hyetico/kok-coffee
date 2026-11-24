import { TasteTest } from "@/components/taste-test/TasteTest";

export default function TasteTestPage() {
  return (
    <main id="main" className="flex-1">
      {/* 테스트는 본문 폭(1280) 대신 좁은 칸(880)을 쓴다 — 보드와 같음 */}
      <div className="mx-auto box-content max-w-220 px-5">
        <TasteTest />
      </div>
    </main>
  );
}
