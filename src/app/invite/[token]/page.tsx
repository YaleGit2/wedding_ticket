import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TicketPreviewCard } from "@/components/ticket-preview-card";
import { createQrDataUrl } from "@/lib/qr";
import { getEventSettings } from "@/lib/settings";
import { getTicketByToken } from "@/lib/tickets";

export const metadata: Metadata = {
  title: "Wedding Invitation",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const ticket = await getTicketByToken(token);

  if (!ticket) {
    notFound();
  }

  const event = await getEventSettings();
  const qrDataUrl = await createQrDataUrl(token);

  return (
    <main className="print-page print-page--html">
      <section className="html-print-panel invite-view">
        <div className="html-print-stage">
          <TicketPreviewCard
            event={event}
            qrDataUrl={qrDataUrl}
            showScanStatus={false}
            ticket={ticket}
          />
        </div>
      </section>
    </main>
  );
}
