import RegisterForm from "@/components/auth/register-form";

export const metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="container-x py-16">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-2xl font-bold mb-6 text-center">Create Your Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
