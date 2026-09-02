"use server";

import type { ActionResponse } from "@/types/actions";
import { siteConfig } from "@/config/site";
import { connectDB } from "@/lib/db";
import { DEFAULT_WEEKLY_HOURS } from "@/lib/booking-slots";
import { updateAvailabilitySchema } from "@/lib/validations/admin";
import {
  logActivity,
  requireAdmin,
  validationError,
} from "@/actions/helpers";
import {
  AvailabilityRule,
  AVAILABILITY_SINGLETON_KEY,
} from "@/models";

function mapAvailabilityFields(data: Record<string, unknown>) {
  return {
    ...(data.timezone !== undefined ? { timezone: data.timezone } : {}),
    ...(data.slotDurationMinutes !== undefined
      ? { slotDurationMinutes: data.slotDurationMinutes }
      : {}),
    ...(data.leadTimeHours !== undefined
      ? { leadTimeHours: data.leadTimeHours }
      : {}),
    ...(data.bookingHorizonDays !== undefined
      ? { bookingHorizonDays: data.bookingHorizonDays }
      : {}),
    ...(data.weeklyHours !== undefined ? { weeklyHours: data.weeklyHours } : {}),
    ...(data.blackoutDates !== undefined
      ? { blackoutDates: data.blackoutDates }
      : {}),
  };
}

export async function getAvailability(): Promise<
  ActionResponse<Record<string, unknown>>
> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();

    let rule = await AvailabilityRule.findOne({
      singletonKey: AVAILABILITY_SINGLETON_KEY,
    }).lean();

    if (!rule) {
      const created = await AvailabilityRule.create({
        singletonKey: AVAILABILITY_SINGLETON_KEY,
        timezone: siteConfig.timezone,
        slotDurationMinutes: siteConfig.booking.slotDurationMinutes,
        leadTimeHours: siteConfig.booking.leadTimeHours,
        bookingHorizonDays: siteConfig.booking.bookingHorizonDays,
        weeklyHours: DEFAULT_WEEKLY_HOURS,
        blackoutDates: [],
      });
      rule = created.toObject();
    }

    return {
      success: true,
      data: { ...rule, id: String(rule._id) },
    };
  } catch (error) {
    console.error("getAvailability error:", error);
    return { success: false, error: "Unable to load availability settings." };
  }
}

export async function updateAvailability(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = updateAvailabilitySchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    await connectDB();

    const rule = await AvailabilityRule.findOneAndUpdate(
      { singletonKey: AVAILABILITY_SINGLETON_KEY },
      {
        $set: mapAvailabilityFields(parsed.data),
        $setOnInsert: { singletonKey: AVAILABILITY_SINGLETON_KEY },
      },
      { new: true, upsert: true, runValidators: true },
    );

    await logActivity({
      action: "update",
      entity: "availability",
      entityId: String(rule._id),
      details: {
        timezone: rule.timezone,
        slotDurationMinutes: rule.slotDurationMinutes,
      },
      adminEmail: admin.email,
    });

    return { success: true, data: { id: String(rule._id) } };
  } catch (error) {
    console.error("updateAvailability error:", error);
    return { success: false, error: "Unable to update availability settings." };
  }
}
