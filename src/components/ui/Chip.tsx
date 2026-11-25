import type { ComponentProps } from "react";

type ChipProps = Omit<ComponentProps<"button">, "type"> & {
  /** 켜짐 상태가 있는 필터 칩이면 넘긴다. 없으면 누르면 동작하는 칩(추천 검색어 등) */
  pressed?: boolean;
};

/**
 * 둥근 칩 버튼. 여러 개 고르는 필터(pressed 사용)와 추천 검색어에 쓴다. 하나만 고르는 옵션은 OptionButton.
 * @example <Chip pressed={on} onClick={toggle}>디카페인</Chip>
 */
export function Chip({
  pressed,
  className = "",
  children,
  ...rest
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[18px] border border-line-control bg-bg px-3.5 text-sm leading-none font-medium whitespace-nowrap text-ink-2 hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:border-line-soft disabled:text-disabled-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:font-semibold aria-pressed:text-white aria-pressed:before:-mt-0.75 aria-pressed:before:h-1.25 aria-pressed:before:w-2.25 aria-pressed:before:-rotate-45 aria-pressed:before:border-b-2 aria-pressed:before:border-l-2 aria-pressed:before:border-current aria-pressed:before:content-[''] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
