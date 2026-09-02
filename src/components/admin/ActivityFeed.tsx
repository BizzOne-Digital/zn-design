import { formatRelativeTime } from "@/lib/admin-utils";
import type { DashboardActivity } from "@/actions/admin/dashboard";

function formatActivityMessage(activity: DashboardActivity): string {
  const { action, entity, details } = activity;

  if (entity === "booking" && details?.reference) {
    return `${action.replace(/_/g, " ")} booking ${String(details.reference)}`;
  }
  if (entity === "project" && details?.title) {
    return `${action} project "${String(details.title)}"`;
  }
  if (entity === "service" && details?.title) {
    return `${action} service "${String(details.title)}"`;
  }
  if (entity === "inquiry" && details?.email) {
    return `${action} inquiry from ${String(details.email)}`;
  }
  if (entity === "settings" && details?.businessName) {
    return `Updated site settings`;
  }

  return `${action.replace(/_/g, " ")} ${entity}`;
}

export interface ActivityFeedProps {
  activities: DashboardActivity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-taupe">No recent activity.</p>
    );
  }

  return (
    <ul className="divide-y divide-taupe/15">
      {activities.map((activity) => (
        <li key={activity.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink capitalize">
              {formatActivityMessage(activity)}
            </p>
            <p className="mt-0.5 text-xs text-taupe">
              {activity.adminEmail} ·{" "}
              {formatRelativeTime(activity.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
