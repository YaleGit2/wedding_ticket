import QRCode from "qrcode";
import { env } from "@/lib/env";

export async function createQrDataUrl(token: string) {
  return QRCode.toDataURL(`${env.appUrl}/scanner?ticket=${token}`, {
    margin: 1,
    width: 280,
    color: {
      dark: "#251d1b",
      light: "#fffaf6",
    },
  });
}

export function extractTokenFromScan(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    return url.searchParams.get("ticket") ?? trimmed;
  } catch {
    return trimmed;
  }
}
