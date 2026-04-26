import { prisma } from "@/lib/prisma";

export async function getEventSettings() {
  const existing = await prisma.eventSettings.findUnique({
    where: { id: "event" },
  });

  if (existing) {
    return existing;
  }

  return prisma.eventSettings.create({
    data: {
      id: "event",
      weddingTitle: "Wedding Celebration",
      coupleNames: "Arianna & Theo",
      weddingDate: "Saturday, September 20, 2026",
      venue: "The Garden Pavilion",
      programDetails:
        "Ceremony 2:00 PM\nReception 4:00 PM\nDinner and toasts to follow",
    },
  });
}
