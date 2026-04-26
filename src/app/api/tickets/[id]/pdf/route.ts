import React from "react";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { TicketPdf } from "@/components/ticket-pdf";
import { createQrDataUrl } from "@/lib/qr";
import { getEventSettings } from "@/lib/settings";
import { getTicketForAdmin } from "@/lib/tickets";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireRole([Role.ADMIN]);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const ticket = await getTicketForAdmin(id);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  const event = await getEventSettings();
  const qrDataUrl = await createQrDataUrl(ticket.token);
  const pdf = await renderToBuffer(TicketPdf({ event, qrDataUrl, ticket }));
  const { searchParams } = new URL(request.url);
  const disposition = searchParams.get("download") === "1" ? "attachment" : "inline";

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${ticket.ticketCode}.pdf"`,
    },
  });
}
