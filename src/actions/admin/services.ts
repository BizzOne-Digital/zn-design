"use server";

import type { ActionResponse } from "@/types/actions";
import { connectDB } from "@/lib/db";
import { slugify } from "@/lib/utils";
import {
  createServiceSchema,
  deleteServiceSchema,
  updateServiceSchema,
} from "@/lib/validations/admin";
import {
  logActivity,
  requireAdmin,
  validationError,
} from "@/actions/helpers";
import { Service } from "@/models";

function mapServiceFields(data: Record<string, unknown>) {
  return {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.slug !== undefined ? { slug: data.slug } : {}),
    ...(data.shortDescription !== undefined
      ? { shortDescription: data.shortDescription }
      : {}),
    ...(data.fullDescription !== undefined
      ? { fullDescription: data.fullDescription }
      : {}),
    ...(data.deliverables !== undefined
      ? { deliverables: data.deliverables }
      : {}),
    ...(data.processNotes !== undefined
      ? { processNotes: data.processNotes }
      : {}),
    ...(data.featuredImage !== undefined
      ? { featuredImage: data.featuredImage }
      : {}),
    ...(data.gallery !== undefined ? { gallery: data.gallery } : {}),
    ...(data.displayOrder !== undefined
      ? { displayOrder: data.displayOrder }
      : {}),
    ...(data.active !== undefined ? { active: data.active } : {}),
    ...(data.featured !== undefined ? { featured: data.featured } : {}),
    ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
    ...(data.seoDescription !== undefined
      ? { seoDescription: data.seoDescription }
      : {}),
  };
}

export async function createService(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = createServiceSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);

  try {
    await connectDB();

    const existing = await Service.findOne({ slug }).select("_id").lean();
    if (existing) {
      return { success: false, error: "A service with this slug already exists." };
    }

    const service = await Service.create({
      ...mapServiceFields({ ...data, slug }),
    });

    await logActivity({
      action: "create",
      entity: "service",
      entityId: String(service._id),
      details: { title: service.title, slug: service.slug },
      adminEmail: admin.email,
    });

    return { success: true, data: { id: String(service._id) } };
  } catch (error) {
    console.error("createService error:", error);
    return { success: false, error: "Unable to create service." };
  }
}

export async function updateService(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = updateServiceSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id, ...updates } = parsed.data;

  try {
    await connectDB();

    if (updates.slug) {
      const duplicate = await Service.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      })
        .select("_id")
        .lean();

      if (duplicate) {
        return { success: false, error: "A service with this slug already exists." };
      }
    }

    const service = await Service.findByIdAndUpdate(
      id,
      mapServiceFields(updates),
      { new: true, runValidators: true },
    );

    if (!service) {
      return { success: false, error: "Service not found." };
    }

    await logActivity({
      action: "update",
      entity: "service",
      entityId: id,
      details: { fields: Object.keys(updates) },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updateService error:", error);
    return { success: false, error: "Unable to update service." };
  }
}

export async function deleteService(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = deleteServiceSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id } = parsed.data;

  try {
    await connectDB();

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return { success: false, error: "Service not found." };
    }

    await logActivity({
      action: "delete",
      entity: "service",
      entityId: id,
      details: { title: service.title, slug: service.slug },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("deleteService error:", error);
    return { success: false, error: "Unable to delete service." };
  }
}

export async function getServiceById(
  id: string,
): Promise<ActionResponse<Record<string, unknown>>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const service = await Service.findById(id).lean();

    if (!service) {
      return { success: false, error: "Service not found." };
    }

    return {
      success: true,
      data: { ...service, id: String(service._id) },
    };
  } catch (error) {
    console.error("getServiceById error:", error);
    return { success: false, error: "Unable to load service." };
  }
}

export async function listServices(): Promise<
  ActionResponse<Record<string, unknown>[]>
> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const services = await Service.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      data: services.map((service) => ({
        ...service,
        id: String(service._id),
      })),
    };
  } catch (error) {
    console.error("listServices error:", error);
    return { success: false, error: "Unable to load services." };
  }
}
