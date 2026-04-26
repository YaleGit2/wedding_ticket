import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Printer } from "lucide-react";
import { DeleteTicketButton } from "@/components/delete-ticket-button";
import { LogoutButton } from "@/components/logout-button";
import { TicketPreviewCard } from "@/components/ticket-preview-card";
import { formatDateTime } from "@/lib/format";
import { requireAdminPage } from "@/lib/guards";
import { createQrDataUrl } from "@/lib/qr";
import { getEventSettings } from "@/lib/settings";
import { getTicketForAdmin } from "@/lib/tickets";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  const ticket = await getTicketForAdmin(id);

  if (!ticket) {
    notFound();
  }

  const event = await getEventSettings();
  const qrDataUrl = await createQrDataUrl(ticket.token);

  return (
    <main className="dashboard-page narrow-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Ticket Detail</p>
          <h1>{ticket.guestName}</h1>
          <p className="muted">Created {formatDateTime(ticket.createdAt)}</p>
        </div>
        <div className="hero-actions">
          <a className="button button-secondary" href={`/api/tickets/${ticket.id}/pdf?download=1`}>
            <Download size={18} />
            Download PDF
          </a>
          <Link className="button button-primary" href={`/admin/tickets/${ticket.id}/print`}>
            <Printer size={18} />
            Print ticket
          </Link>
          <DeleteTicketButton guestName={ticket.guestName} redirectTo="/admin/tickets" ticketId={ticket.id} />
          <LogoutButton />
        </div>
      </section>

      <TicketPreviewCard event={event} qrDataUrl={qrDataUrl} scanSummary={ticket.scans} ticket={ticket} />

      <section className="panel stack-lg">
        <div className="panel-header">
          <p className="eyebrow">Scan history</p>
          <h2>Checkpoint activity</h2>
        </div>

        <div className="history-list">
          {ticket.scans.length ? (
            ticket.scans.map((scan) => (
              <article className="history-item" key={scan.id}>
                <div>
                  <h3>{scan.checkpoint === "OUTSIDE" ? "Outside entrance" : "Inside door"}</h3>
                  <p className="muted">{formatDateTime(scan.createdAt)}</p>
                </div>
                <div className={`decision-chip ${scan.result === "ALLOW" ? "allow" : "deny"}`}>
                  {scan.result}
                </div>
              </article>
            ))
          ) : (
            <p className="muted">No scans yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
