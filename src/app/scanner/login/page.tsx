import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { ScannerLoginForm } from "@/components/scanner-login-form";
import { getSession } from "@/lib/auth";

export default async function ScannerLoginPage() {
  const session = await getSession();

  if (session?.role === Role.OUTSIDE || session?.role === Role.INSIDE) {
    redirect("/scanner");
  }

  return (
    <AuthShell
      description="Choose the checkpoint role, enter its password, and open the live scanner."
      eyebrow="Scanner Access"
      title="Checkpoint validation"
    >
      <ScannerLoginForm />
    </AuthShell>
  );
}
