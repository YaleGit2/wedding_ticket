import Image from "next/image";
import { EventSettings, Ticket, Checkpoint, ScanResult } from "@prisma/client";
import { CakeSlice, Camera, Heart, Music, Utensils } from "lucide-react";

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

const AMHARIC_DATE = "እሁድ፣ ግንቦት 16፣ 2018";

const PROGRAM_LINES = [
  {
    amharicLabel: "የቃል ኪዳን ሥነ-ሥርዓት",
    amharicTime: "10:00 ከሰዓት - 10:30 ከሰዓት",
    englishLabel: "Vow Ceremony",
    englishTime: "4:00 - 4:30 PM",
  },
  {
    amharicLabel: "የፎቶ ፕሮግራም",
    amharicTime: "10:30 ከሰዓት - 11:30 ከሰዓት",
    englishLabel: "Photo Program",
    englishTime: "4:30 - 5:30 PM",
  },
  {
    amharicLabel: "እራት",
    amharicTime: "11:30 ከሰዓት - 12:30 ከሰዓት",
    englishLabel: "Dinner",
    englishTime: "5:30 - 6:30 PM",
  },
  {
    amharicLabel: "ንግግሮች እና ኬክ",
    amharicTime: "12:30 ከሰዓት - 1:30 ከሰዓት",
    englishLabel: "Toasts and Cake",
    englishTime: "6:30 - 7:30 PM",
  },
  {
    amharicLabel: "ፓርቲ እና ዳንስ",
    amharicTime: "1:30 ከሰዓት - 2:00 ከሰዓት",
    englishLabel: "Party and Dance",
    englishTime: "7:30 - 8:00 PM",
  },
];

const programIconFor = (label: string, index: number) => {
  const normalized = label.toLowerCase();

  if (normalized.includes("photo")) return Camera;
  if (normalized.includes("dinner")) return Utensils;
  if (normalized.includes("cake") || normalized.includes("toast")) return CakeSlice;
  if (normalized.includes("party") || normalized.includes("dance")) return Music;

  return index === 0 ? Heart : Music;
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
      <div className="ticket-card__corner ticket-card__corner--top" />
      <div className="ticket-card__corner ticket-card__corner--bottom" />

      <div className="ticket-card__hero">
        <div>
          <p className="ticket-card__kicker">{event.weddingTitle}</p>
          <h2>{event.coupleNames}</h2>
          <div className="ticket-card__meta">
            <span>{event.weddingDate}</span>
            <span className="ticket-card__meta-amharic">{AMHARIC_DATE}</span>
            <span>{event.venue}</span>
          </div>
        </div>
        <span className="ticket-card__ribbon" aria-hidden="true" />
      </div>

      <div className="ticket-card__intro">
        <div>
          <p className="eyebrow">Issued To</p>
          <h3>{ticket.guestName}</h3>
          <span className="ticket-card__divider" aria-hidden="true" />
          <dl className="ticket-facts ticket-facts--intro">
            <div>
              <dt>Ticket ID</dt>
              <dd>{ticket.ticketCode}</dd>
            </div>
          </dl>
        </div>
        <div className="ticket-card__qr ticket-card__qr--intro">
          <p className="eyebrow">Entry Pass</p>
          <div className="ticket-card__qr-box">
            <Image alt={`QR code for ${ticket.guestName}`} height={180} src={qrDataUrl} width={180} />
          </div>
          <p className="muted">Present this QR code at the entrance checkpoints.</p>
        </div>
      </div>

      <div className="ticket-card__body">
        <div className="ticket-card__details">
          {ticket.notes ? (
            <div className="ticket-notes">
              <p className="eyebrow">Notes</p>
              <p>{ticket.notes}</p>
            </div>
          ) : null}

          <div className="ticket-program">
            <p className="eyebrow">Program Detail</p>
            <div className="program-lines">
              {PROGRAM_LINES.map((program, index) => {
                const ProgramIcon = programIconFor(program.englishLabel, index);

                return (
                  <div className="program-line" key={program.englishLabel}>
                    <span className="program-line__icon" aria-hidden="true">
                      <ProgramIcon size={22} strokeWidth={1.8} />
                    </span>
                    <div className="program-line__text">
                      <p className="program-line__english">
                        {program.englishLabel} | {program.englishTime}
                      </p>
                      <p className="program-line__amharic">
                        {program.amharicLabel} | {program.amharicTime}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="ticket-card__closing">
        <p>Come for the love,</p>
        <strong>Stay for the celebration!</strong>
        <span className="ticket-card__divider" aria-hidden="true" />
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
