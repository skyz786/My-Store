import Image from "next/image";
import Link from "next/link";
import type { ProductDTO } from "@/lib/types";
import { formatPKR } from "@/lib/format";
import QuickAddButton from "@/components/product/quick-add-button";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const image = product.images[0];
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const ages = product.sizes.filter((s) => s.inStock).map((s) => s.age).sort((a, b) => a - b);
  const ageRange = ages.length ? `Age ${ages[0]}–${ages[ages.length - 1]}` : "Sizes unavailable";
  const discountPct = hasDiscount
    ? Math.round(((product.price - (product.discountPrice as number)) / product.price) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-cream-dark bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] bg-cream-dark overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-light text-sm">No image</div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 rounded-full bg-maroon-500 text-white text-[11px] font-semibold px-2 py-1">
            -{discountPct}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-2 right-2 rounded-full bg-gold-400 text-ink text-[11px] font-semibold px-2 py-1">
            New
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <Link href={`/product/${product.slug}`} className="text-sm font-medium text-ink line-clamp-2 hover:text-maroon-600">
          {product.name}
        </Link>
        <span className="text-xs text-ink-light">{ageRange} Years</span>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-maroon-600">
            {formatPKR(hasDiscount ? (product.discountPrice as number) : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-ink-light line-through">{formatPKR(product.price)}</span>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 rounded-lg border border-maroon-500 text-maroon-600 text-xs font-medium text-center py-2 hover:bg-maroon-50"
          >
            View Product
          </Link>
          <QuickAddButton productId={product.id} defaultAge={ages[0]} inStock={product.stock > 0 && ages.length > 0} />
        </div>
      </div>
    </div>
  );
}
