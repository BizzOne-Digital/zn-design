"use server";

import type { ActionResponse } from "@/types/actions";
import { connectDB } from "@/lib/db";
import { updateInquirySchema } from "@/lib/validations/admin";
import {
  logActivity,
  requireAdmin,
  validationError,
} from "@/actions/helpers";
import { ContactSubmission } from "@/models";

export async function updateInquiry(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = updateInquirySchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id, status, internalNotes } = parsed.data;

  if (status === undefined && internalNotes === undefined) {
    return {
      success: false,
      error: "At least one field must be provided.",
    };
  }

  const updates: Record<string, unknown> = {};
  if (status !== undefined) {
    updates.status = status;
  }
  if (internalNotes !== undefined) {
    updates.internalNotes = internalNotes;
  }

  try {
    await connectDB();

    const inquiry = await ContactSubmission.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!inquiry) {
      return { success: false, error: "Inquiry not found." };
    }

    await logActivity({
      action: "update",
      entity: "inquiry",
      entityId: id,
      details: { fields: Object.keys(updates), email: inquiry.email },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updateInquiry error:", error);
    return { success: false, error: "Unable to update inquiry." };
  }
}

export async function listInquiries(): Promise<
  ActionResponse<Record<string, unknown>[]>
> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const inquiries = await ContactSubmission.find()
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: inquiries.map((inquiry) => ({
        ...inquiry,
        id: String(inquiry._id),
      })),
    };
  } catch (error) {
    console.error("listInquiries error:", error);
    return { success: false, error: "Unable to load inquiries." };
  }
}

export async function getInquiryById(
  id: string,
): Promise<ActionResponse<Record<string, unknown>>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const inquiry = await ContactSubmission.findById(id).lean();

    if (!inquiry) {
      return { success: false, error: "Inquiry not found." };
    }

    return {
      success: true,
      data: { ...inquiry, id: String(inquiry._id) },
    };
  } catch (error) {
    console.error("getInquiryById error:", error);
    return { success: false, error: "Unable to load inquiry." };
  }
}
