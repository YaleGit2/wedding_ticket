import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { Role } from "@prisma/client";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const cookieName = "wedding_session";
const secret = new TextEncoder().encode(env.sessionSecret);
const sessionDuration = 60 * 60 * 12;

type SessionPayload = {
  role: Role;
};

const rolePasswords: Record<Role, string> = {
  [Role.ADMIN]: env.adminPassword,
  [Role.OUTSIDE]: env.outsideScannerPassword,
  [Role.INSIDE]: env.insideScannerPassword,
};

async function syncCredentialHash(role: Role, expectedPassword: string) {
  const credential = await prisma.credential.findUnique({
    where: { role },
  });

  if (credential && (await bcrypt.compare(expectedPassword, credential.passwordHash))) {
    return;
  }

  const passwordHash = await bcrypt.hash(expectedPassword, 12);

  await prisma.credential.upsert({
    where: { role },
    update: { passwordHash },
    create: { role, passwordHash },
  });
}

export async function createSession(role: Role) {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionDuration}s`)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionDuration,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      payload.role === Role.ADMIN ||
      payload.role === Role.OUTSIDE ||
      payload.role === Role.INSIDE
    ) {
      return { role: payload.role };
    }
  } catch {
    return null;
  }

  return null;
}

export async function requireRole(roles: Role[]) {
  const session = await getSession();

  if (!session || !roles.includes(session.role)) {
    return null;
  }

  return session;
}

export async function authenticate(role: Role, password: string) {
  const expectedPassword = rolePasswords[role];

  if (password !== expectedPassword) {
    return false;
  }

  await syncCredentialHash(role, expectedPassword);
  return true;
}

export const roleLabels: Record<Role, string> = {
  [Role.ADMIN]: "Admin",
  [Role.OUTSIDE]: "Outside Entrance",
  [Role.INSIDE]: "Inside Door",
};
