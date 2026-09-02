import { addMinutes } from "date-fns";
import { describe, expect, it } from "vitest";
import { checkSlotOverlap } from "@/lib/booking-slots";

describe("checkSlotOverlap", () => {
  const slotDuration = 30;
  const baseStart = new Date("2025-06-02T14:00:00.000Z");

  it("detects an exact duplicate booking at the same start time", () => {
    const overlaps = checkSlotOverlap(baseStart, slotDuration, [
      { scheduledAt: baseStart, durationMinutes: slotDuration },
    ]);

    expect(overlaps).toBe(true);
  });

  it("detects partial overlaps when bookings share time", () => {
    const overlappingStart = addMinutes(baseStart, 15);

    const overlaps = checkSlotOverlap(baseStart, slotDuration, [
      { scheduledAt: overlappingStart, durationMinutes: slotDuration },
    ]);

    expect(overlaps).toBe(true);
  });

  it("allows back-to-back bookings that only touch at the boundary", () => {
    const adjacentStart = addMinutes(baseStart, slotDuration);

    const overlaps = checkSlotOverlap(baseStart, slotDuration, [
      { scheduledAt: adjacentStart, durationMinutes: slotDuration },
    ]);

    expect(overlaps).toBe(false);
  });

  it("detects overlap when an existing booking uses a longer duration", () => {
    const laterStart = addMinutes(baseStart, 45);

    const overlaps = checkSlotOverlap(laterStart, slotDuration, [
      { scheduledAt: baseStart, durationMinutes: 60 },
    ]);

    expect(overlaps).toBe(true);
  });

  it("returns false when no existing bookings conflict", () => {
    const unrelatedStart = addMinutes(baseStart, 120);

    const overlaps = checkSlotOverlap(unrelatedStart, slotDuration, [
      { scheduledAt: baseStart, durationMinutes: slotDuration },
      { scheduledAt: addMinutes(baseStart, 60), durationMinutes: slotDuration },
    ]);

    expect(overlaps).toBe(false);
  });

  it("excludes cancelled-style gaps when bookings are far apart", () => {
    const candidate = addMinutes(baseStart, 180);

    const overlaps = checkSlotOverlap(candidate, slotDuration, [
      { scheduledAt: baseStart, durationMinutes: 30 },
    ]);

    expect(overlaps).toBe(false);
  });
});
