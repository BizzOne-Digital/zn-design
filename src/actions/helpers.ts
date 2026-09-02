import type { ZodError } from "zod";
import type { ActionResponse } from "@/types/actions";
import { auth } from "@/lib/auth";
import { getAvailabilitySettings } from "@/lib/api-helpers";
import { generateAvailableSlots } from "@/lib/booking-slots";
import { connectDB } from "@/lib/db";
import { ActivityLog, Booking } from "@/models";

const ACTIVE_BOOKING_STATUSES = ["New", "Confirmed", "In Progress"] as const;

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

export function validationError(error: ZodError): ActionResponse<never> {
  return {
    success: false,
    error: "Validation failed",
    fieldErrors: formatZodErrors(error),
  };
}

export async function requireAdmin(): Promise<
  | { success: true; email: string }
  | { success: false; response: ActionResponse<never> }
> {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      success: false,
      response: { success: false, error: "Unauthorized" },
    };
  }

  return { success: true, email: session.user.email };
}

export async function logActivity(input: {
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  adminEmail: string;
}): Promise<void> {
  await connectDB();

  await ActivityLog.create({
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    details: input.details ?? {},
    adminEmail: input.adminEmail,
  });
}

export async function isSlotAvailable(
  scheduledAt: Date,
  excludeBookingId?: string,
): Promise<boolean> {
  const rule = await getAvailabilitySettings();

  await connectDB();

  const query: Record<string, unknown> = {
    status: { $in: ACTIVE_BOOKING_STATUSES },
    scheduledAt: { $gte: new Date() },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const bookings = await Booking.find(query).select("scheduledAt").lean();
  const existingBookings = bookings.map((booking) => ({
    scheduledAt: booking.scheduledAt,
  }));

  const slots = generateAvailableSlots({
    rule,
    existingBookings,
  });

  const targetTime = scheduledAt.getTime();
  return slots.some((slot) => slot.start.getTime() === targetTime);
}
