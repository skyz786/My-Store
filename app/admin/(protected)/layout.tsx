import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/admin-sidebar";
import Logo from "@/components/ui/logo";

// Real authorization boundary: every request to a protected /admin page runs
// requireAdmin() server-side (verifies the JWT + confirms role === "ADMIN"
// against the database) before rendering anything.
export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream">
      <header className="h-16 border-b border-cream-dark bg-white flex items-center px-4 sm:px-6">
        <Logo />
        <span className="ml-4 text-xs font-semibold uppercase tracking-wide text-ink-light">Admin Panel</span>
      </header>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
