import { Suspense } from "react";
import { ListView } from "@/components/list/ListView";

export default function CoffeeListPage() {
  return (
    // 목록은 URL 쿼리(조건)를 읽어 그리므로 쿼리를 읽는 동안의 자리를 둔다
    <Suspense fallback={<main id="main" className="flex-1" />}>
      <ListView />
    </Suspense>
  );
}
