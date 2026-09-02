import { listBookings } from "@/actions/admin/bookings";
import { BookingsManager, type BookingRow } from "@/components/admin/BookingsManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializeBookings(
  data: Record<string, unknown>[],
): BookingRow[] {
  return data.map((b) => ({
    id: String(b.id),
    reference: String(b.reference),
    clientName: String(b.clientName),
    email: String(b.email),
    phone: b.phone ? String(b.phone) : undefined,
    businessName: b.businessName ? String(b.businessName) : undefined,
    website: b.website ? String(b.website) : undefined,
    serviceName: b.serviceName ? String(b.serviceName) : undefined,
    projectType: b.projectType ? String(b.projectType) : undefined,
    budgetRange: b.budgetRange ? String(b.budgetRange) : undefined,
    timeline: b.timeline ? String(b.timeline) : undefined,
    description: b.description ? String(b.description) : undefined,
    referralSource: b.referralSource ? String(b.referralSource) : undefined,
    scheduledAt:
      b.scheduledAt instanceof Date
        ? b.scheduledAt.toISOString()
        : String(b.scheduledAt),
    timezone: String(b.timezone),
    status: b.status as BookingRow["status"],
    internalNotes: b.internalNotes ? String(b.internalNotes) : undefined,
    createdAt:
      b.createdAt instanceof Date
        ? b.createdAt.toISOString()
        : String(b.createdAt),
  }));
}

export default async function BookingsPage() {
  const result = await listBookings();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-dusty-rose/30 bg-red-50 px-6 py-8 text-sm text-dusty-rose">
        {result.error}
      </div>
    );
  }

  return <BookingsManager bookings={serializeBookings(result.data)} />;
}
