"use server";

import type { ActionResponse } from "@/types/actions";
import { connectDB } from "@/lib/db";
import { slugify } from "@/lib/utils";
import {
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/admin";
import {
  logActivity,
  requireAdmin,
  validationError,
} from "@/actions/helpers";
import { PortfolioProject } from "@/models";

function mapProjectFields(data: Record<string, unknown>) {
  return {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.slug !== undefined ? { slug: data.slug } : {}),
    ...(data.category !== undefined ? { category: data.category } : {}),
    ...(data.shortDescription !== undefined
      ? { shortDescription: data.shortDescription }
      : {}),
    ...(data.client !== undefined ? { client: data.client } : {}),
    ...(data.year !== undefined ? { year: data.year } : {}),
    ...(data.services !== undefined ? { services: data.services } : {}),
    ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),
    ...(data.gallery !== undefined ? { gallery: data.gallery } : {}),
    ...(data.contentBlocks !== undefined
      ? { contentBlocks: data.contentBlocks }
      : {}),
    ...(data.challenge !== undefined ? { challenge: data.challenge } : {}),
    ...(data.strategy !== undefined ? { strategy: data.strategy } : {}),
    ...(data.creativeDirection !== undefined
      ? { creativeDirection: data.creativeDirection }
      : {}),
    ...(data.solution !== undefined ? { solution: data.solution } : {}),
    ...(data.result !== undefined ? { result: data.result } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.featured !== undefined ? { featured: data.featured } : {}),
    ...(data.displayOrder !== undefined
      ? { displayOrder: data.displayOrder }
      : {}),
    ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
    ...(data.seoDescription !== undefined
      ? { seoDescription: data.seoDescription }
      : {}),
    ...(data.aspectRatio !== undefined ? { aspectRatio: data.aspectRatio } : {}),
    ...(data.isSample !== undefined ? { isSample: data.isSample } : {}),
  };
}

export async function createProject(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);

  try {
    await connectDB();

    const existing = await PortfolioProject.findOne({ slug }).select("_id").lean();
    if (existing) {
      return { success: false, error: "A project with this slug already exists." };
    }

    const project = await PortfolioProject.create({
      ...mapProjectFields({ ...data, slug }),
    });

    await logActivity({
      action: "create",
      entity: "project",
      entityId: String(project._id),
      details: { title: project.title, slug: project.slug },
      adminEmail: admin.email,
    });

    return { success: true, data: { id: String(project._id) } };
  } catch (error) {
    console.error("createProject error:", error);
    return { success: false, error: "Unable to create project." };
  }
}

export async function updateProject(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id, ...updates } = parsed.data;

  try {
    await connectDB();

    if (updates.slug) {
      const duplicate = await PortfolioProject.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      })
        .select("_id")
        .lean();

      if (duplicate) {
        return { success: false, error: "A project with this slug already exists." };
      }
    }

    const project = await PortfolioProject.findByIdAndUpdate(
      id,
      mapProjectFields(updates),
      { new: true, runValidators: true },
    );

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    await logActivity({
      action: "update",
      entity: "project",
      entityId: id,
      details: { fields: Object.keys(updates) },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updateProject error:", error);
    return { success: false, error: "Unable to update project." };
  }
}

export async function deleteProject(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = deleteProjectSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { id } = parsed.data;

  try {
    await connectDB();

    const project = await PortfolioProject.findByIdAndDelete(id);

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    await logActivity({
      action: "delete",
      entity: "project",
      entityId: id,
      details: { title: project.title, slug: project.slug },
      adminEmail: admin.email,
    });

    return { success: true, data: { id } };
  } catch (error) {
    console.error("deleteProject error:", error);
    return { success: false, error: "Unable to delete project." };
  }
}

export async function getProjectById(
  id: string,
): Promise<ActionResponse<Record<string, unknown>>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const project = await PortfolioProject.findById(id).lean();

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    return {
      success: true,
      data: { ...project, id: String(project._id) },
    };
  } catch (error) {
    console.error("getProjectById error:", error);
    return { success: false, error: "Unable to load project." };
  }
}

export async function listProjects(): Promise<
  ActionResponse<Record<string, unknown>[]>
> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();
    const projects = await PortfolioProject.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      data: projects.map((project) => ({
        ...project,
        id: String(project._id),
      })),
    };
  } catch (error) {
    console.error("listProjects error:", error);
    return { success: false, error: "Unable to load projects." };
  }
}
