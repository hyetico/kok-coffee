import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 섹션 오른쪽 「전체 보기 >」. 밑줄 없이 올림 시 화살표 2px 이동.
 * 화살표 오른쪽 여백만큼 바깥으로 당겨 글자 끝을 섹션 끝선에 맞춘다.
 * @example <MoreLink href="/coffee">전체 보기</MoreLink>
 */
export function MoreLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-ink no-underline transition-colors duration-150 hover:text-ink motion-reduce:transition-none"
    >
      {children}
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="-mr-1.25 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
      >
        <path d="m9 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
