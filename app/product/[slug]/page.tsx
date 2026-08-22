import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductGallery from "@/components/product/product-gallery";
import PurchasePanel from "@/components/product/purchase-panel";
import ProductGrid from "@/components/product/product-grid";
import type { ProductDTO, ProductSizeWithMeasurementDTO } from "@/lib/types";

export const revalidate = 0;

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      sizes: { include: { measurement: true }, orderBy: { age: "asc" } },
      category: true,
    },
  });
  if (!product || product.status !== "PUBLISHED") return null;

  const related = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: product.id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
    },
    take: 4,
    include: { images: { orderBy: { position: "asc" }, take: 1 }, sizes: { select: { age: true, inStock: true } } },
  });

  return { product, related };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return { title: "Product Not Found" };
  const { product } = data;
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();
  const { product, related } = data;

  const sizes = product.sizes as unknown as ProductSizeWithMeasurementDTO[];

  return (
    <div className="container-x py-10">
      <nav className="text-xs text-ink-light mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-maroon-600">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-maroon-600">Shop</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-ink-light mt-2 mb-6 leading-relaxed">{product.description}</p>

          <PurchasePanel
            productId={product.id}
            price={product.price}
            discountPrice={product.discountPrice}
            stock={product.stock}
            sizes={sizes}
            productName={product.name}
          />
        </div>
      </div>

      <div className="mt-14 grid sm:grid-cols-3 gap-6">
        <InfoCard title="Delivery Information" body="Orders are dispatched within 2-4 working days and delivered across Pakistan via trusted courier partners." />
        <InfoCard title="Return / Exchange Policy" body="Size exchanges are accepted within 3 days of delivery if the item is unworn and in original condition. Contact us on WhatsApp to arrange it." />
        <InfoCard title="Need Help Choosing a Size?" body="Message Zeeshan directly on WhatsApp with your child's age and we'll help you pick the right fit." />
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold mb-6">You May Also Like</h2>
          <ProductGrid products={related as unknown as ProductDTO[]} />
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-cream-dark bg-white p-5">
      <h3 className="text-sm font-semibold text-maroon-600 mb-1.5">{title}</h3>
      <p className="text-xs text-ink-light leading-relaxed">{body}</p>
    </div>
  );
}
