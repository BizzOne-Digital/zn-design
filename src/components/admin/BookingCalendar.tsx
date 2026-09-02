"use client";

import { formatBookingDateTime } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { StatusBadge } from "./StatusBadge";

export interface CalendarBooking {
  id: string;
  reference: string;
  clientName: string;
  scheduledAt: string;
  timezone: string;
  status: BookingStatus;
}

export interface BookingCalendarProps {
  bookings: CalendarBooking[];
  onSelectBooking?: (booking: CalendarBooking) => void;
  selectedId?: string;
}

export function BookingCalendar({
  bookings,
  onSelectBooking,
  selectedId,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const bookingsByDay = useMemo(() => {
    const map = new Map<string, CalendarBooking[]>();
    for (const booking of bookings) {
      const date = new Date(booking.scheduledAt);
      const key = format(date, "yyyy-MM-dd");
      const existing = map.get(key) ?? [];
      existing.push(booking);
      map.set(key, existing);
    }
    return map;
  }, [bookings]);

  return (
    <div className="rounded-xl border border-taupe/20 bg-white">
      <div className="flex items-center justify-between border-b border-taupe/15 px-4 py-3">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="rounded-lg p-2 text-taupe hover:bg-cream/60"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-sm font-semibold text-ink">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="rounded-lg p-2 text-taupe hover:bg-cream/60"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-taupe/15 text-center text-xs font-medium uppercase tracking-wider text-taupe">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayBookings = bookingsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={key}
              className={cn(
                "min-h-[90px] border-b border-r border-taupe/10 p-1.5",
                !inMonth && "bg-cream/20 text-taupe/50",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday(day) && "bg-ink text-ivory font-semibold",
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayBookings.slice(0, 3).map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => onSelectBooking?.(booking)}
                    className={cn(
                      "block w-full truncate rounded px-1 py-0.5 text-left text-[10px] leading-tight transition-colors",
                      selectedId === booking.id
                        ? "bg-gold/20 text-ink"
                        : "bg-cream/60 text-ink hover:bg-gold/10",
                    )}
                    title={formatBookingDateTime(
                      booking.scheduledAt,
                      booking.timezone,
                    )}
                  >
                    {booking.clientName}
                  </button>
                ))}
                {dayBookings.length > 3 ? (
                  <span className="px-1 text-[10px] text-taupe">
                    +{dayBookings.length - 3} more
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BookingCalendarLegend() {
  return (
    <p className="text-xs text-taupe">
      Click a booking in the calendar to view details.
    </p>
  );
}
