import { TasteTest } from "@/components/taste-test/TasteTest";

export default function TasteTestPage() {
  return (
    <main id="main" className="flex-1">
      {/* 테스트는 본문 폭(1280) 대신 좁은 칸(1040)을 쓴다 — 보드와 같음 */}
      <div className="mx-auto box-content max-w-260 px-4 sm:px-6 lg:px-10">
        <TasteTest />
      </div>
    </main>
  );
}
