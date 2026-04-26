import Link from "next/link";
import { AdminTicketForm } from "@/components/admin-ticket-form";
import { requireAdminPage } from "@/lib/guards";

export default async function NewTicketPage() {
  await requireAdminPage();

  return (
    <main className="dashboard-page narrow-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Create a new wedding ticket</h1>
          <p className="muted">
            Issue a secure QR invitation with guest-specific details for print or PDF export.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="button button-ghost" href="/admin/tickets">
            Back to tickets
          </Link>
        </div>
      </section>

      <AdminTicketForm />
    </main>
  );
}
