import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const readRequired = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

async function main() {
  const [adminPassword, outsidePassword, insidePassword] = [
    readRequired("ADMIN_PASSWORD"),
    readRequired("OUTSIDE_SCANNER_PASSWORD"),
    readRequired("INSIDE_SCANNER_PASSWORD"),
  ];

  const hashes = await Promise.all([
    bcrypt.hash(adminPassword, 12),
    bcrypt.hash(outsidePassword, 12),
    bcrypt.hash(insidePassword, 12),
  ]);

  await Promise.all([
    prisma.credential.upsert({
      where: { role: Role.ADMIN },
      update: { passwordHash: hashes[0] },
      create: { role: Role.ADMIN, passwordHash: hashes[0] },
    }),
    prisma.credential.upsert({
      where: { role: Role.OUTSIDE },
      update: { passwordHash: hashes[1] },
      create: { role: Role.OUTSIDE, passwordHash: hashes[1] },
    }),
    prisma.credential.upsert({
      where: { role: Role.INSIDE },
      update: { passwordHash: hashes[2] },
      create: { role: Role.INSIDE, passwordHash: hashes[2] },
    }),
  ]);

  await prisma.eventSettings.upsert({
    where: { id: "event" },
    update: {
      weddingTitle: process.env.WEDDING_TITLE ?? "Wedding Celebration",
      coupleNames: process.env.COUPLE_NAMES ?? "Arianna & Theo",
      weddingDate: process.env.WEDDING_DATE ?? "Saturday, September 20, 2026",
      venue: process.env.WEDDING_VENUE ?? "The Garden Pavilion",
      programDetails:
        process.env.PROGRAM_DETAILS ??
        "Ceremony 2:00 PM\nReception 4:00 PM\nDinner and toasts to follow",
    },
    create: {
      id: "event",
      weddingTitle: process.env.WEDDING_TITLE ?? "Wedding Celebration",
      coupleNames: process.env.COUPLE_NAMES ?? "Arianna & Theo",
      weddingDate: process.env.WEDDING_DATE ?? "Saturday, September 20, 2026",
      venue: process.env.WEDDING_VENUE ?? "The Garden Pavilion",
      programDetails:
        process.env.PROGRAM_DETAILS ??
        "Ceremony 2:00 PM\nReception 4:00 PM\nDinner and toasts to follow",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
