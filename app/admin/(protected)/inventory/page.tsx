import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = { title: "Inventory" };
export const revalidate = 0;

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({ orderBy: { stock: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Inventory</h1>
      <div className="rounded-xl border border-cream-dark bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-dark text-left text-xs uppercase tracking-wide text-ink-light">
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-cream-dark last:border-0">
                <td className="p-4 line-clamp-1">{p.name}</td>
                <td className="p-4 text-ink-light text-xs">{p.sku}</td>
                <td className="p-4">
                  <span className={p.stock <= 5 ? "text-red-600 font-medium" : ""}>{p.stock}</span>
                </td>
                <td className="p-4">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-maroon-600 text-xs hover:underline">
                    Update Stock
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
