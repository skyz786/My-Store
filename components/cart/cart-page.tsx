"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CartItemRow from "@/components/cart/cart-item-row";
import EmptyState from "@/components/ui/empty-state";
import { formatPKR } from "@/lib/format";
import type { CartDTO } from "@/lib/types";

export default function CartPage() {
  const [cart, setCart] = useState<CartDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [settings, setSettings] = useState<{ deliveryFee: number; freeDeliveryThreshold: number | null } | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/cart");
    if (res.status === 401) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setCart(data.cart);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadCart();
      fetch("/api/settings")
        .then((r) => r.json())
        .then(setSettings)
        .catch(() => {});
    });
  }, [loadCart]);

  if (loading) {
    return (
      <div className="container-x py-16">
        <div className="max-w-2xl mx-auto space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-cream-dark animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Please log in"
          message="Log in to view your cart and continue shopping."
          actionHref="/login?next=/cart"
          actionLabel="Login"
        />
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Browse our collection and add a Qameez Shalwar for your little one."
          actionHref="/shop"
          actionLabel="Shop Now"
        />
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.quantity, 0);
  const deliveryFee = settings
    ? settings.freeDeliveryThreshold != null && subtotal >= settings.freeDeliveryThreshold
      ? 0
      : settings.deliveryFee
    : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 rounded-2xl border border-cream-dark bg-white px-5">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} onChange={loadCart} />
          ))}
        </div>

        <div className="rounded-2xl border border-cream-dark bg-white p-6 h-fit space-y-3">
          <h2 className="font-semibold text-sm mb-2">Order Summary</h2>
          <Row label="Subtotal" value={formatPKR(subtotal)} />
          <Row label="Delivery" value={deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)} />
          <div className="border-t border-cream-dark pt-3 flex justify-between font-semibold text-sm">
            <span>Total</span>
            <span className="text-maroon-600">{formatPKR(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="block text-center rounded-lg bg-maroon-500 text-white font-semibold py-3 text-sm hover:bg-maroon-600 mt-4"
          >
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="block text-center text-xs text-maroon-600 hover:underline mt-1">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-light">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
