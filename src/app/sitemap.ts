import type { MetadataRoute } from "next";
import { getRoasteries, listedProducts } from "@/lib/catalog";

// 사이트 주소는 환경변수 한 곳에서만 (CLAUDE.md 11장). 장바구니 · 주문서 · 주문 완료는 넣지 않는다
const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/coffee",
    "/coffee?type=single",
    "/coffee?type=blend",
    "/roasteries",
    "/taste-test",
    ...listedProducts().map((p) => `/coffee/${p.id}`),
    ...getRoasteries().map((r) => `/roasteries/${r.id}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
