"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PackageSearch, SlidersHorizontal } from "lucide-react";
import ProductGrid from "@/components/product/product-grid";
import EmptyState from "@/components/ui/empty-state";
import type { ProductDTO } from "@/lib/types";

const ALL_AGES = Array.from({ length: 10 }, (_, i) => i + 5); // 5..14

const AGE_GROUP_RANGES: Record<string, [number, number]> = {
  "5-8": [5, 8],
  "9-11": [9, 11],
  "12-14": [12, 14],
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured" },
];

export default function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [age, setAge] = useState<number | null>(searchParams.get("age") ? Number(searchParams.get("age")) : null);
  const ageGroup = searchParams.get("ageGroup");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const featured = searchParams.get("featured") === "true";
  const newArrival = searchParams.get("newArrival") === "true";

  const ageRangeFilter = ageGroup ? AGE_GROUP_RANGES[ageGroup] : null;

  useEffect(() => {
    queueMicrotask(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (age) params.set("age", String(age));
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (sort) params.set("sort", sort);
      if (featured) params.set("featured", "true");
      if (newArrival) params.set("newArrival", "true");
      params.set("pageSize", "48");

      fetch(`/api/products?${params.toString()}`)
        .then((r) => r.json())
        .then((d) => setProducts(d.products || []))
        .finally(() => setLoading(false));
    });
  }, [q, age, minPrice, maxPrice, sort, featured, newArrival]);

  const visibleProducts = useMemo(() => {
    if (!ageRangeFilter) return products;
    const [min, max] = ageRangeFilter;
    return products.filter((p) => p.sizes.some((s) => s.inStock && s.age >= min && s.age <= max));
  }, [products, ageRangeFilter]);

  function updateUrl(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="container-x py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Shop Qameez Shalwar</h1>
        <p className="text-sm text-ink-light mt-1">
          {ageRangeFilter ? `Ages ${ageRangeFilter[0]}–${ageRangeFilter[1]} Years` : "Boys, Ages 5–14 Years"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <button
          className="lg:hidden flex items-center gap-2 text-sm font-medium border border-cream-dark rounded-lg px-4 py-2.5 w-fit"
          onClick={() => setFiltersOpen((s) => !s)}
        >
          <SlidersHorizontal size={16} /> Filters &amp; Sort
        </button>

        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0 space-y-6`}>
          <div>
            <label htmlFor="search" className="text-xs font-semibold uppercase tracking-wide text-ink-light">
              Search
            </label>
            <input
              id="search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="mt-2 w-full rounded-lg border border-cream-dark px-3 py-2 text-sm"
            />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Age</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_AGES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(age === a ? null : a)}
                  className={`h-9 w-9 rounded-full text-sm border ${
                    age === a
                      ? "bg-maroon-500 text-white border-maroon-500"
                      : "border-cream-dark text-ink hover:border-maroon-400"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Price (Rs.)</span>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => updateUrl({ featured: e.target.checked ? "true" : null })}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => updateUrl({ newArrival: e.target.checked ? "true" : null })}
              />
              New Arrivals
            </label>
          </div>

          {ageRangeFilter && (
            <button
              onClick={() => updateUrl({ ageGroup: null })}
              className="text-xs text-maroon-600 underline"
            >
              Clear age group filter
            </button>
          )}
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-ink-light">{visibleProducts.length} products</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-cream-dark px-3 py-2 text-sm bg-white"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl bg-cream-dark animate-pulse" />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No products found"
              message="Try adjusting your filters or search for something else."
            />
          ) : (
            <ProductGrid products={visibleProducts} />
          )}
        </div>
      </div>
    </div>
  );
}
