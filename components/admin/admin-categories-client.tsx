"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string; slug: string };

export default function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    queueMicrotask(load);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not add category");
      return;
    }
    setName("");
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6 max-w-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Festive Wear"
          required
          className="input"
        />
        <button type="submit" className="rounded-lg bg-maroon-500 text-white text-sm font-medium px-5 py-2 hover:bg-maroon-600 whitespace-nowrap">
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="rounded-xl border border-cream-dark bg-white divide-y divide-cream-dark max-w-md">
        {loading ? (
          <p className="p-4 text-sm text-ink-light">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="p-4 text-sm text-ink-light">No categories yet.</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="p-4 text-sm flex justify-between">
              <span>{c.name}</span>
              <span className="text-ink-light text-xs">{c.slug}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
