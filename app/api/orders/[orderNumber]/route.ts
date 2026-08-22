import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: { include: { product: { include: { images: { take: 1 } } } } }, payment: true },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Order-success page needs to be viewable right after checkout (guest or
  // logged-in). If the order belongs to a registered user, only that user
  // (or an admin) may view it later.
  if (order.userId) {
    const user = await getCurrentUser();
    const isOwner = user && user.id === order.userId;
    const isAdmin = user && user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
  }

  return NextResponse.json({ order });
}
