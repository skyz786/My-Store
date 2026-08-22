import Link from "next/link";

const GROUPS = [
  { label: "5–8 Years", href: "/shop?ageGroup=5-8" },
  { label: "9–11 Years", href: "/shop?ageGroup=9-11" },
  { label: "12–14 Years", href: "/shop?ageGroup=12-14" },
];

export default function ShopByAge() {
  return (
    <section className="container-x py-14">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">Shop by Age</h2>
      <p className="text-center text-ink-light mt-2 text-sm">Find the perfect fit for your little one</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {GROUPS.map((g) => (
          <Link
            key={g.label}
            href={g.href}
            className="rounded-2xl border border-cream-dark bg-white p-8 text-center hover:border-maroon-400 hover:shadow-md transition-all"
          >
            <span className="block font-display text-xl font-semibold text-maroon-600">{g.label}</span>
            <span className="block text-xs text-ink-light mt-2">Browse collection →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
