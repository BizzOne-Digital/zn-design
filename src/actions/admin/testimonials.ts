"use server";

import type { ActionResponse } from "@/types/actions";
import { connectDB } from "@/lib/db";
import {
  createTestimonialSchema,
  deleteTestimonialSchema,
  updateTestimonialSchema,
} from "@/lib/validations/admin";
import {
  logActivity,
  requireAdmin,
  validationError,
} from "@/actions/helpers";
import { Testimonial } from "@/models";

function mapTestimonialFields(data: Record<string, unknown>) {
  return {
    ...(data.clientName !== undefined ? { clientName: data.clientName } : {}),
    ...(data.businessRole !== undefined
      ? { businessRole: data.businessRole }
      : {}),
    ...(data.quote !== undefined ? { quote: data.quote } : {}),
    ...(data.clientImage !== undefined
      ? { clientImage: data.clientImage }
      : {}),
    ...(data.relatedProject !== undefined
      ? { relatedProject: data.relatedProject }
      : {}),
    ...(data.showRating !== undefined ? { showRating: data.showRating } : {}),
    ...(data.rating !== undefined ? { rating: data.rating } : {}),
    ...(data.featured !== undefined ? { featured: data.featured } : {}),
    ...(data.displayOrder !== undefined
      ? { displayOrder: data.displayOrder }
      : {}),
    ...(data.published !== undefined ? { published: data.published } : {}),
    ...(data.isSample !== undefined ? { isSample: data.isSample } : {}),
  };
}

export async function createTestimonial(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = createTestimonialSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    await connectDB();

    const testimonial = await Testimonial.create(
      mapTestimonialFields(parsed.data),
    );

    await logActivity({
      action: "create",
      entity: "testimonial",
      entityId: String(testimonial._id),
      details: { clientName: testimonial.clientName },
      adminEmail: admin.email,
    });

    return { success: true, data: { id: String(testimonial._id) } };
  } catch (error) {
    console.error("createTestimonial error:", error);
    return { success: false, error: "Unable to create testimonial." };
  }
}

export async function updateTestimonial(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = updateTestimonialSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id, ...updates } = parsed.data;

  try {
    await connectDB();

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      mapTestimonialFields(updates),
      { new: true, runValidators: true },
    );

    if (!testimonial) {
      return { success: false, error: "Testimonial not found." };
    }

    await logActivity({
      action: "update",
      entity: "testimonial",
      entityId: id,
      details: { fields: Object.keys(updates) },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updateTestimonial error:", error);
    return { success: false, error: "Unable to update testimonial." };
  }
}

export async function deleteTestimonial(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = deleteTestimonialSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id } = parsed.data;

  try {
    await connectDB();

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return { success: false, error: "Testimonial not found." };
    }

    await logActivity({
      action: "delete",
      entity: "testimonial",
      entityId: id,
      details: { clientName: testimonial.clientName },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("deleteTestimonial error:", error);
    return { success: false, error: "Unable to delete testimonial." };
  }
}

export async function listTestimonials(): Promise<
  ActionResponse<Record<string, unknown>[]>
> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const testimonials = await Testimonial.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      data: testimonials.map((testimonial) => ({
        ...testimonial,
        id: String(testimonial._id),
      })),
    };
  } catch (error) {
    console.error("listTestimonials error:", error);
    return { success: false, error: "Unable to load testimonials." };
  }
}
