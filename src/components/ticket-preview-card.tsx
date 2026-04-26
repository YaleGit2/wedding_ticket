import Image from "next/image";
import { EventSettings, Ticket, Checkpoint, ScanResult } from "@prisma/client";
import { nl2br } from "@/lib/format";

type TicketPreviewCardProps = {
  event: EventSettings;
  ticket: Ticket;
  qrDataUrl: string;
  scanSummary?: Array<{
    checkpoint: Checkpoint;
    result: ScanResult;
    createdAt: Date;
  }>;
  showScanStatus?: boolean;
};

export function TicketPreviewCard({
  event,
  ticket,
  qrDataUrl,
  scanSummary = [],
  showScanStatus = true,
}: TicketPreviewCardProps) {
  return (
    <article className="ticket-card">
      <div className="ticket-card__bloom ticket-card__bloom--top" />
      <div className="ticket-card__bloom ticket-card__bloom--bottom" />

      <div className="ticket-card__hero">
        <p className="ticket-card__kicker">{event.weddingTitle}</p>
        <h2>{event.coupleNames}</h2>
        <div className="ticket-card__meta">
          <span>{event.weddingDate}</span>
          <span>{event.venue}</span>
        </div>
      </div>

      <div className="ticket-card__intro">
        <div>
          <p className="eyebrow">Issued To</p>
          <h3>{ticket.guestName}</h3>
        </div>
        <span className="ticket-card__seal">Wedding Invitation</span>
      </div>

      <div className="ticket-card__body">
        <div className="ticket-card__details">
          <dl className="ticket-facts">
            <div>
              <dt>Ticket ID</dt>
              <dd>{ticket.ticketCode}</dd>
            </div>
          </dl>

          {ticket.notes ? (
            <div className="ticket-notes">
              <p className="eyebrow">Notes</p>
              <p>{ticket.notes}</p>
            </div>
          ) : null}

          <div className="ticket-program">
            <p className="eyebrow">Program Detail</p>
            <div className="program-lines">
              {nl2br(event.programDetails).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="ticket-card__qr">
          <p className="eyebrow">Entry Pass</p>
          <div className="ticket-card__qr-box">
            <Image alt={`QR code for ${ticket.guestName}`} height={180} src={qrDataUrl} width={180} />
          </div>
          <p className="muted">Present this QR code at the entrance checkpoints.</p>
        </div>
      </div>

      {showScanStatus ? (
        <div className="ticket-card__footer">
          <div className="status-pills">
            {[Checkpoint.OUTSIDE, Checkpoint.INSIDE].map((checkpoint) => {
              const used = scanSummary.some(
                (scan) => scan.checkpoint === checkpoint && scan.result === ScanResult.ALLOW,
              );

              return (
                <span className={`status-pill ${used ? "used" : ""}`} key={checkpoint}>
                  {checkpoint === Checkpoint.OUTSIDE ? "Outside" : "Inside"}:{" "}
                  {used ? "Used" : "Unused"}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </article>
  );
}
