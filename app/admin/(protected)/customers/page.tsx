import { prisma } from "@/lib/db";

export const metadata = { title: "Customers" };
export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Customers</h1>
      <div className="rounded-xl border border-cream-dark bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-dark text-left text-xs uppercase tracking-wide text-ink-light">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-light">No customers yet.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-cream-dark last:border-0">
                  <td className="p-4">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.phone || "—"}</td>
                  <td className="p-4">{c._count.orders}</td>
                  <td className="p-4 text-xs text-ink-light">{new Date(c.createdAt).toLocaleDateString("en-PK")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
