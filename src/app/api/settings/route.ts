import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  weddingTitle: z.string().min(1),
  coupleNames: z.string().min(1),
  weddingDate: z.string().min(1),
  venue: z.string().min(1),
  programDetails: z.string().min(1),
});

export async function PATCH(request: Request) {
  const session = await requireRole([Role.ADMIN]);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event settings payload." }, { status: 400 });
  }

  const event = await prisma.eventSettings.upsert({
    where: { id: "event" },
    update: parsed.data,
    create: { id: "event", ...parsed.data },
  });

  return NextResponse.json({ event });
}
