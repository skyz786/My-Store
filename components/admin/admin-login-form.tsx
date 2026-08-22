"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
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

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Login failed");
      return;
    }
    if (data.role !== "ADMIN") {
      await fetch("/api/auth/logout", { method: "POST" });
      setLoading(false);
      setError("This account does not have admin access.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-cream-dark bg-white p-6">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">Admin Email</span>
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
        {loading ? "Logging in..." : "Login to Admin Panel"}
      </button>
    </form>
  );
}
