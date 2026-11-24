import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/Toaster";
import { ui } from "@/content/ui";
import { pretendardRest, pretendardUsed } from "./fonts";
import "./globals.css";

// 파비콘은 src/app/의 favicon.ico · icon.svg · apple-icon.png 파일로 Next가 자동 연결한다
// TODO: title · description은 2단계 src/content/site.ts가 생기면 거기서 가져온다
export const metadata: Metadata = {
  // 사이트 주소는 이 환경변수 한 곳에서만 정한다 (CLAUDE.md 11장). 도메인이 정해지기 전에는 개발 주소로 둔다
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
};

export const viewport: Viewport = {
  colorScheme: "light",
};

// LayoutProps는 빌드 때 생기는 타입이라, 빌드 전에 도는 tsc 검사에서도 통과하게 직접 적는다
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${pretendardUsed.variable} ${pretendardRest.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* 모든 페이지 첫 초점 (CLAUDE.md 7장). 각 페이지의 <main id="main">으로 건너뛴다 */}
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {ui.skipToContent}
        </a>
        <Header />
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
