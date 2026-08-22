import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalProducts, totalOrders, pendingOrders, deliveredOrders, lowStock, recentOrders, salesAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: "PENDING" } }),
      prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
      prisma.product.findMany({ where: { stock: { lte: 5 } }, orderBy: { stock: "asc" }, take: 10 }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { items: true } }),
      prisma.order.aggregate({
        where: { orderStatus: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
    ]);

  return NextResponse.json({
    totalProducts,
    totalOrders,
    pendingOrders,
    completedOrders: deliveredOrders,
    totalSales: salesAgg._sum.total || 0,
    lowStockProducts: lowStock,
    recentOrders,
  });
}
