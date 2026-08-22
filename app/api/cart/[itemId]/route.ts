import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({ quantity: z.number().int().min(1).max(20) });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  const { itemId } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, product: true },
  });
  if (!item || item.cart.userId !== user.id) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }
  if (parsed.data.quantity > item.product.stock) {
    return NextResponse.json(
      { error: `Only ${item.product.stock} in stock. Please reduce the quantity.` },
      { status: 400 }
    );
  }

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: parsed.data.quantity } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  const { itemId } = await params;
  const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
  if (!item || item.cart.userId !== user.id) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}
