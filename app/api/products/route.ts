import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { generateSku } from "@/lib/format";
import { createProductSchema } from "@/lib/validations/product";
import { deleteProductImage } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = params.get("q")?.trim();
  const ageValue = params.get("age");
  const minPriceValue = params.get("minPrice");
  const maxPriceValue = params.get("maxPrice");
  const age = ageValue ? Number(ageValue) : null;
  const minPrice = minPriceValue ? Number(minPriceValue) : null;
  const maxPrice = maxPriceValue ? Number(maxPriceValue) : null;
  const pageSize = Math.min(Math.max(Number(params.get("pageSize")) || 48, 1), 100);

  try {
    const products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        ...(age !== null && Number.isInteger(age) && age >= 5 && age <= 14 ? { sizes: { some: { age, inStock: true } } } : {}),
        ...(minPrice !== null && Number.isFinite(minPrice) && minPrice >= 0 ? { price: { gte: minPrice } } : {}),
        ...(maxPrice !== null && Number.isFinite(maxPrice) && maxPrice >= 0 ? { price: { lte: maxPrice } } : {}),
        ...(params.get("featured") === "true" ? { isFeatured: true } : {}),
        ...(params.get("newArrival") === "true" ? { isNewArrival: true } : {}),
      },
      orderBy: params.get("sort") === "price_asc"
        ? { price: "asc" }
        : params.get("sort") === "price_desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
      take: pageSize,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        sizes: { select: { id: true, age: true, inStock: true } },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Public products error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let submittedPublicIds: string[] = [];
  try {
    const parsed = createProductSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid product data" }, { status: 400 });
    }

    const data = parsed.data;
    submittedPublicIds = data.images.map((image) => image.publicId);
    if (data.categoryId && !(await prisma.category.findUnique({ where: { id: data.categoryId }, select: { id: true } }))) {
      return NextResponse.json({ error: "Selected category was not found" }, { status: 400 });
    }

    const slugBase = data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product";
    let slug = slugBase;
    let suffix = 1;
    while (await prisma.product.findUnique({ where: { slug }, select: { id: true } })) slug = `${slugBase}-${suffix++}`;

    let sku = data.sku || generateSku(data.name);
    while (await prisma.product.findUnique({ where: { sku }, select: { id: true } })) sku = generateSku(data.name);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        sku,
        stock: data.stock,
        status: data.status,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        categoryId: data.categoryId,
        images: { create: data.images.map((image, index) => ({ ...image, position: image.position ?? index })) },
        sizes: {
          create: data.sizes.map((size) => ({
            age: size.age,
            inStock: size.inStock,
            measurement: {
              create: {
                qameezLength: size.qameezLength,
                chest: size.chest,
                shoulder: size.shoulder,
                sleeveLength: size.sleeveLength,
                neck: size.neck,
                shalwarLength: size.shalwarLength,
                waist: size.waist,
                notes: size.notes,
              },
            },
          })),
        },
      },
      include: { images: true, sizes: { include: { measurement: true } } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    await Promise.all(
      submittedPublicIds.map((publicId) =>
        deleteProductImage(publicId).catch((cleanupError) =>
          console.error(`Cloudinary orphan cleanup failed: ${publicId}`, cleanupError)
        )
      )
    );
    return NextResponse.json({ error: error instanceof Error ? `Could not save product: ${error.message}` : "Could not save product" }, { status: 500 });
  }
}