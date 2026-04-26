import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { issueTicket, listTickets } from "@/lib/tickets";

const schema = z.object({
  guestName: z.string().min(1),
  numberOfGuests: z.number().int().positive().nullable().optional(),
  tableNumber: z.string().trim().max(50).nullable().optional(),
  notes: z.string().trim().max(500).nullable().optional(),
});

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

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a guest name and valid optional fields." }, { status: 400 });
  }

  const { ticket } = await issueTicket(parsed.data);

  return NextResponse.json({
    ticketId: ticket.id,
    ticketCode: ticket.ticketCode,
  });
}
