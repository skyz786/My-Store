"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export default function QuickAddButton({
  productId,
  defaultAge,
  inStock,
}: {
  productId: string;
  defaultAge?: number;
  inStock: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleAdd() {
    if (!defaultAge || loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, age: defaultAge, quantity: 1 }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setMessage(data.error || "Could not add to cart");
        return;
      }
      setMessage("Added!");
      router.refresh();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 2000);
    }
  }

  if (!inStock) {
    return (
      <span className="flex items-center justify-center rounded-lg bg-cream-dark text-ink-light text-xs px-3 py-2">
        Out of stock
      </span>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      aria-label="Add to cart"
      title={message || "Add to cart"}
      className="flex items-center justify-center rounded-lg bg-maroon-500 text-white px-3 py-2 hover:bg-maroon-600 disabled:opacity-60"
    >
      <ShoppingBag size={16} />
    </button>
  );
}
