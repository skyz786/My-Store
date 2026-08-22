"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-cream-dark bg-white p-6">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mt-1.5"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mt-1.5"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-maroon-500 text-white font-semibold py-3 text-sm hover:bg-maroon-600 disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="text-center text-xs text-ink-light">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-maroon-600 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
