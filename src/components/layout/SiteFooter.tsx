"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

/** 푸터 위 여백(80)을 빼는 주소. 본문이 스스로 아래 여백을 갖는 페이지만 넣는다 */
const NO_FOOTER_SPACE = ["/coffee"];

/**
 * 레이아웃에 두는 푸터. 지금 주소를 보고 Footer의 위 여백을 정한다 (페이지마다 본문 끝 간격이 달라서).
 * @example <SiteFooter />
 */
export function SiteFooter() {
  const pathname = usePathname();
  return <Footer spaced={!NO_FOOTER_SPACE.includes(pathname)} />;
}
