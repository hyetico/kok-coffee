import type { ReactNode } from "react";

/**
 * primary와 secondary를 나란히 둘 때. 두 버튼 너비를 긴 쪽에 맞추고, 묶음 안 secondary는 초록 테두리로 무게를 맞춘다.
 * 모바일은 한 줄을 반씩, 374px 이하는 위아래로. 버튼은 primary를 먼저 넣는다.
 * @example <ButtonPair><Button kind="primary" size="lg" href="/taste-test">…</Button><Button kind="secondary" size="lg" href="/coffee">…</Button></ButtonPair>
 */
export function ButtonPair({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid w-full max-w-full auto-cols-fr grid-flow-row gap-3 min-[375px]:grid-flow-col sm:inline-grid sm:w-auto [&>*]:min-w-max [&>*]:px-6 [&>.kind-secondary]:border-primary [&>.kind-secondary]:text-primary [&>.kind-secondary:hover]:border-primary-hover [&>.kind-secondary:hover]:bg-option-on [&>.kind-secondary:hover]:text-primary-hover ${className}`}
    >
      {children}
    </div>
  );
}
