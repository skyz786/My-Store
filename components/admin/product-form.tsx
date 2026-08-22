"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, UploadCloud, Loader2 } from "lucide-react";

type ImageItem = { url: string; publicId: string; position: number };
type CategoryOption = { id: string; name: string };
type SizeRow = {
  age: number;
  inStock: boolean;
  qameezLength: string;
  chest: string;
  shoulder: string;
  sleeveLength: string;
  neck: string;
  shalwarLength: string;
  waist: string;
  notes: string;
};

const ALL_AGES = Array.from({ length: 10 }, (_, i) => i + 5); // 5..14

function emptySizeRow(age: number): SizeRow {
  return {
    age,
    inStock: true,
    qameezLength: "",
    chest: "",
    shoulder: "",
    sleeveLength: "",
    neck: "",
    shalwarLength: "",
    waist: "",
    notes: "",
  };
}

export type ProductFormInitial = {
  id?: string;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  isFeatured: boolean;
  isNewArrival: boolean;
  categoryId: string | null;
  categories?: CategoryOption[];
  images: ImageItem[];
  sizes: SizeRow[];
};

export function emptyProductForm(): ProductFormInitial {
  return {
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    status: "DRAFT",
    isFeatured: false,
    isNewArrival: false,
    categoryId: null,
    images: [],
    sizes: [],
  };
}

export default function ProductForm({ initial }: { initial: ProductFormInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial.id);

  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [price, setPrice] = useState(initial.price);
  const [discountPrice, setDiscountPrice] = useState(initial.discountPrice);
  const [stock, setStock] = useState(initial.stock);
  const [status, setStatus] = useState(initial.status);
  const [isFeatured, setIsFeatured] = useState(initial.isFeatured);
  const [isNewArrival, setIsNewArrival] = useState(initial.isNewArrival);
  const [categoryId, setCategoryId] = useState(initial.categoryId || "");
  const [images, setImages] = useState<ImageItem[]>(initial.images);
  const [sizes, setSizes] = useState<SizeRow[]>(initial.sizes);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Image upload failed");
          continue;
        }
        setImages((prev) => [...prev, { url: data.url, publicId: data.publicId, position: prev.length }]);
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
      }
    }
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(publicId: string) {
    setImages((prev) => prev.filter((i) => i.publicId !== publicId).map((i, idx) => ({ ...i, position: idx })));
  }

  function toggleAge(age: number) {
    setSizes((prev) => {
      const exists = prev.find((s) => s.age === age);
      if (exists) return prev.filter((s) => s.age !== age);
      return [...prev, emptySizeRow(age)].sort((a, b) => a.age - b.age);
    });
  }

  function updateSizeField(age: number, field: keyof SizeRow, value: string | boolean) {
    setSizes((prev) => prev.map((s) => (s.age === age ? { ...s, [field]: value } : s)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError("Please upload at least one product image");
      return;
    }
    if (sizes.length === 0) {
      setError("Please add at least one age/size with measurements");
      return;
    }
    for (const s of sizes) {
      if (!s.qameezLength || !s.chest || !s.shoulder || !s.sleeveLength || !s.neck || !s.shalwarLength || !s.waist) {
        setError(`Please complete all measurements for age ${s.age}`);
        return;
      }
    }

    setSubmitting(true);
    const payload = {
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock),
      status,
      isFeatured,
      isNewArrival,
      categoryId: categoryId || null,
      images,
      sizes: sizes.map((s) => ({
        age: s.age,
        inStock: s.inStock,
        qameezLength: Number(s.qameezLength),
        chest: Number(s.chest),
        shoulder: Number(s.shoulder),
        sleeveLength: Number(s.sleeveLength),
        neck: Number(s.neck),
        shalwarLength: Number(s.shalwarLength),
        waist: Number(s.waist),
        notes: s.notes || undefined,
      })),
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/products/${initial.id}` : "/api/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save product");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <section className="rounded-xl border border-cream-dark bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold">Product Information</h2>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Product Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input mt-1.5" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Description</span>
          <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="input mt-1.5" />
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Price (Rs.)</span>
            <input required type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} className="input mt-1.5" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Discount Price (optional)</span>
            <input type="number" min={0} value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="input mt-1.5" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Stock Quantity</span>
            <input required type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className="input mt-1.5" />
          </label>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="input mt-1.5">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm pb-2.5">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Featured Product
          </label>
          <label className="flex items-center gap-2 text-sm pb-2.5">
            <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} /> New Arrival
          </label>
        </div>
        {initial.categories && (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Category</span>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input mt-1.5">
              <option value="">No category</option>
              {initial.categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
        )}
      </section>

      <section className="rounded-xl border border-cream-dark bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold">Product Images</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img.publicId} className="relative h-24 w-24 rounded-lg overflow-hidden border border-cream-dark">
              <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                aria-label="Remove image"
                className="absolute top-1 right-1 bg-white/90 rounded-full p-1 text-red-600"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <label className="h-24 w-24 rounded-lg border-2 border-dashed border-cream-dark flex flex-col items-center justify-center text-ink-light cursor-pointer hover:border-maroon-400">
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
            <span className="text-[10px] mt-1">Upload</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
        <p className="text-xs text-ink-light">JPG, PNG or WEBP. Max 5MB per image.</p>
      </section>

      <section className="rounded-xl border border-cream-dark bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold">Available Ages &amp; Measurements (inches)</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_AGES.map((age) => {
            const active = sizes.some((s) => s.age === age);
            return (
              <button
                key={age}
                type="button"
                onClick={() => toggleAge(age)}
                className={`h-9 w-9 rounded-full text-sm border ${
                  active ? "bg-maroon-500 text-white border-maroon-500" : "border-cream-dark text-ink hover:border-maroon-400"
                }`}
              >
                {age}
              </button>
            );
          })}
        </div>

        {sizes.length > 0 && (
          <div className="space-y-4 pt-2">
            {sizes.map((s) => (
              <div key={s.age} className="rounded-lg border border-cream-dark p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Age {s.age} Years</p>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={s.inStock} onChange={(e) => updateSizeField(s.age, "inStock", e.target.checked)} />
                    In stock
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MeasureInput label="Qameez Length" value={s.qameezLength} onChange={(v) => updateSizeField(s.age, "qameezLength", v)} />
                  <MeasureInput label="Chest" value={s.chest} onChange={(v) => updateSizeField(s.age, "chest", v)} />
                  <MeasureInput label="Shoulder" value={s.shoulder} onChange={(v) => updateSizeField(s.age, "shoulder", v)} />
                  <MeasureInput label="Sleeve" value={s.sleeveLength} onChange={(v) => updateSizeField(s.age, "sleeveLength", v)} />
                  <MeasureInput label="Neck" value={s.neck} onChange={(v) => updateSizeField(s.age, "neck", v)} />
                  <MeasureInput label="Shalwar Length" value={s.shalwarLength} onChange={(v) => updateSizeField(s.age, "shalwarLength", v)} />
                  <MeasureInput label="Waist" value={s.waist} onChange={(v) => updateSizeField(s.age, "waist", v)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="rounded-lg bg-maroon-500 text-white font-semibold px-8 py-3 text-sm hover:bg-maroon-600 disabled:opacity-60"
      >
        {submitting ? "Saving..." : isEdit ? "Save Changes" : "Publish Product"}
      </button>
    </form>
  );
}

function MeasureInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] text-ink-light">{label}</span>
      <input
        type="number"
        step="0.5"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input mt-1"
      />
    </label>
  );
}
