import Link from "next/link";
import { prisma } from "@/lib/db";
import Hero from "@/components/home/hero";
import ShopByAge from "@/components/home/shop-by-age";
import WhyChooseUs from "@/components/home/why-choose-us";
import MeasurementGuide from "@/components/home/measurement-guide";
import HowToOrder from "@/components/home/how-to-order";
import WhatsAppCTA from "@/components/home/whatsapp-cta";
import ProductGrid from "@/components/product/product-grid";
import type { ProductDTO } from "@/lib/types";

export const revalidate = 0;

async function getHomeProducts() {
  const [featured, newArrivals] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { position: "asc" }, take: 1 }, sizes: { select: { age: true, inStock: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", isNewArrival: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { position: "asc" }, take: 1 }, sizes: { select: { age: true, inStock: true } } },
    }),
  ]);
  return { featured: featured as unknown as ProductDTO[], newArrivals: newArrivals as unknown as ProductDTO[] };
}

export default async function HomePage() {
  const { featured, newArrivals } = await getHomeProducts();

  return (
    <>
      <Hero />
      <ShopByAge />

      {featured.length > 0 && (
        <section className="container-x py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">Featured Qameez Shalwar</h2>
              <p className="text-sm text-ink-light mt-1">Handpicked favourites from Kids Store</p>
            </div>
            <Link href="/shop?featured=true" className="text-sm font-medium text-maroon-600 hover:underline whitespace-nowrap">
              View all
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="container-x pb-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">New Arrivals</h2>
              <p className="text-sm text-ink-light mt-1">Freshly added to the collection</p>
            </div>
            <Link href="/shop?newArrival=true" className="text-sm font-medium text-maroon-600 hover:underline whitespace-nowrap">
              View all
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )}

      <WhyChooseUs />
      <MeasurementGuide />
      <HowToOrder />
      <WhatsAppCTA />
    </>
  );
}
