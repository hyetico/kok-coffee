import type { Metadata, Viewport } from "next";
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
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
