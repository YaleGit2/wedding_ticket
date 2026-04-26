import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { AuthShell } from "@/components/auth-shell";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage() {
  const session = await getSession();

  if (session?.role === Role.ADMIN) {
    redirect("/admin/tickets");
  }

  return (
    <AuthShell
      description="Sign in with the admin password to issue tickets, manage event details, and print PDFs."
      eyebrow="Admin Access"
      title="Wedding ticket issuer"
    >
      <AdminLoginForm />
    </AuthShell>
  );
}
