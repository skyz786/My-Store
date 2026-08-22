import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm, { type ProductFormInitial } from "@/components/admin/product-form";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, sizes: { include: { measurement: true }, orderBy: { age: "asc" } }, category: true },
  });
  if (!product) notFound();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  const initial: ProductFormInitial = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: String(product.price),
    discountPrice: product.discountPrice != null ? String(product.discountPrice) : "",
    stock: String(product.stock),
    status: product.status,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    categoryId: product.categoryId,
    categories,
    images: product.images.map((img) => ({ url: img.url, publicId: img.publicId, position: img.position })),
    sizes: product.sizes.map((s) => ({
      age: s.age,
      inStock: s.inStock,
      qameezLength: s.measurement ? String(s.measurement.qameezLength) : "",
      chest: s.measurement ? String(s.measurement.chest) : "",
      shoulder: s.measurement ? String(s.measurement.shoulder) : "",
      sleeveLength: s.measurement ? String(s.measurement.sleeveLength) : "",
      neck: s.measurement ? String(s.measurement.neck) : "",
      shalwarLength: s.measurement ? String(s.measurement.shalwarLength) : "",
      waist: s.measurement ? String(s.measurement.waist) : "",
      notes: s.measurement?.notes || "",
    })),
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm initial={initial} />
    </div>
  );
}
