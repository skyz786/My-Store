"use client";

import { useEffect, useState } from "react";
import { formatPKR } from "@/lib/format";
import type { OrderDTO } from "@/lib/types";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  function load() {
    setLoading(true);
    const params = filter ? `?status=${filter}` : "";
    fetch(`/api/admin/orders${params}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    queueMicrotask(load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function updateStatus(id: string, field: "orderStatus" | "paymentStatus", value: string) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) load();
    else alert("Could not update order");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-auto" aria-label="Filter by status">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-cream-dark bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-dark text-left text-xs uppercase tracking-wide text-ink-light">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Payment Status</th>
              <th className="p-4">Order Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-ink-light">Loading...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-ink-light">No orders found.</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-cream-dark last:border-0">
                  <td className="p-4 font-medium whitespace-nowrap">{o.orderNumber}</td>
                  <td className="p-4">{o.customerName}</td>
                  <td className="p-4 whitespace-nowrap">{o.phone}</td>
                  <td className="p-4 whitespace-nowrap">{formatPKR(o.total)}</td>
                  <td className="p-4">{o.paymentMethod}</td>
                  <td className="p-4">
                    <select
                      value={o.paymentStatus}
                      onChange={(e) => updateStatus(o.id, "paymentStatus", e.target.value)}
                      className="input py-1.5 text-xs"
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o.id, "orderStatus", e.target.value)}
                      className="input py-1.5 text-xs"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 whitespace-nowrap text-xs text-ink-light">
                    {new Date(o.createdAt).toLocaleDateString("en-PK")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
