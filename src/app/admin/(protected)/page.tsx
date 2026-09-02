import { getDashboardMetrics } from "@/actions/admin/dashboard";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { MetricsCard } from "@/components/admin/MetricsCard";
import { BOOKING_STATUS_OPTIONS } from "@/lib/admin-utils";
import {
  Calendar,
  FolderKanban,
  Mail,
  MessageSquareQuote,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | ZN Design Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const result = await getDashboardMetrics();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-dusty-rose/30 bg-red-50 px-6 py-8 text-sm text-dusty-rose">
        {result.error}
      </div>
    );
  }

  const metrics = result.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-taupe">
          Overview of bookings, content, and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricsCard
          title="New bookings"
          value={metrics.newBookings}
          icon={Calendar}
          href="/admin/bookings"
        />
        <MetricsCard
          title="Upcoming (7 days)"
          value={metrics.upcomingBookings}
          subtitle="Confirmed & pending"
          icon={Calendar}
          href="/admin/bookings"
        />
        <MetricsCard
          title="Unread inquiries"
          value={metrics.unreadInquiries}
          icon={Mail}
          href="/admin/inquiries"
        />
        <MetricsCard
          title="Published projects"
          value={metrics.publishedProjects}
          icon={FolderKanban}
          href="/admin/projects"
        />
        <MetricsCard
          title="Active services"
          value={metrics.publishedServices}
          icon={Wrench}
          href="/admin/services"
        />
        <MetricsCard
          title="Featured testimonials"
          value={metrics.featuredTestimonials}
          icon={MessageSquareQuote}
          href="/admin/testimonials"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-taupe/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Bookings by status</h2>
          <dl className="mt-4 space-y-2">
            {BOOKING_STATUS_OPTIONS.map((status) => (
              <div
                key={status}
                className="flex items-center justify-between rounded-lg bg-cream/30 px-4 py-2"
              >
                <dt className="text-sm text-taupe">{status}</dt>
                <dd className="text-sm font-semibold text-ink">
                  {metrics.bookingsByStatus[status] ?? 0}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl border border-taupe/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Quick actions</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { href: "/admin/bookings", label: "View bookings" },
              { href: "/admin/projects/new", label: "New project" },
              { href: "/admin/services/new", label: "New service" },
              { href: "/admin/inquiries", label: "Review inquiries" },
              { href: "/admin/availability", label: "Edit availability" },
              { href: "/admin/settings", label: "Site settings" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-lg border border-taupe/20 px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-gold/40 hover:bg-cream/40"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Recent activity</h2>
        <div className="mt-4">
          <ActivityFeed activities={metrics.recentActivity} />
        </div>
      </section>
    </div>
  );
}
