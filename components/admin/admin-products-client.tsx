"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { formatPKR } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  DRAFT: "bg-yellow-100 text-yellow-800",
  HIDDEN: "bg-gray-100 text-gray-700",
};

export default function AdminProductsClient() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to load products"
        );
      }

      // Do not show hidden/deleted products
      const visibleProducts = (data.products || []).filter(
        (product: ProductDTO) =>
          product.status !== "HIDDEN"
      );

      setProducts(visibleProducts);
    } catch (err) {
      console.error("Load products error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadProducts();
    });
  }, []);

  async function handleDelete(id: string) {
    const product = products.find(
      (item) => item.id === id
    );

    const productName =
      product?.name || "this product";

    const confirmed = window.confirm(
      `Delete "${productName}"?\n\nIf this product has previous orders, it will be hidden instead of permanently deleted.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Could not delete product"
        );
      }

      /*
       * Immediately remove the product
       * from the current Admin list.
       */
      setProducts((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );

      /*
       * If the product was hidden because it
       * had an existing order, it is still
       * removed from this list.
       */
      if (data.hidden) {
        alert(
          "Product has been hidden successfully. It will no longer appear on the shop or homepage."
        );
      } else {
        alert(
          "Product deleted successfully."
        );
      }
    } catch (err) {
      console.error(
        "Delete product error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Could not delete product";

      setError(message);
      alert(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">
          Products
        </h1>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-maroon-500 text-white text-sm font-medium px-4 py-2.5 hover:bg-maroon-600"
        >
          <PlusCircle size={16} />
          Add Product
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* PRODUCTS TABLE */}
      <div className="rounded-xl border border-cream-dark bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-dark text-left text-xs uppercase tracking-wide text-ink-light">
              <th className="p-4">
                Product
              </th>

              <th className="p-4">
                Price
              </th>

              <th className="p-4">
                Stock
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Featured
              </th>

              <th className="p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/* LOADING */}
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-ink-light"
                >
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              /* EMPTY */
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-ink-light"
                >
                  No products yet. Add your first
                  product to get started.
                </td>
              </tr>
            ) : (
              /* PRODUCTS */
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-cream-dark last:border-0"
                >
                  {/* PRODUCT */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-cream-dark shrink-0">
                        {product.images?.[0] && (
                          <Image
                            src={
                              product.images[0].url
                            }
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      <span className="line-clamp-1">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="p-4 whitespace-nowrap">
                    {formatPKR(
                      product.discountPrice ??
                        product.price
                    )}

                    {product.discountPrice != null && (
                      <span className="text-xs text-ink-light line-through ml-1.5">
                        {formatPKR(
                          product.price
                        )}
                      </span>
                    )}
                  </td>

                  {/* STOCK */}
                  <td className="p-4">
                    {product.stock}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        STATUS_BADGE[
                          product.status
                        ] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  {/* FEATURED */}
                  <td className="p-4">
                    {product.isFeatured
                      ? "Yes"
                      : "—"}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {/* EDIT */}
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        aria-label={`Edit ${product.name}`}
                        className="text-maroon-600 hover:text-maroon-700"
                      >
                        <Pencil size={16} />
                      </Link>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            product.id
                          )
                        }
                        disabled={deletingId !== null}
                        aria-label={`Delete ${product.name}`}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId ===
                        product.id ? (
                          <span className="text-xs">
                            Deleting...
                          </span>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}