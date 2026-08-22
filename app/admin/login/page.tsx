import AdminLoginForm from "@/components/admin/admin-login-form";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="container-x py-16">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-2xl font-bold mb-2 text-center">Kids Store Admin</h1>
        <p className="text-sm text-ink-light text-center mb-6">Login to manage products and orders</p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
