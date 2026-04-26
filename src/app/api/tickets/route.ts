import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { issueTicket, listTickets } from "@/lib/tickets";

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.string().trim().max(max).nullable().optional(),
  );

const schema = z.object({
  guestName: z.string().trim().min(1),
  numberOfGuests: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      return typeof value === "string" ? Number(value) : value;
    },
    z.number().int().positive().nullable().optional(),
  ),
  tableNumber: optionalText(50),
  notes: optionalText(500),
});

async function parseTicketRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return {
      body: await request.json().catch(() => null),
      wantsRedirect: false,
    };
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData().catch(() => null);

    return {
      body: formData ? Object.fromEntries(formData) : null,
      wantsRedirect: true,
    };
  }

  return {
    body: null,
    wantsRedirect: false,
  };
}

export async function GET() {
  const session = await requireRole([Role.ADMIN]);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const tickets = await listTickets();
  return NextResponse.json({ tickets });
}

export async function POST(request: Request) {
  const session = await requireRole([Role.ADMIN]);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { body, wantsRedirect } = await parseTicketRequest(request);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    if (wantsRedirect) {
      return NextResponse.redirect(new URL("/admin/tickets/new", request.url), 303);
    }

    return NextResponse.json({ error: "Please provide a guest name and valid optional fields." }, { status: 400 });
  }

  const { ticket } = await issueTicket(parsed.data);

  if (wantsRedirect) {
    return NextResponse.redirect(new URL(`/admin/tickets/${ticket.id}`, request.url), 303);
  }

  return NextResponse.json({
    ticketId: ticket.id,
    ticketCode: ticket.ticketCode,
  });
}
