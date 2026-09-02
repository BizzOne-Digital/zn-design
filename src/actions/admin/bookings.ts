"use server";

import type { ActionResponse } from "@/types/actions";
import { connectDB } from "@/lib/db";
import { isSlotAvailable } from "@/actions/helpers";
import {
  deleteBookingSchema,
  rescheduleBookingSchema,
  updateBookingNotesSchema,
  updateBookingStatusSchema,
} from "@/lib/validations/admin";
import {
  logActivity,
  requireAdmin,
  validationError,
} from "@/actions/helpers";
import { Booking } from "@/models";

export async function updateBookingStatus(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = updateBookingStatusSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id, status } = parsed.data;

  try {
    await connectDB();

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    await logActivity({
      action: "update_status",
      entity: "booking",
      entityId: id,
      details: { status, reference: booking.reference },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updateBookingStatus error:", error);
    return { success: false, error: "Unable to update booking status." };
  }
}

export async function rescheduleBooking(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = rescheduleBookingSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id, scheduledAt, timezone } = parsed.data;

  try {
    await connectDB();

    const existing = await Booking.findById(id);
    if (!existing) {
      return { success: false, error: "Booking not found." };
    }

    const slotAvailable = await isSlotAvailable(scheduledAt, id);

    if (!slotAvailable) {
      return {
        success: false,
        error: "The selected time slot is not available.",
      };
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { scheduledAt, timezone },
      { new: true, runValidators: true },
    );

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    await logActivity({
      action: "reschedule",
      entity: "booking",
      entityId: id,
      details: {
        reference: booking.reference,
        scheduledAt: booking.scheduledAt,
        timezone: booking.timezone,
      },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("rescheduleBooking error:", error);
    return { success: false, error: "Unable to reschedule booking." };
  }
}

export async function updateBookingNotes(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = updateBookingNotesSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id, internalNotes } = parsed.data;

  try {
    await connectDB();

    const booking = await Booking.findByIdAndUpdate(
      id,
      { internalNotes },
      { new: true, runValidators: true },
    );

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    await logActivity({
      action: "update_notes",
      entity: "booking",
      entityId: id,
      details: { reference: booking.reference },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updateBookingNotes error:", error);
    return { success: false, error: "Unable to update booking notes." };
  }
}

export async function deleteBooking(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = deleteBookingSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id } = parsed.data;

  try {
    await connectDB();

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    await logActivity({
      action: "delete",
      entity: "booking",
      entityId: id,
      details: { reference: booking.reference },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("deleteBooking error:", error);
    return { success: false, error: "Unable to delete booking." };
  }
}

export async function listBookings(): Promise<
  ActionResponse<Record<string, unknown>[]>
> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const bookings = await Booking.find()
      .sort({ scheduledAt: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      data: bookings.map((booking) => ({
        ...booking,
        id: String(booking._id),
      })),
    };
  } catch (error) {
    console.error("listBookings error:", error);
    return { success: false, error: "Unable to load bookings." };
  }
}

export async function getBookingById(
  id: string,
): Promise<ActionResponse<Record<string, unknown>>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const booking = await Booking.findById(id).lean();

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    return {
      success: true,
      data: { ...booking, id: String(booking._id) },
    };
  } catch (error) {
    console.error("getBookingById error:", error);
    return { success: false, error: "Unable to load booking." };
  }
}
