"use server";

import type { ActionResponse } from "@/types/actions";
import { connectDB } from "@/lib/db";
import { generateBookingReference } from "@/lib/utils";
import {
  sendBookingConfirmation,
  sendBookingNotification,
} from "@/lib/mail";
import { bookingSubmissionSchema } from "@/lib/validations/booking";
import { isSlotAvailable, validationError } from "@/actions/helpers";
import { Booking } from "@/models";

const ACTIVE_BOOKING_STATUSES = ["New", "Confirmed", "In Progress"] as const;

export async function createBooking(
  input: unknown,
): Promise<ActionResponse<{ reference: string }>> {
  const parsed = bookingSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const data = parsed.data;

  try {
    await connectDB();

    const slotAvailable = await isSlotAvailable(data.scheduledAt);

    if (!slotAvailable) {
      return {
        success: false,
        error: "The selected time slot is no longer available. Please choose another.",
      };
    }

    const duplicateBooking = await Booking.findOne({
      email: data.email,
      scheduledAt: data.scheduledAt,
      status: { $in: ACTIVE_BOOKING_STATUSES },
    }).lean();

    if (duplicateBooking) {
      return {
        success: false,
        error: "A booking already exists for this email at the selected time.",
      };
    }

    let reference = generateBookingReference();
    let attempts = 0;

    while (attempts < 5) {
      const existing = await Booking.findOne({ reference }).select("_id").lean();
      if (!existing) {
        break;
      }
      reference = generateBookingReference();
      attempts += 1;
    }

    const booking = await Booking.create({
      reference,
      clientName: data.clientName,
      email: data.email,
      phone: data.phone,
      businessName: data.businessName,
      website: data.website,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      projectType: data.projectType,
      budgetRange: data.budgetRange,
      timeline: data.timeline,
      description: data.description,
      referralSource: data.referralSource,
      scheduledAt: data.scheduledAt,
      timezone: data.timezone,
      status: "New",
      emailSent: false,
    });

    let emailSent = false;
    let emailError: string | undefined;

    try {
      await Promise.all([
        sendBookingConfirmation(booking),
        sendBookingNotification(booking),
      ]);
      emailSent = true;
    } catch (error) {
      emailError =
        error instanceof Error ? error.message : "Failed to send booking emails";
    }

    if (emailSent || emailError) {
      await Booking.findByIdAndUpdate(booking._id, {
        emailSent,
        ...(emailError ? { emailError } : {}),
      });
    }

    return {
      success: true,
      data: { reference: booking.reference },
    };
  } catch (error) {
    console.error("createBooking error:", error);
    return {
      success: false,
      error: "Unable to create booking. Please try again.",
    };
  }
}
