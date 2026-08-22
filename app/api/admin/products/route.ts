import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const products = await prisma.product.findMany({
      where: { status: { not: "HIDDEN" } },
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        sizes: true,
      },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Admin products error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
