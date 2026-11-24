import localFont from "next/font/local";

// 파일은 scripts/font-subset.mjs가 만든다 (npm run font:subset). 원본 PretendardVariable.woff2는 다시 만들 때만 쓴다
// weight는 Pretendard Variable의 wght 축 범위 — 가변 폰트라 한 파일로 모든 굵기를 낸다

/** ① 사이트에 쓰인 글자. 첫 화면에 바로 필요해 preload 한다 */
export const pretendardUsed = localFont({
  src: "./fonts/pretendard-used.woff2",
  weight: "45 920",
  display: "swap",
  variable: "--font-pretendard-used",
  adjustFontFallback: "Arial",
});

/**
 * ② KS X 1001 한글 · 영문 · 숫자 · 기호. ①에 없는 글자가 화면에 나올 때만 받는다.
 * unicode-range는 font-subset.mjs의 SYMBOLS와 한글 전체 구간에 맞춘 것 — 구간 안이지만 파일에 없는 글자는 시스템 글꼴로 보인다
 */
export const pretendardRest = localFont({
  src: "./fonts/pretendard-rest.woff2",
  weight: "45 920",
  display: "swap",
  variable: "--font-pretendard-rest",
  preload: false,
  // ①의 Arial 대체 글꼴이 이미 크기를 맞추므로 ②에는 따로 두지 않는다
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0020-007E, U+00A0-00FF, U+2010-2027, U+2030-203A, U+20A9, U+2190-2199, U+3001-3011, U+3131-318E, U+AC00-D7A3",
    },
  ],
});
