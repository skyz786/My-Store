import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      sizes: { include: { measurement: true }, orderBy: { age: "asc" } },
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product || product.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const related = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: product.id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
    },
    take: 4,
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return NextResponse.json({ product, related });
}
