"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImageDTO } from "@/lib/types";

export default function ProductGallery({ images, productName }: { images: ProductImageDTO[]; productName: string }) {
  const [active, setActive] = useState(0);
  const image = images[active];

  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-dark border border-cream-dark">
        {image ? (
          <Image src={image.url} alt={productName} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-light text-sm">No image available</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActive(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                idx === active ? "border-maroon-500" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
