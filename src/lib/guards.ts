import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";

export async function requireAdminPage() {
  const session = await getSession();

  if (!session || session.role !== Role.ADMIN) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireScannerPage() {
  const session = await getSession();

  if (!session || (session.role !== Role.OUTSIDE && session.role !== Role.INSIDE)) {
    redirect("/scanner/login");
  }

  return session;
}
