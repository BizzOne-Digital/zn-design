"use server";

import type { ActionResponse } from "@/types/actions";
import { connectDB } from "@/lib/db";
import {
  createPricingPackageSchema,
  deletePricingPackageSchema,
  updatePricingPackageSchema,
} from "@/lib/validations/admin";
import {
  logActivity,
  requireAdmin,
  validationError,
} from "@/actions/helpers";
import { PricingPackage } from "@/models";

function mapPricingFields(data: Record<string, unknown>) {
  return {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.subtitle !== undefined ? { subtitle: data.subtitle } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.deliverables !== undefined
      ? { deliverables: data.deliverables }
      : {}),
    ...(data.idealFor !== undefined ? { idealFor: data.idealFor } : {}),
    ...(data.priceLabel !== undefined ? { priceLabel: data.priceLabel } : {}),
    ...(data.featured !== undefined ? { featured: data.featured } : {}),
    ...(data.displayOrder !== undefined
      ? { displayOrder: data.displayOrder }
      : {}),
    ...(data.active !== undefined ? { active: data.active } : {}),
  };
}

export async function createPricingPackage(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = createPricingPackageSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    await connectDB();

    const pricingPackage = await PricingPackage.create(
      mapPricingFields(parsed.data),
    );

    await logActivity({
      action: "create",
      entity: "pricing",
      entityId: String(pricingPackage._id),
      details: { title: pricingPackage.title },
      adminEmail: admin.email,
    });

    return { success: true, data: { id: String(pricingPackage._id) } };
  } catch (error) {
    console.error("createPricingPackage error:", error);
    return { success: false, error: "Unable to create pricing package." };
  }
}

export async function updatePricingPackage(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = updatePricingPackageSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id, ...updates } = parsed.data;

  try {
    await connectDB();

    const pricingPackage = await PricingPackage.findByIdAndUpdate(
      id,
      mapPricingFields(updates),
      { new: true, runValidators: true },
    );

    if (!pricingPackage) {
      return { success: false, error: "Pricing package not found." };
    }

    await logActivity({
      action: "update",
      entity: "pricing",
      entityId: id,
      details: { fields: Object.keys(updates) },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updatePricingPackage error:", error);
    return { success: false, error: "Unable to update pricing package." };
  }
}

export async function deletePricingPackage(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = deletePricingPackageSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id } = parsed.data;

  try {
    await connectDB();

    const pricingPackage = await PricingPackage.findByIdAndDelete(id);

    if (!pricingPackage) {
      return { success: false, error: "Pricing package not found." };
    }

    await logActivity({
      action: "delete",
      entity: "pricing",
      entityId: id,
      details: { title: pricingPackage.title },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("deletePricingPackage error:", error);
    return { success: false, error: "Unable to delete pricing package." };
  }
}

export async function listPricingPackages(): Promise<
  ActionResponse<Record<string, unknown>[]>
> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const packages = await PricingPackage.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      data: packages.map((pkg) => ({
        ...pkg,
        id: String(pkg._id),
      })),
    };
  } catch (error) {
    console.error("listPricingPackages error:", error);
    return { success: false, error: "Unable to load pricing packages." };
  }
}
