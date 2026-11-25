import type { SVGProps } from "react";

// 아이콘 원본은 design/svg/ · 프로토타입. 모두 꾸밈이라 aria-hidden — 이름은 감싸는 버튼의 aria-label이 맡는다

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** 헤더 아이콘은 모두 24 · 선 1.8 (05 「내비게이션」) */
export function SearchIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </Svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg size={12} strokeWidth={2.4} {...props}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <Svg size={16} strokeWidth={2} {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg size={16} strokeWidth={2.4} {...props}>
      <path d="M5 12l5 5 9-10" />
    </Svg>
  );
}

/** 목록 필터 머리 — 슬라이더 모양 (05 「필터」) */
export function SlidersIcon(props: IconProps) {
  return (
    <Svg size={18} strokeWidth={1.75} {...props}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </Svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <Svg size={16} strokeWidth={1.75} {...props}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg size={14} strokeWidth={2} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}
