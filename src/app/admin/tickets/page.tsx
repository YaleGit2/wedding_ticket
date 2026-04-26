import Link from "next/link";
import { Checkpoint, ScanResult } from "@prisma/client";
import { Download, ExternalLink, Printer } from "lucide-react";
import { DeleteTicketButton } from "@/components/delete-ticket-button";
import { EventSettingsForm } from "@/components/event-settings-form";
import { LogoutButton } from "@/components/logout-button";
import { requireAdminPage } from "@/lib/guards";
import { getEventSettings } from "@/lib/settings";
import { listTickets } from "@/lib/tickets";
import { formatDateTime } from "@/lib/format";

export default async function AdminTicketsPage() {
  await requireAdminPage();
  const [event, tickets] = await Promise.all([getEventSettings(), listTickets()]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Issued invitation tickets</h1>
          <p className="muted">
            Review ticket usage, create new invitations, and keep the wedding profile up to date.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="button button-primary" href="/admin/tickets/new">
            New ticket
          </Link>
          <LogoutButton />
        </div>
      </section>

      <section className="dashboard-grid">
        <EventSettingsForm
          initialValues={{
            weddingTitle: event.weddingTitle,
            coupleNames: event.coupleNames,
            weddingDate: event.weddingDate,
            venue: event.venue,
            programDetails: event.programDetails,
          }}
        />

        <section className="panel stack-lg">
          <div className="panel-header">
            <p className="eyebrow">Issued Tickets</p>
            <h2>{tickets.length} invitation(s)</h2>
          </div>

          <div className="table-wrap">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Ticket ID</th>
                  <th>Guests</th>
                  <th>Outside</th>
                  <th>Inside</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => {
                  const outsideUsed = ticket.scans.some(
                    (scan) =>
                      scan.checkpoint === Checkpoint.OUTSIDE && scan.result === ScanResult.ALLOW,
                  );
                  const insideUsed = ticket.scans.some(
                    (scan) =>
                      scan.checkpoint === Checkpoint.INSIDE && scan.result === ScanResult.ALLOW,
                  );

                  return (
                    <tr key={ticket.id}>
                      <td>
                        <Link className="row-link" href={`/admin/tickets/${ticket.id}`}>
                          {ticket.guestName}
                        </Link>
                      </td>
                      <td>{ticket.ticketCode}</td>
                      <td>{ticket.numberOfGuests ?? 1}</td>
                      <td>
                        <span className={`status-pill ${outsideUsed ? "used" : ""}`}>
                          {outsideUsed ? "Used" : "Unused"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${insideUsed ? "used" : ""}`}>
                          {insideUsed ? "Used" : "Unused"}
                        </span>
                      </td>
                      <td>{formatDateTime(ticket.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <Link
                            aria-label={`View invite for ${ticket.guestName}`}
                            className="icon-action"
                            href={`/invite/${ticket.token}`}
                            target="_blank"
                            title="View invite"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <Link
                            aria-label={`Print ticket for ${ticket.guestName}`}
                            className="icon-action"
                            href={`/admin/tickets/${ticket.id}/print`}
                            title="Print ticket"
                          >
                            <Printer size={16} />
                          </Link>
                          <a
                            aria-label={`Download PDF for ${ticket.guestName}`}
                            className="icon-action"
                            href={`/api/tickets/${ticket.id}/pdf?download=1`}
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </a>
                          <DeleteTicketButton
                            guestName={ticket.guestName}
                            ticketId={ticket.id}
                            variant="icon"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
