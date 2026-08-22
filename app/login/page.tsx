import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="container-x py-16">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-2xl font-bold mb-6 text-center">Login to Kids Store</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
