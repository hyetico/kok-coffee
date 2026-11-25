import { TODO, type LabeledValue, type MenuItem } from "./types";

// 사이트 정보 · 연락처를 두는 유일한 곳 (CLAUDE.md 1장 · 10장)
// 값은 포트폴리오용 가상 매장 기준으로 확정된 글 (CONTENT_TODO [x]) — 번호 · 번지 · 이메일 도메인은 예시 형식

export const site = {
  name: "콕커피",
  /** 도메인은 배포 마지막에 정한다. 주소는 NEXT_PUBLIC_SITE_URL 환경변수에서 읽는다 */
  domain: TODO,

  support: {
    title: "고객센터",
    phone: "1588-0000",
    hours: "평일 10:00 – 18:00 · 주말 · 공휴일 휴무",
    channels: "카카오톡 「콕커피」 · help@kokcoffee.example",
  },

  /** 만들 페이지가 없어 링크 없는 글자로 둔다 (02 PRD 4장). 페이지가 생기면 href를 채운다 */
  supportMenu: [
    { label: "공지사항" },
    { label: "자주 묻는 질문" },
    { label: "1:1 문의" },
    { label: "입점 문의" },
  ] satisfies MenuItem[],

  policyMenu: [
    { label: "회사 소개" },
    { label: "이용약관" },
    { label: "개인정보처리방침" },
    { label: "배송 · 교환 안내" },
  ] satisfies MenuItem[],

  /** 푸터에서 두 줄로 나눠 보인다 (모바일은 항목마다 한 줄) */
  businessLines: [
    [
      { label: "상호", value: "(주)콕커피" },
      { label: "대표", value: "한서윤" },
      { label: "사업자등록번호", value: "123-45-67890" },
      { label: "통신판매업신고", value: "제2026-서울성동-0000호" },
    ],
    [
      {
        label: "주소",
        value: "서울특별시 성동구 성수이로 00, 3층 (콕커피 성수 쇼룸)",
      },
      { label: "개인정보보호책임자", value: "정다온" },
      { label: "호스팅 제공", value: "Vercel Inc." },
    ],
  ] satisfies LabeledValue[][],

  notice:
    "© 2026 콕커피. 이 사이트는 웹 퍼블리싱 포트폴리오용 리뉴얼 작업물이에요. 실제 판매와 결제는 되지 않고, 사업자 정보와 연락처는 예시입니다.",
} as const;
