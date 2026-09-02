"use server";

import type { ActionResponse } from "@/types/actions";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/actions/helpers";
import {
  ActivityLog,
  Booking,
  ContactSubmission,
  PortfolioProject,
  Service,
  Testimonial,
} from "@/models";

export type DashboardActivity = {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  adminEmail: string;
  createdAt: string;
};

export type DashboardMetrics = {
  newBookings: number;
  upcomingBookings: number;
  bookingsByStatus: Record<string, number>;
  unreadInquiries: number;
  publishedProjects: number;
  publishedServices: number;
  featuredTestimonials: number;
  recentActivity: DashboardActivity[];
};

export async function getDashboardMetrics(): Promise<
  ActionResponse<DashboardMetrics>
> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();

    const now = new Date();
    const weekAhead = new Date(now);
    weekAhead.setDate(weekAhead.getDate() + 7);

    const [
      newBookings,
      upcomingBookings,
      statusCounts,
      unreadInquiries,
      publishedProjects,
      publishedServices,
      featuredTestimonials,
      recentActivity,
    ] = await Promise.all([
      Booking.countDocuments({ status: "New" }),
      Booking.countDocuments({
        scheduledAt: { $gte: now, $lte: weekAhead },
        status: { $in: ["New", "Confirmed", "In Progress"] },
      }),
      Booking.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      ContactSubmission.countDocuments({ status: "new" }),
      PortfolioProject.countDocuments({ status: "published" }),
      Service.countDocuments({ active: true }),
      Testimonial.countDocuments({ featured: true, published: true }),
      ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(15)
        .lean(),
    ]);

    const bookingsByStatus: Record<string, number> = {};
    for (const item of statusCounts) {
      bookingsByStatus[item._id] = item.count;
    }

    return {
      success: true,
      data: {
        newBookings,
        upcomingBookings,
        bookingsByStatus,
        unreadInquiries,
        publishedProjects,
        publishedServices,
        featuredTestimonials,
        recentActivity: recentActivity.map((log) => ({
          id: String(log._id),
          action: log.action,
          entity: log.entity,
          entityId: log.entityId ? String(log.entityId) : undefined,
          details: log.details as Record<string, unknown> | undefined,
          adminEmail: log.adminEmail,
          createdAt: log.createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.error("getDashboardMetrics error:", error);
    return { success: false, error: "Unable to load dashboard metrics." };
  }
}
