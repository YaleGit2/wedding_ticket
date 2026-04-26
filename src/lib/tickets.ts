import crypto from "node:crypto";
import { Checkpoint, Role, ScanResult } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CreateTicketInput = {
  guestName: string;
  numberOfGuests?: number | null;
  tableNumber?: string | null;
  notes?: string | null;
};

export const checkpointRoleMap: Record<Checkpoint, Role> = {
  [Checkpoint.OUTSIDE]: Role.OUTSIDE,
  [Checkpoint.INSIDE]: Role.INSIDE,
};

export function createRawToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createTicketCode() {
  return `WED-${crypto.randomUUID().split("-")[0]?.toUpperCase()}`;
}

export async function issueTicket(input: CreateTicketInput) {
  const rawToken = createRawToken();
  const tokenHash = hashToken(rawToken);

  const ticket = await prisma.ticket.create({
    data: {
      ticketCode: createTicketCode(),
      token: rawToken,
      tokenHash,
      guestName: input.guestName.trim(),
      numberOfGuests: input.numberOfGuests ?? null,
      tableNumber: input.tableNumber?.trim() || null,
      notes: input.notes?.trim() || null,
    },
  });

  return { ticket, rawToken };
}

export async function getTicketByToken(token: string) {
  return prisma.ticket.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
    include: {
      scans: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function listTickets() {
  return prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      scans: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getTicketForAdmin(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      scans: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function deleteTicket(id: string) {
  return prisma.ticket.delete({
    where: { id },
  });
}

export async function markTicketAtCheckpoint(token: string, checkpoint: Checkpoint) {
  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { tokenHash: hashToken(token) },
      include: {
        scans: {
          where: {
            checkpoint,
            result: ScanResult.ALLOW,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!ticket) {
      return {
        ok: false,
        decision: ScanResult.DENY,
        message: "Ticket not found.",
      } as const;
    }

    if (ticket.scans[0]) {
      await tx.scanEvent.create({
        data: {
          ticketId: ticket.id,
          checkpoint,
          result: ScanResult.DENY,
          scannerRole: checkpointRoleMap[checkpoint],
          message: "Duplicate scan at this checkpoint.",
        },
      });

      return {
        ok: false,
        decision: ScanResult.DENY,
        message: "Ticket already used at this checkpoint.",
        ticket,
        alreadyUsed: true,
      } as const;
    }

    await tx.scanEvent.create({
      data: {
        ticketId: ticket.id,
        checkpoint,
        result: ScanResult.ALLOW,
        scannerRole: checkpointRoleMap[checkpoint],
        message: "Validated successfully.",
      },
    });

    return {
      ok: true,
      decision: ScanResult.ALLOW,
      message: "Ticket validated successfully.",
      ticket,
      alreadyUsed: false,
    } as const;
  });
}

export function getCheckpointStatus(
  scans: Array<{ checkpoint: Checkpoint; result: ScanResult; createdAt: Date }>,
  checkpoint: Checkpoint,
) {
  const latest = scans.find((scan) => scan.checkpoint === checkpoint && scan.result === ScanResult.ALLOW);

  return latest ?? null;
}
