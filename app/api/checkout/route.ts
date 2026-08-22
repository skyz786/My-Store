import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations/checkout";
import { getStoreSettings, calculateDeliveryFee } from "@/lib/settings";
import { generateOrderNumber } from "@/lib/format";
import { isEasypaisaConfigured, initiateEasypaisaPayment } from "@/lib/payments/easypaisa";

// Creates a real order. Every price and stock check is recalculated here from
// the database — nothing about price, quantity, or availability sent from the
// browser is ever trusted.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid order" }, { status: 400 });
  }
  const data = parsed.data;

  if (data.paymentMethod === "EASYPAISA" && !isEasypaisaConfigured()) {
    return NextResponse.json(
      { error: "Easypaisa is not available yet. Please choose Cash on Delivery." },
      { status: 400 }
    );
  }

  // Re-fetch every product fresh from the DB and validate availability/stock/age.
  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { sizes: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Merge duplicate (productId, age) lines defensively.
  const merged = new Map<string, { productId: string; age: number; quantity: number }>();
  for (const item of data.items) {
    const key = `${item.productId}:${item.age}`;
    const existing = merged.get(key);
    merged.set(key, { ...item, quantity: (existing?.quantity || 0) + item.quantity });
  }

  const orderLines: {
    productId: string;
    productName: string;
    age: number;
    quantity: number;
    unitPrice: number;
  }[] = [];

  for (const item of merged.values()) {
    const product = productMap.get(item.productId);
    if (!product || product.status !== "PUBLISHED") {
      return NextResponse.json({ error: "One of the items in your order is no longer available" }, { status: 400 });
    }
    const sizeOption = product.sizes.find((s) => s.age === item.age);
    if (!sizeOption || !sizeOption.inStock) {
      return NextResponse.json(
        { error: `${product.name} is not available in age ${item.age}` },
        { status: 400 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `${product.name} only has ${product.stock} left in stock` },
        { status: 400 }
      );
    }
    const unitPrice = product.discountPrice ?? product.price;
    orderLines.push({
      productId: product.id,
      productName: product.name,
      age: item.age,
      quantity: item.quantity,
      unitPrice,
    });
  }

  const subtotal = orderLines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const settings = await getStoreSettings();
  const deliveryFee = calculateDeliveryFee(subtotal, settings.deliveryFee, settings.freeDeliveryThreshold);
  const total = subtotal + deliveryFee;

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Re-check + decrement stock atomically to avoid overselling.
      for (const line of orderLines) {
        const updated = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(`STOCK_UNAVAILABLE:${line.productName}`);
        }
      }

      let orderNumber = generateOrderNumber();
      // Extremely unlikely collision guard.
      while (await tx.order.findUnique({ where: { orderNumber } })) {
        orderNumber = generateOrderNumber();
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id,
          customerName: data.customerName,
          phone: data.phone,
          whatsapp: data.whatsapp || null,
          address: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode || null,
          notes: data.notes || null,
          subtotal,
          deliveryFee,
          total,
          paymentMethod: data.paymentMethod,
          paymentStatus: "PENDING",
          orderStatus: "PENDING",
          items: {
            create: orderLines.map((l) => ({
              productId: l.productId,
              productName: l.productName,
              age: l.age,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
            })),
          },
          payment: {
            create: {
              method: data.paymentMethod,
              status: "PENDING",
              amount: total,
            },
          },
        },
        include: { items: true, payment: true },
      });

      // Clear the user's saved cart after a successful order.
      if (user) {
        const cart = await tx.cart.findUnique({ where: { userId: user.id } });
        if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return createdOrder;
    });

    if (data.paymentMethod === "EASYPAISA") {
      const result = await initiateEasypaisaPayment({
        orderNumber: order.orderNumber,
        amount: total,
        customerPhone: data.phone,
      });
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Easypaisa payment could not be started", orderNumber: order.orderNumber },
          { status: 502 }
        );
      }
      return NextResponse.json({ orderNumber: order.orderNumber, redirectUrl: result.redirectUrl });
    }

    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("STOCK_UNAVAILABLE:")) {
      const name = err.message.split(":")[1];
      return NextResponse.json({ error: `${name} just went out of stock. Please update your cart.` }, { status: 409 });
    }
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "We could not place your order. Please try again." }, { status: 500 });
  }
}
