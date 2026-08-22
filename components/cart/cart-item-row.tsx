"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatPKR } from "@/lib/format";
import type { CartItemDTO } from "@/lib/types";

export default function CartItemRow({
  item,
  onChange,
}: {
  item: CartItemDTO;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const image = item.product.images[0];
  const unitPrice = item.product.discountPrice ?? item.product.price;

  async function updateQty(qty: number) {
    if (qty < 1) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/cart/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not update quantity");
      setBusy(false);
      return;
    }
    setBusy(false);
    onChange();
  }

  async function removeItem() {
    setBusy(true);
    await fetch(`/api/cart/${item.id}`, { method: "DELETE" });
    onChange();
  }

  return (
    <div className="flex gap-4 py-5 border-b border-cream-dark last:border-0">
      <Link href={`/product/${item.product.slug}`} className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-cream-dark">
        {image && <Image src={image.url} alt={item.product.name} fill sizes="80px" className="object-cover" />}
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/product/${item.product.slug}`} className="text-sm font-medium hover:text-maroon-600 line-clamp-1">
          {item.product.name}
        </Link>
        <p className="text-xs text-ink-light mt-1">Age {item.age} Years</p>
        <p className="text-sm font-semibold text-maroon-600 mt-1">{formatPKR(unitPrice)}</p>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center border border-cream-dark rounded-lg">
            <button
              disabled={busy}
              onClick={() => updateQty(item.quantity - 1)}
              className="px-2.5 py-1 text-base disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-3 text-sm">{item.quantity}</span>
            <button
              disabled={busy}
              onClick={() => updateQty(item.quantity + 1)}
              className="px-2.5 py-1 text-base disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            disabled={busy}
            onClick={removeItem}
            className="flex items-center gap-1 text-xs text-red-600 hover:underline disabled:opacity-40"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>

      <div className="text-sm font-semibold whitespace-nowrap">{formatPKR(unitPrice * item.quantity)}</div>
    </div>
  );
}
