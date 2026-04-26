import { format } from "date-fns";

export function formatDateTime(value: Date) {
  return format(value, "PPP p");
}

export function nl2br(value: string) {
  return value.split("\n");
}
