import { redirect } from "next/navigation";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import EmptyState from "@/components/ui/empty-state";

export const metadata = { title: "My Orders" };

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No orders yet"
          message="Once you place an order, it will show up here."
          actionHref="/shop"
          actionLabel="Shop Now"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order-success/${order.orderNumber}`}
              className="block rounded-xl border border-cream-dark bg-white p-5 hover:border-maroon-400 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-ink-light mt-0.5">
                    {order.items.length} item(s) &middot; {new Date(order.createdAt).toLocaleDateString("en-PK")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-maroon-600">{formatPKR(order.total)}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
