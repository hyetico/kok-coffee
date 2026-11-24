import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { ui } from "@/content/ui";
import { formatWon } from "@/lib/format";
import type { Product } from "@/types";
import { AddToCartButton } from "./AddToCartButton";

type ProductCardProps = {
  product: Product;
  /** 사진 왼쪽 위 진한 태그 (NEW · 순위). 없으면 디카페인일 때 「디카페인」 */
  badge?: string;
  /** 취향 테스트 결과처럼 담기 버튼이 없는 카드 */
  hideAdd?: boolean;
};

/**
 * 상품 카드 — 메인 · 목록 · 추천 · 로스터리 · 테스트 결과가 모두 이 카드를 쓴다 (05 「카드 · 목록」).
 * 사진 링크는 이름 링크와 같은 곳이라 읽기 · 탭 순서에서 뺀다.
 * @example <ProductCard product={p} badge="NEW" />
 */
export function ProductCard({ product, badge, hideAdd }: ProductCardProps) {
  const href = `/coffee/${product.id}`;
  const tag = badge ?? (product.decaf ? ui.product.decaf : undefined);
  return (
    <div className="group flex h-full flex-col">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <div className="relative overflow-hidden rounded-md bg-photo-bg">
          {/* 사진 바탕색과 섞어 흰 여백이 보이지 않게 multiply */}
          <Image
            src={product.image}
            alt=""
            width={400}
            height={400}
            sizes="(min-width: 1024px) 300px, 50vw"
            className="block aspect-square w-full object-contain p-[20%] mix-blend-multiply transition-transform duration-300 group-hover:scale-104 motion-reduce:transition-none"
          />
          {tag && (
            <Tag tone="solid" className="absolute top-2.5 left-2.5">
              {tag}
            </Tag>
          )}
        </div>
      </Link>
      <Link href={href} className="mt-3 block flex-auto text-ink no-underline">
        <p className="m-0 flex items-center gap-1.5 text-sm text-muted">
          <Image
            src={product.roasteryLogo}
            alt=""
            width={22}
            height={22}
            className="size-5.5 shrink-0 rounded-full bg-bg object-contain p-px shadow-[0_0_0_1px_var(--color-line)]"
          />
          {product.roastery}
        </p>
        <p className="mt-1 mb-0 text-base leading-[1.4] font-semibold">
          {product.title}
        </p>
        <p className="mt-1 mb-0 text-sm text-muted">
          {product.notes} · {ui.product.typeLabels[product.type]}
        </p>
        <p className="mt-1.5 mb-0 text-base font-bold">
          {formatWon(product.price)}
        </p>
      </Link>
      {!hideAdd && (
        <AddToCartButton productId={product.id} title={product.title} />
      )}
    </div>
  );
}
