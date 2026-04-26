import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { TicketPreviewCard } from "@/components/ticket-preview-card";
import { requireAdminPage } from "@/lib/guards";
import { createQrDataUrl } from "@/lib/qr";
import { getEventSettings } from "@/lib/settings";
import { getTicketForAdmin } from "@/lib/tickets";

export default async function PrintTicketPage({
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

  const downloadHref = `/api/tickets/${ticket.id}/pdf?download=1`;
  const event = await getEventSettings();
  const qrDataUrl = await createQrDataUrl(ticket.token);

  return (
    <main className="print-page print-page--html">
      <div className="print-toolbar no-print">
        <Link className="button button-secondary" href={`/admin/tickets/${ticket.id}`}>
          Back to ticket
        </Link>
        <a className="button button-ghost" href={downloadHref}>
          Download PDF
        </a>
        <PrintButton />
      </div>

      <section className="html-print-panel">
        <div className="html-print-panel__copy no-print">
          <p className="eyebrow">Print Ticket</p>
          <h1>{ticket.guestName}</h1>
          <p className="muted">
            This page prints the same invitation layout shown on screen. In the print dialog,
            choose `A6`, `Portrait`, and `100%` scale.
          </p>
        </div>

        <div className="html-print-stage">
          <TicketPreviewCard
            event={event}
            qrDataUrl={qrDataUrl}
            scanSummary={ticket.scans}
            ticket={ticket}
          />
        </div>
      </section>
    </main>
  );
}
