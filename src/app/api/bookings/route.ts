import { isValid, parseISO } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/actions/booking";
import {
  API_RATE_LIMITS,
  getClientIp,
  rateLimit,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import {
  filterSlotsByDate,
  getAvailabilitySettings,
  getAvailableSlots,
  jsonError,
  jsonSuccess,
  serializeSlots,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const dateParam = request.nextUrl.searchParams.get("date");
    const timezoneParam = request.nextUrl.searchParams.get("timezone");

    const rule = await getAvailabilitySettings();
    const timezone = timezoneParam?.trim() || rule.timezone;
    const slots = await getAvailableSlots();

    if (dateParam) {
      const parsedDate = parseISO(dateParam);

      if (!isValid(parsedDate)) {
        return jsonError("Invalid date. Use ISO format (YYYY-MM-DD).", 400);
      }

      const daySlots = filterSlotsByDate(slots, parsedDate, timezone);

      return jsonSuccess({
        timezone,
        date: dateParam,
        slots: serializeSlots(daySlots),
      });
    }

    return jsonSuccess({
      timezone: rule.timezone,
      slots: serializeSlots(slots),
    });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return jsonError("Unable to load available slots.", 500);
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limitResult = rateLimit(`booking:${ip}`, API_RATE_LIMITS.booking);

  if (!limitResult.success) {
    return jsonError("Too many booking requests. Please try again later.", 429, {
      headers: rateLimitHeaders(limitResult),
    });
  }

  try {
    const body = await request.json();
    const result = await createBooking(body);

    if (!result.success) {
      const status = result.fieldErrors ? 400 : 409;
      return NextResponse.json(result, {
        status,
        headers: rateLimitHeaders(limitResult),
      });
    }

    return jsonSuccess(result.data, {
      status: 201,
      headers: rateLimitHeaders(limitResult),
    });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return jsonError("Unable to create booking. Please try again.", 500, {
      headers: rateLimitHeaders(limitResult),
    });
  }
}
