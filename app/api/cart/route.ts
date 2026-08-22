import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1, orderBy: { position: "asc" } } } },
        },
      },
    },
  });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in to view your cart" }, { status: 401 });

  const cart = await getOrCreateCart(user.id);
  return NextResponse.json({ cart });
}

const addItemSchema = z.object({
  productId: z.string().min(1),
  age: z.number().int().min(5).max(14),
  quantity: z.number().int().min(1).max(20).default(1),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in to add items to your cart" }, { status: 401 });

  const body = await req.json();
  const parsed = addItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid item" }, { status: 400 });
  }
  const { productId, age, quantity } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { sizes: true },
  });
  if (!product || product.status !== "PUBLISHED") {
    return NextResponse.json({ error: "This product is not available" }, { status: 404 });
  }
  const sizeOption = product.sizes.find((s) => s.age === age);
  if (!sizeOption || !sizeOption.inStock) {
    return NextResponse.json({ error: "This age/size is not available" }, { status: 400 });
  }
  if (product.stock < 1) {
    return NextResponse.json({ error: "This product is out of stock" }, { status: 400 });
  }

  const cart = await getOrCreateCart(user.id);
  const existingItem = cart.items.find((i) => i.productId === productId && i.age === age);

  const desiredQty = (existingItem?.quantity || 0) + quantity;
  if (desiredQty > product.stock) {
    return NextResponse.json(
      { error: `Only ${product.stock} in stock. Please reduce the quantity.` },
      { status: 400 }
    );
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: desiredQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, age, quantity },
    });
  }

  const updatedCart = await getOrCreateCart(user.id);
  return NextResponse.json({ cart: updatedCart }, { status: 201 });
}
