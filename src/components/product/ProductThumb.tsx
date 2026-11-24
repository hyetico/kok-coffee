import Image from "next/image";

type ProductThumbProps = {
  src: string;
  /** 보이는 칸 크기(px). 72 · 52 · 96 등 */
  size: number;
  /** 보드가 정한 여백이 20%와 다를 때만 (목록 지도 「같은 자리 원두」 64 → 12) */
  padding?: number;
  className?: string;
};

/**
 * 상품 작은 사진. 카드와 같은 규칙 — photo-bg 바탕 · 모서리 6 · contain · 안쪽 여백 20% (05 「상품 작은 사진」).
 * 맛 지도 고른 원두 · 검색 레이어 · 장바구니 줄 · 주문서 · 주문 완료가 이 컴포넌트를 쓴다. 큰 카드 사진은 ProductCard.
 * 꾸밈 사진이라 alt는 비운다 — 상품명은 옆 글이 읽는다.
 * @example <ProductThumb src={p.image} size={72} />
 */
export function ProductThumb({
  src,
  size,
  padding,
  className = "",
}: ProductThumbProps) {
  return (
    <span
      className={`box-border block shrink-0 overflow-hidden rounded-md bg-photo-bg ${className}`}
      // 칸 크기에 비례한 여백 (72 → 14 · 52 → 10)
      style={{
        width: size,
        height: size,
        padding: padding ?? Math.round(size * 0.2),
      }}
    >
      {/* 사진 바탕색과 섞어 흰 여백이 보이지 않게 multiply */}
      <Image
        src={src}
        alt=""
        width={size * 2}
        height={size * 2}
        className="block size-full object-contain mix-blend-multiply"
      />
    </span>
  );
}
