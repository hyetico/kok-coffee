/** 아직 채우지 않은 칸. 화면에 이 글이 그대로 보이게 둔다 (CLAUDE.md 2장 · CONTENT_TODO.md) */
export const TODO = "[내용 필요]" as const;

/** 이름표와 값이 짝인 한 줄 (푸터 사업자 정보 등) */
export type LabeledValue = {
  label: string;
  value: string;
};

/** 링크가 없을 수도 있는 메뉴 항목. href가 없으면 글자로만 보인다 */
export type MenuItem = {
  label: string;
  href?: string;
};
