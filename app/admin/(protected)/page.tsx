import Link from "next/link";
import { Package, ShoppingCart, Clock, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPKR } from "@/lib/format";

export const metadata = { title: "Admin Dashboard" };
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [totalProducts, totalOrders, pendingOrders, deliveredOrders, lowStock, recentOrders, salesAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: "PENDING" } }),
      prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
      prisma.product.findMany({ where: { stock: { lte: 5 } }, orderBy: { stock: "asc" }, take: 6 }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } }),
      prisma.order.aggregate({ where: { orderStatus: { not: "CANCELLED" } }, _sum: { total: true } }),
    ]);

  const stats = [
    { label: "Total Products", value: totalProducts, icon: Package },
    { label: "Total Orders", value: totalOrders, icon: ShoppingCart },
    { label: "Pending Orders", value: pendingOrders, icon: Clock },
    { label: "Delivered Orders", value: deliveredOrders, icon: CheckCircle2 },
    { label: "Total Sales", value: formatPKR(salesAgg._sum.total || 0), icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-cream-dark bg-white p-5">
            <s.icon className="text-maroon-500 mb-2" size={20} aria-hidden="true" />
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-ink-light mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-cream-dark bg-white p-5">
          <h2 className="text-sm font-semibold mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-xs text-ink-light">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href="/admin/orders"
                  className="flex justify-between items-center text-sm border-b border-cream-dark last:border-0 pb-3 last:pb-0"
                >
                  <span>{o.orderNumber}</span>
                  <span className="text-ink-light text-xs">{o.orderStatus}</span>
                  <span className="font-medium">{formatPKR(o.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-cream-dark bg-white p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" aria-hidden="true" /> Low Stock Products
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-xs text-ink-light">All products are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}/edit`}
                  className="flex justify-between items-center text-sm border-b border-cream-dark last:border-0 pb-3 last:pb-0"
                >
                  <span className="line-clamp-1">{p.name}</span>
                  <span className="text-red-600 font-medium text-xs">{p.stock} left</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
