import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Kind = "primary" | "secondary" | "ghost" | "text";
type Size = "lg" | "md" | "panel" | "sm";

type CommonProps = {
  /** 화면에서 가장 중요한 동작 하나에만 primary를 쓴다 */
  kind?: Kind;
  /** lg 52 · md 44 · panel 40(맛 지도 · 목록 지도 카드) · sm 36 */
  size?: Size;
  /** 부모 폭을 꽉 채운다 (드로어 · 시트 아래 버튼) */
  block?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className" | "children"
  >;
type ButtonProps = CommonProps & { href?: undefined } & Omit<
    ComponentProps<"button">,
    "className" | "children"
  >;

const base =
  "inline-flex items-center justify-center gap-2 box-border whitespace-nowrap rounded-lg border leading-none no-underline transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:border-transparent disabled:bg-line-soft disabled:text-disabled-ink aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-line-soft aria-disabled:text-disabled-ink";

const kinds: Record<Kind, string> = {
  // 테두리 색 · 굵기는 종류마다 하나만 둔다 (두 클래스가 겹치면 어느 쪽이 이길지 순서에 달려 버린다)
  primary:
    "border-transparent bg-primary font-semibold text-white hover:bg-primary-hover active:bg-primary-press",
  secondary:
    "border-line-control bg-bg font-semibold text-ink hover:border-ink hover:bg-secondary-hover hover:text-ink active:bg-secondary-press",
  ghost:
    "border-transparent bg-surface font-semibold text-ink hover:bg-ghost-hover active:bg-ghost-press",
  text: "min-h-8 border-0 px-2 text-sm font-medium text-muted hover:bg-surface hover:text-ink disabled:bg-transparent",
};

// text 버튼은 높이 · 안쪽 여백을 kinds에서 따로 정한다
const sizes: Record<Size, string> = {
  lg: "h-13 px-6 text-base",
  md: "h-11 px-5 text-base",
  panel: "h-10 px-5 text-base",
  sm: "h-9 px-4 text-sm",
};

function classes({
  kind = "primary",
  size = "md",
  block,
  className,
}: CommonProps) {
  return [
    base,
    // 묶음(ButtonPair)이 종류별로 모양을 바꿀 수 있게 표시 클래스를 붙인다
    `kind-${kind}`,
    kinds[kind],
    kind === "text" ? "" : sizes[size],
    block ? "flex w-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * 링크 또는 버튼. 이동은 href, 동작은 onClick. 짧은 상태 표시는 Tag를 쓴다.
 * @example <Button kind="primary" onClick={add}>담기</Button>
 */
export function Button(props: LinkProps | ButtonProps) {
  if (props.href !== undefined) {
    const { kind, size, block, className, children, ...rest } = props;
    return (
      <Link
        className={classes({ kind, size, block, className, children })}
        {...rest}
      >
        {children}
      </Link>
    );
  }
  const {
    kind,
    size,
    block,
    className,
    children,
    type = "button",
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={classes({ kind, size, block, className, children })}
      {...rest}
    >
      {children}
    </button>
  );
}
