import { NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { authenticate, createSession } from "@/lib/auth";

const schema = z.object({
  role: z.nativeEnum(Role),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login payload." }, { status: 400 });
  }

  const valid = await authenticate(parsed.data.role, parsed.data.password);

  if (!valid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  await createSession(parsed.data.role);

  return NextResponse.json({ ok: true });
}
