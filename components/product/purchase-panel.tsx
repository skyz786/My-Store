"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { buildWhatsAppLink, productWhatsAppMessage } from "@/lib/whatsapp";
import MeasurementsTable from "@/components/product/measurements-table";
import type { ProductSizeWithMeasurementDTO } from "@/lib/types";

export default function PurchasePanel({
  productId,
  price,
  discountPrice,
  stock,
  sizes,
  productName,
}: {
  productId: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  sizes: ProductSizeWithMeasurementDTO[];
  productName: string;
}) {
  const availableAges = sizes.filter((s) => s.inStock);
  const [selectedAge, setSelectedAge] = useState<number | null>(availableAges[0]?.age ?? null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const activePrice = discountPrice ?? price;
  const selectedSize = useMemo(
    () => sizes.find((s) => s.age === selectedAge) || null,
    [sizes, selectedAge]
  );

  async function handleAddToCart() {
    if (!selectedAge) {
      setError("Please select an age");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, age: selectedAge, quantity }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Could not add to cart");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const outOfStock = stock < 1 || availableAges.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-maroon-600">{formatPKR(activePrice)}</span>
        {discountPrice != null && discountPrice < price && (
          <span className="text-base text-ink-light line-through">{formatPKR(price)}</span>
        )}
      </div>

      <p className={`text-sm font-medium ${outOfStock ? "text-red-600" : "text-green-700"}`}>
        {outOfStock ? "Out of stock" : `In stock — ${stock} available`}
      </p>

      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Select Age</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s.age}
              disabled={!s.inStock}
              onClick={() => setSelectedAge(s.age)}
              className={`h-10 w-10 rounded-full text-sm border transition-colors ${
                selectedAge === s.age
                  ? "bg-maroon-500 text-white border-maroon-500"
                  : s.inStock
                  ? "border-cream-dark text-ink hover:border-maroon-400"
                  : "border-cream-dark text-ink-light/40 line-through cursor-not-allowed"
              }`}
            >
              {s.age}
            </button>
          ))}
        </div>
      </div>

      {selectedSize?.measurement && <MeasurementsTable age={selectedSize.age} measurement={selectedSize.measurement} />}

      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Quantity</span>
        <div className="flex items-center border border-cream-dark rounded-lg">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-lg"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-4 text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="px-3 py-1.5 text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">Added to cart.</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock || loading}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-maroon-500 text-white font-semibold py-3 text-sm hover:bg-maroon-600 disabled:opacity-50"
        >
          <ShoppingBag size={16} /> {loading ? "Adding..." : "Add to Cart"}
        </button>
        <a
          href={buildWhatsAppLink(productWhatsAppMessage({ productName, age: selectedAge || 0, price: activePrice }))}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-[#25D366] text-[#25D366] font-semibold py-3 text-sm hover:bg-[#25D366]/10"
        >
          <MessageCircle size={16} /> Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
