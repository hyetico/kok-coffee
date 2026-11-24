// 화면에 보이는 숫자 모양은 이 파일에서만 만든다 (CLAUDE.md 5장). 데이터에는 숫자 원본만 둔다

const wonFormatter = new Intl.NumberFormat("ko-KR");

/**
 * 원 단위 가격 표시.
 * @example formatWon(12000) // "12,000원"
 */
export function formatWon(value: number): string {
  return `${wonFormatter.format(value)}원`;
}

/**
 * 숫자만 받은 휴대폰 번호에 하이픈을 넣는다. 입력 중에도 쓰므로 11자리가 안 돼도 있는 만큼 나눈다.
 * @example formatPhone("01012345678") // "010-1234-5678"
 */
export function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
