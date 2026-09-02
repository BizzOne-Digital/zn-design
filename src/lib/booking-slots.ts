import {
  addDays,
  addMinutes,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import { connectDB } from "@/lib/db";
import { siteConfig } from "@/config/site";
import type { BookingSlot, IAvailabilityRule, TimeRange } from "@/types";
import {
  AvailabilityRule,
  AVAILABILITY_SINGLETON_KEY,
  Booking,
} from "@/models";

export interface GenerateSlotsOptions {
  rule: Pick<
    IAvailabilityRule,
    | "timezone"
    | "slotDurationMinutes"
    | "leadTimeHours"
    | "bookingHorizonDays"
    | "weeklyHours"
    | "blackoutDates"
  >;
  existingBookings: Array<{ scheduledAt: Date; durationMinutes?: number }>;
  fromDate?: Date;
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isBlackoutDate(date: Date, blackoutDates: Date[], timezone: string): boolean {
  const localDate = toZonedTime(date, timezone);
  const localKey = format(localDate, "yyyy-MM-dd");

  return blackoutDates.some((blackout) => {
    const blackoutLocal = toZonedTime(blackout, timezone);
    return format(blackoutLocal, "yyyy-MM-dd") === localKey;
  });
}

function getWeeklyRangesForDay(
  rule: GenerateSlotsOptions["rule"],
  day: Date,
): TimeRange[] {
  const localDay = toZonedTime(day, rule.timezone);
  const dayOfWeek = localDay.getDay();
  const entry = rule.weeklyHours.find((item) => item.dayOfWeek === dayOfWeek);
  return entry?.ranges ?? [];
}

function buildSlotStart(
  localDate: Date,
  minutesFromMidnight: number,
  timezone: string,
): Date {
  const dateKey = format(localDate, "yyyy-MM-dd");
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const localIso = `${dateKey}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  return fromZonedTime(localIso, timezone);
}

function rangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return isBefore(startA, endB) && isAfter(endA, startB);
}

export function checkSlotOverlap(
  candidateStart: Date,
  durationMinutes: number,
  existingBookings: Array<{ scheduledAt: Date; durationMinutes?: number }>,
): boolean {
  const candidateEnd = addMinutes(candidateStart, durationMinutes);

  return existingBookings.some((booking) => {
    const bookingDuration = booking.durationMinutes ?? durationMinutes;
    const bookingEnd = addMinutes(booking.scheduledAt, bookingDuration);
    return rangesOverlap(
      candidateStart,
      candidateEnd,
      booking.scheduledAt,
      bookingEnd,
    );
  });
}

export function generateAvailableSlots(
  options: GenerateSlotsOptions,
): BookingSlot[] {
  const { rule, existingBookings } = options;
  const now = options.fromDate ?? new Date();
  const earliestBookable = addMinutes(now, rule.leadTimeHours * 60);
  const horizonEnd = addDays(now, rule.bookingHorizonDays);

  const slots: BookingSlot[] = [];
  let cursor = startOfDay(toZonedTime(now, rule.timezone));

  while (isBefore(cursor, horizonEnd) || isSameDay(cursor, horizonEnd)) {
    if (isBlackoutDate(cursor, rule.blackoutDates, rule.timezone)) {
      cursor = addDays(cursor, 1);
      continue;
    }

    const ranges = getWeeklyRangesForDay(rule, cursor);

    for (const range of ranges) {
      const rangeStart = parseTimeToMinutes(range.start);
      const rangeEnd = parseTimeToMinutes(range.end);

      for (
        let minute = rangeStart;
        minute + rule.slotDurationMinutes <= rangeEnd;
        minute += rule.slotDurationMinutes
      ) {
        const slotStart = buildSlotStart(cursor, minute, rule.timezone);
        const slotEnd = addMinutes(slotStart, rule.slotDurationMinutes);

        if (isBefore(slotStart, earliestBookable)) {
          continue;
        }

        if (isAfter(slotStart, horizonEnd)) {
          continue;
        }

        if (
          checkSlotOverlap(slotStart, rule.slotDurationMinutes, existingBookings)
        ) {
          continue;
        }

        slots.push({
          start: slotStart,
          end: slotEnd,
          startLocal: formatInTimeZone(
            slotStart,
            rule.timezone,
            "yyyy-MM-dd'T'HH:mm:ssXXX",
          ),
          endLocal: formatInTimeZone(
            slotEnd,
            rule.timezone,
            "yyyy-MM-dd'T'HH:mm:ssXXX",
          ),
        });
      }
    }

    cursor = addDays(cursor, 1);
  }

  return slots;
}

export function toUtcFromLocal(
  localDateTime: string,
  timezone: string,
): Date {
  return fromZonedTime(localDateTime, timezone);
}

export function toLocalFromUtc(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone);
}

export function formatSlotForDisplay(
  date: Date,
  timezone: string,
  pattern = "EEEE, d MMMM yyyy 'at' h:mm a",
): string {
  return formatInTimeZone(date, timezone, pattern);
}

export const DEFAULT_WEEKLY_HOURS: IAvailabilityRule["weeklyHours"] = [
  { dayOfWeek: 1, ranges: [{ start: "09:00", end: "17:00" }] },
  { dayOfWeek: 2, ranges: [{ start: "09:00", end: "17:00" }] },
  { dayOfWeek: 3, ranges: [{ start: "09:00", end: "17:00" }] },
  { dayOfWeek: 4, ranges: [{ start: "09:00", end: "17:00" }] },
  { dayOfWeek: 5, ranges: [{ start: "09:00", end: "17:00" }] },
];

const ACTIVE_BOOKING_STATUSES = ["New", "Confirmed", "In Progress"] as const;

async function loadAvailabilityRule(): Promise<GenerateSlotsOptions["rule"]> {
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

export async function isSlotAvailable(scheduledAt: Date): Promise<boolean> {
  const rule = await loadAvailabilityRule();

  const existingBookings = await Booking.find({
    status: { $in: ACTIVE_BOOKING_STATUSES },
    scheduledAt: { $gte: new Date() },
  })
    .select("scheduledAt")
    .lean();

  const slots = generateAvailableSlots({
    rule,
    existingBookings: existingBookings.map((booking) => ({
      scheduledAt: booking.scheduledAt,
    })),
  });

  return slots.some((slot) => slot.start.getTime() === scheduledAt.getTime());
}
