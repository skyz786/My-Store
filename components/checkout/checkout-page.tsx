"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPKR } from "@/lib/format";
import type { CartDTO } from "@/lib/types";

const PROVINCES = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir", "Islamabad"];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartDTO | null>(null);
  const [settings, setSettings] = useState<{ deliveryFee: number; freeDeliveryThreshold: number | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    province: "Punjab",
    postalCode: "",
    notes: "",
    paymentMethod: "COD" as "COD" | "EASYPAISA",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/cart").then((r) => (r.status === 401 ? null : r.json())),
      fetch("/api/settings").then((r) => r.json()),
    ]).then(([cartData, settingsData]) => {
      if (!cartData) {
        router.push("/login?next=/checkout");
        return;
      }
      setCart(cartData.cart);
      setSettings(settingsData);
      setLoading(false);
    });
  }, [router]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: cart.items.map((i) => ({ productId: i.productId, age: i.age, quantity: i.quantity })),
      }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Could not place order. Please try again.");
      return;
    }

    router.push(`/order-success/${data.orderNumber}`);
  }

  if (loading) {
    return (
      <div className="container-x py-16">
        <div className="max-w-xl mx-auto h-64 rounded-xl bg-cream-dark animate-pulse" />
      </div>
    );
  }

  const items = cart?.items || [];
  if (items.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <p className="text-ink-light">Your cart is empty.</p>
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
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5 rounded-2xl border border-cream-dark bg-white p-6">
          <h2 className="font-semibold text-sm">Delivery Details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input
                required
                value={form.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Mobile Number" required>
              <input
                required
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="03XX-XXXXXXX"
                className="input"
              />
            </Field>
          </div>

          <Field label="WhatsApp Number (if different)">
            <input
              value={form.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Complete Address" required>
            <textarea
              required
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              rows={3}
              className="input"
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" required>
              <input
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Province" required>
              <select
                required
                value={form.province}
                onChange={(e) => updateField("province", e.target.value)}
                className="input"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Postal Code">
              <input
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Order Notes (optional)">
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={2}
              className="input"
            />
          </Field>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Payment Method</span>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-3 rounded-lg border border-cream-dark p-3 cursor-pointer has-[:checked]:border-maroon-500">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === "COD"}
                  onChange={() => updateField("paymentMethod", "COD")}
                />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-cream-dark p-3 cursor-pointer has-[:checked]:border-maroon-500 opacity-70">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === "EASYPAISA"}
                  onChange={() => updateField("paymentMethod", "EASYPAISA")}
                />
                <span className="text-sm font-medium">
                  Easypaisa <span className="text-xs text-ink-light">(coming soon)</span>
                </span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-maroon-500 text-white font-semibold py-3 text-sm hover:bg-maroon-600 disabled:opacity-60"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="rounded-2xl border border-cream-dark bg-white p-6 h-fit space-y-3">
          <h2 className="font-semibold text-sm mb-2">Order Summary</h2>
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-xs text-ink-light">
              <span className="line-clamp-1 pr-2">
                {i.product.name} × {i.quantity} (Age {i.age})
              </span>
              <span className="whitespace-nowrap">{formatPKR((i.product.discountPrice ?? i.product.price) * i.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-cream-dark pt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-ink-light">Subtotal</span>
              <span className="font-medium">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-light">Delivery</span>
              <span className="font-medium">{deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm pt-1">
              <span>Total</span>
              <span className="text-maroon-600">{formatPKR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">
        {label} {required && <span className="text-maroon-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
