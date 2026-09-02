import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { ActionResponse } from "@/types/actions";

export function formatAdminDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return format(value, "d MMM yyyy, h:mm a");
}

export function formatAdminDateShort(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return format(value, "d MMM yyyy");
}

export function formatBookingDateTime(
  date: Date | string,
  timezone: string,
): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return formatInTimeZone(value, timezone, "EEE d MMM yyyy, h:mm a zzz");
}

export function formatRelativeTime(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(value, { addSuffix: true });
}

export function getActionError<T>(
  result: ActionResponse<T>,
  fallback = "Something went wrong.",
): string {
  if (result.success) {
    return "";
  }
  return result.error || fallback;
}

export const BOOKING_STATUS_OPTIONS = [
  "New",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
  "No Show",
] as const;

export const CONTACT_STATUS_OPTIONS = ["new", "read", "archived"] as const;

export const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
