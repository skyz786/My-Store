import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { updateProductSchema } from "@/lib/validations/product";
import { deleteProductImage } from "@/lib/cloudinary";

/* =========================================================
   GET PRODUCT
========================================================= */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        sizes: {
          include: {
            measurement: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 }
    );
  }
}

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Invalid product data",
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const removedPublicIds: string[] = [];
    const updated = await prisma.$transaction(
      async (tx) => {
        /* -----------------------------------------
           Replace Images
        ----------------------------------------- */

        if (data.images) {
          const oldImages =
            await tx.productImage.findMany({
              where: {
                productId: id,
              },
            });

          await tx.productImage.deleteMany({
            where: {
              productId: id,
            },
          });

          for (const image of oldImages) {
            const stillExists =
              data.images.some(
                (newImage) =>
                  newImage.publicId ===
                  image.publicId
              );

            if (!stillExists) removedPublicIds.push(image.publicId);
          }

          await tx.productImage.createMany({
            data: data.images.map(
              (image, index) => ({
                productId: id,
                url: image.url,
                publicId: image.publicId,
                position:
                  image.position ?? index,
              })
            ),
          });
        }

        /* -----------------------------------------
           Replace Sizes
        ----------------------------------------- */

        if (data.sizes) {
          await tx.productSize.deleteMany({
            where: {
              productId: id,
            },
          });

          for (const size of data.sizes) {
            await tx.productSize.create({
              data: {
                productId: id,
                age: size.age,
                inStock: size.inStock,

                measurement: {
                  create: {
                    qameezLength:
                      size.qameezLength,
                    chest: size.chest,
                    shoulder:
                      size.shoulder,
                    sleeveLength:
                      size.sleeveLength,
                    neck: size.neck,
                    shalwarLength:
                      size.shalwarLength,
                    waist: size.waist,
                    notes: size.notes,
                  },
                },
              },
            });
          }
        }

        /* -----------------------------------------
           Update Product
        ----------------------------------------- */

        return tx.product.update({
          where: {
            id,
          },

          data: {
            ...(data.name !== undefined && {
              name: data.name,
            }),

            ...(data.description !== undefined && {
              description: data.description,
            }),

            ...(data.price !== undefined && {
              price: data.price,
            }),

            ...(data.discountPrice !== undefined && {
              discountPrice:
                data.discountPrice,
            }),

            ...(data.stock !== undefined && {
              stock: data.stock,
            }),

            ...(data.status !== undefined && {
              status: data.status,
            }),

            ...(data.isFeatured !== undefined && {
              isFeatured:
                data.isFeatured,
            }),

            ...(data.isNewArrival !== undefined && {
              isNewArrival:
                data.isNewArrival,
            }),

            ...(data.categoryId !== undefined && {
              categoryId:
                data.categoryId,
            }),
          },

          include: {
            images: true,
            sizes: {
              include: {
                measurement: true,
              },
            },
          },
        });
      }
    );

    await Promise.all(
      removedPublicIds.map((publicId) =>
        deleteProductImage(publicId).catch((error) =>
          console.error(`Cloudinary image delete failed: ${publicId}`, error)
        )
      )
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update product",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
        include: { images: true },
      });
      if (!product) return null;

      const orderItemCount = await tx.orderItem.count({ where: { productId: id } });
      if (orderItemCount > 0) {
        const product = await tx.product.update({
          where: { id },
          data: { status: "HIDDEN", isFeatured: false, isNewArrival: false },
        });
        return { hidden: true, product };
      }

      await tx.cartItem.deleteMany({ where: { productId: id } });
      await tx.review.deleteMany({ where: { productId: id } });
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productSize.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
      return { hidden: false, images: product.images };
    }, { isolationLevel: "Serializable" });

    if (!result) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (result.hidden) {
      return NextResponse.json({ ok: true, hidden: true, message: "Product hidden because it has existing orders." });
    }

    await Promise.all(
      (result.images || []).map((image) =>
        deleteProductImage(image.publicId).catch((error) =>
          console.error(`Cloudinary image delete failed: ${image.publicId}`, error)
        )
      )
    );
    return NextResponse.json({ ok: true, deleted: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete product" }, { status: 500 });
  }
}