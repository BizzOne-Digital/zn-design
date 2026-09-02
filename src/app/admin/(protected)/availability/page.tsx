import { getAvailability } from "@/actions/admin/availability";
import { AvailabilityEditor } from "@/components/admin/AvailabilityEditor";
import type { UpdateAvailabilityInput } from "@/lib/validations/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Availability | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializeAvailability(
  data: Record<string, unknown>,
): UpdateAvailabilityInput {
  return {
    timezone: String(data.timezone),
    slotDurationMinutes: Number(data.slotDurationMinutes),
    leadTimeHours: Number(data.leadTimeHours),
    bookingHorizonDays: Number(data.bookingHorizonDays),
    weeklyHours: (data.weeklyHours as UpdateAvailabilityInput["weeklyHours"]) ?? [],
    blackoutDates: ((data.blackoutDates as Date[]) ?? []).map((d) =>
      d instanceof Date ? d : new Date(d),
    ),
  };
}

export default async function AvailabilityPage() {
  const result = await getAvailability();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-dusty-rose/30 bg-red-50 px-6 py-8 text-sm text-dusty-rose">
        {result.error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Availability</h1>
        <p className="mt-1 text-sm text-taupe">
          Configure booking hours, slot duration, and blackout dates.
        </p>
      </div>
      <AvailabilityEditor initialData={serializeAvailability(result.data)} />
    </div>
  );
}
