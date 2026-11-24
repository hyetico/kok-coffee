"use client";

import Image from "next/image";
import { useState } from "react";
import { detail } from "@/content/detail";

/**
 * 상세 사진. 사진이 2장 이상이면 아래 작은 사진으로 바꿔 본다.
 * @example <Gallery title="스프링 블렌드" images={["/a.webp", "/b.webp"]} />
 */
export function Gallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-photo-bg">
        <Image
          src={images[index] ?? images[0]}
          alt={detail.imageAlt(title)}
          width={720}
          height={720}
          priority
          sizes="(min-width: 1024px) 600px, 100vw"
          className="block aspect-square w-full object-contain mix-blend-multiply"
        />
      </div>
      {images.length > 1 && (
        <div
          role="group"
          aria-label={detail.thumbsLabel}
          className="mt-3 flex gap-2"
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={detail.thumbLabel(i + 1)}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className="size-19 cursor-pointer rounded-md border-2 border-transparent bg-photo-bg p-1 aria-pressed:border-primary"
            >
              <Image
                src={src}
                alt=""
                width={76}
                height={76}
                className="block size-full object-contain mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
