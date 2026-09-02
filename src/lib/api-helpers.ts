import { isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  DEFAULT_WEEKLY_HOURS,
  generateAvailableSlots,
} from "@/lib/booking-slots";
import { siteConfig } from "@/config/site";
import type { BookingSlot, IAvailabilityRule } from "@/types";
import {
  AvailabilityRule,
  AVAILABILITY_SINGLETON_KEY,
  Booking,
} from "@/models";

const ACTIVE_BOOKING_STATUSES = ["New", "Confirmed", "In Progress"] as const;

export type AvailabilitySettings = Pick<
  IAvailabilityRule,
  | "timezone"
  | "slotDurationMinutes"
  | "leadTimeHours"
  | "bookingHorizonDays"
  | "weeklyHours"
  | "blackoutDates"
>;

export function jsonError(
  message: string,
  status: number,
  options?: {
    fieldErrors?: Record<string, string[]>;
    headers?: HeadersInit;
  },
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(options?.fieldErrors ? { fieldErrors: options.fieldErrors } : {}),
    },
    { status, headers: options?.headers },
  );
}

export function jsonSuccess<T>(
  data: T,
  init?: ResponseInit,
): NextResponse {
  return NextResponse.json({ success: true, data }, init);
}

export function formatZodErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".") || "form";
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  }

  return fieldErrors;
}

export async function requireAdminSession(): Promise<
  | { ok: true; email: string }
  | { ok: false; response: NextResponse }
> {
  const session = await auth();

  if (!session?.user?.email) {
    return { ok: false, response: jsonError("Unauthorized", 401) };
  }

  return { ok: true, email: session.user.email };
}

export async function getAvailabilitySettings(): Promise<AvailabilitySettings> {
  await connectDB();

  const rule = await AvailabilityRule.findOne({
    singletonKey: AVAILABILITY_SINGLETON_KEY,
  }).lean();

  if (rule) {
    return {
      timezone: rule.timezone,
      slotDurationMinutes: rule.slotDurationMinutes,
      leadTimeHours: rule.leadTimeHours,
      bookingHorizonDays: rule.bookingHorizonDays,
      weeklyHours: rule.weeklyHours,
      blackoutDates: rule.blackoutDates,
    };
  }

  return {
    timezone: siteConfig.timezone,
    slotDurationMinutes: siteConfig.booking.slotDurationMinutes,
    leadTimeHours: siteConfig.booking.leadTimeHours,
    bookingHorizonDays: siteConfig.booking.bookingHorizonDays,
    weeklyHours: DEFAULT_WEEKLY_HOURS,
    blackoutDates: [],
  };
}

export async function getExistingBookings(): Promise<
  Array<{ scheduledAt: Date; durationMinutes?: number }>
> {
  await connectDB();

  const bookings = await Booking.find({
    status: { $in: ACTIVE_BOOKING_STATUSES },
    scheduledAt: { $gte: new Date() },
  })
    .select("scheduledAt")
    .lean();

  return bookings.map((booking) => ({
    scheduledAt: booking.scheduledAt,
  }));
}

export async function getAvailableSlots(): Promise<BookingSlot[]> {
  const [rule, existingBookings] = await Promise.all([
    getAvailabilitySettings(),
    getExistingBookings(),
  ]);

  return generateAvailableSlots({
    rule,
    existingBookings,
  });
}

export function serializeSlots(slots: BookingSlot[]) {
  return slots.map((slot) => ({
    start: slot.start.toISOString(),
    end: slot.end.toISOString(),
    startLocal: slot.startLocal,
    endLocal: slot.endLocal,
  }));
}

export function filterSlotsByDate(
  slots: BookingSlot[],
  date: Date,
  timezone: string,
): BookingSlot[] {
  const target = toZonedTime(date, timezone);

  return slots.filter((slot) =>
    isSameDay(toZonedTime(slot.start, timezone), target),
  );
}

export function filterSlotsByRange(
  slots: BookingSlot[],
  startDate: Date,
  endDate: Date,
): BookingSlot[] {
  const rangeStart = startDate.getTime();
  const rangeEnd = endDate.getTime();

  return slots.filter((slot) => {
    const slotTime = slot.start.getTime();
    return slotTime >= rangeStart && slotTime <= rangeEnd;
  });
}

export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue =
    value instanceof Date ? value.toISOString() : String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];

  return `${lines.join("\r\n")}\r\n`;
}
