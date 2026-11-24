/**
 * 불러오는 동안 자리를 잡는 회색 막대. 1.2초 주기로 빛이 흐르고, 움직임 줄이기면 멈춘다.
 * @example <Skeleton className="h-4 w-1/2" />
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-[skeleton_1.2s_linear_infinite] rounded-md bg-[linear-gradient(90deg,var(--color-surface)_0,var(--color-line-soft)_50%,var(--color-surface)_100%)] bg-size-[200%_100%] motion-reduce:animate-none ${className}`}
    />
  );
}

/**
 * 상품 카드와 같은 자리를 차지하는 스켈레톤 (사진 1:1 · 담기 · 글 3줄).
 * @example <ProductCardSkeleton />
 */
export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="aspect-square" />
      <Skeleton className="mt-2.5 h-10" />
      <Skeleton className="mt-3.5 h-3.5 w-1/2" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-2 h-4.5 w-[35%]" />
    </div>
  );
}
