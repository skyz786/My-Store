import ProductForm from "@/components/admin/product-form";
import { prisma } from "@/lib/db";

export const metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">
        Add Product
      </h1>

      <ProductForm
        initial={{
          name: "",
          description: "",
          price: "",
          discountPrice: "",
          stock: "",
          status: "DRAFT",
          isFeatured: false,
          isNewArrival: false,
          categoryId: null,
          categories,
          images: [],
          sizes: [],
        }}
      />
    </div>
  );
}