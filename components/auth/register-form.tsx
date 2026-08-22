"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-cream-dark bg-white p-6">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Full Name</span>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="input mt-1.5"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Email</span>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="input mt-1.5"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Phone (optional)</span>
        <input
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="input mt-1.5"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Password</span>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="input mt-1.5"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-maroon-500 text-white font-semibold py-3 text-sm hover:bg-maroon-600 disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
      <p className="text-center text-xs text-ink-light">
        Already have an account?{" "}
        <Link href="/login" className="text-maroon-600 font-medium hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
