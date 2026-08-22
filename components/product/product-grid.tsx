import ProductCard from "@/components/product/product-card";
import type { ProductDTO } from "@/lib/types";

export default function ProductGrid({ products }: { products: ProductDTO[] }) {
  if (products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
