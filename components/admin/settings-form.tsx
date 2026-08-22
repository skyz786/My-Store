"use client";

import { useState } from "react";

export default function SettingsForm({
  deliveryFee,
  freeDeliveryThreshold,
}: {
  deliveryFee: number;
  freeDeliveryThreshold: number | null;
}) {
  const [fee, setFee] = useState(String(deliveryFee));
  const [threshold, setThreshold] = useState(freeDeliveryThreshold != null ? String(freeDeliveryThreshold) : "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deliveryFee: Number(fee),
        freeDeliveryThreshold: threshold ? Number(threshold) : null,
      }),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl rounded-xl border border-cream-dark bg-white p-6 space-y-4">
      <h2 className="text-sm font-semibold">Delivery Settings</h2>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Delivery Fee (Rs.)</span>
        <input type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value)} className="input mt-1.5" />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">
          Free Delivery Threshold (Rs., optional)
        </span>
        <input
          type="number"
          min={0}
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder="Leave blank to disable"
          className="input mt-1.5"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-maroon-500 text-white font-semibold px-6 py-2.5 text-sm hover:bg-maroon-600 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
      {saved && <p className="text-sm text-green-700">Settings saved.</p>}
    </form>
  );
}
