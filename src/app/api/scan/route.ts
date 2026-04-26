import { NextResponse } from "next/server";
import { Checkpoint, Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { extractTokenFromScan } from "@/lib/qr";
import { markTicketAtCheckpoint } from "@/lib/tickets";

const schema = z.object({
  value: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await requireRole([Role.OUTSIDE, Role.INSIDE]);

  if (!session || session.role === Role.ADMIN) {
    return NextResponse.json({ decision: "DENY", message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ decision: "DENY", message: "Invalid scan payload." }, { status: 400 });
  }

  const token = extractTokenFromScan(parsed.data.value);

  if (!token) {
    return NextResponse.json({ decision: "DENY", message: "QR code did not contain a valid ticket token." }, { status: 400 });
  }

  const checkpoint =
    session.role === Role.OUTSIDE ? Checkpoint.OUTSIDE : Checkpoint.INSIDE;
  const result = await markTicketAtCheckpoint(token, checkpoint);

  if (!result.ok) {
    return NextResponse.json({
      decision: result.decision,
      guestName: result.ticket?.guestName,
      ticketCode: result.ticket?.ticketCode,
      checkpoint,
      alreadyUsed: result.alreadyUsed ?? false,
      message: result.message,
    });
  }

  return NextResponse.json({
    decision: result.decision,
    guestName: result.ticket.guestName,
    ticketCode: result.ticket.ticketCode,
    checkpoint,
    alreadyUsed: false,
    message: result.message,
  });
}
