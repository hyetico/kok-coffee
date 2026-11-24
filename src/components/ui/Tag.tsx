import type { ReactNode } from "react";

type TagProps = {
  /** default: 맛 노트 등 옅은 태그 · solid: 디카페인 · NEW · 순위 · brand: 포트폴리오 표시 */
  tone?: "default" | "solid" | "brand";
  className?: string;
  children: ReactNode;
};

const tones = {
  default: "bg-surface font-medium text-ink-2",
  solid: "bg-ink font-bold text-white",
  brand: "bg-primary font-bold text-white",
};

/**
 * 짧은 상태 표시 (높이 22). 누를 수 있는 것은 Chip · Button을 쓴다.
 * @example <Tag tone="solid">디카페인</Tag>
 */
export function Tag({ tone = "default", className = "", children }: TagProps) {
  return (
    <span
      className={`inline-flex h-5.5 items-center rounded-sm px-2 text-xs leading-none whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
