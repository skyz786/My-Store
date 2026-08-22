import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  orderStatus: z
    .enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid update" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const result = await prisma.$transaction(async (tx) => {
    // Restore stock when an order is cancelled (and wasn't already cancelled).
    if (parsed.data.orderStatus === "CANCELLED" && order.orderStatus !== "CANCELLED") {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return tx.order.update({
      where: { id },
      data: {
        ...(parsed.data.orderStatus ? { orderStatus: parsed.data.orderStatus } : {}),
        ...(parsed.data.paymentStatus ? { paymentStatus: parsed.data.paymentStatus } : {}),
      },
    });
  });

  return NextResponse.json(result);
}
