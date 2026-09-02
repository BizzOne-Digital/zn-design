import { NextRequest } from "next/server";
import { bookingSlotsQuerySchema } from "@/lib/validations/booking";
import {
  filterSlotsByRange,
  formatZodErrors,
  getAvailabilitySettings,
  getAvailableSlots,
  jsonError,
  jsonSuccess,
  serializeSlots,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const startDateParam = request.nextUrl.searchParams.get("startDate");
    const endDateParam = request.nextUrl.searchParams.get("endDate");

    const parsed = bookingSlotsQuerySchema.safeParse({
      startDate: startDateParam,
      endDate: endDateParam,
    });

    if (!parsed.success) {
      return jsonError("Invalid date range.", 400, {
        fieldErrors: formatZodErrors(parsed.error),
      });
    }

    const { startDate, endDate } = parsed.data;

    if (endDate < startDate) {
      return jsonError("endDate must be on or after startDate.", 400);
    }

    const [rule, slots] = await Promise.all([
      getAvailabilitySettings(),
      getAvailableSlots(),
    ]);

    const rangeSlots = filterSlotsByRange(slots, startDate, endDate);

    return jsonSuccess({
      timezone: rule.timezone,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      slots: serializeSlots(rangeSlots),
    });
  } catch (error) {
    console.error("GET /api/bookings/slots error:", error);
    return jsonError("Unable to load slots for the requested range.", 500);
  }
}
