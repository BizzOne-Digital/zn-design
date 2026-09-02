import { describe, expect, it } from "vitest";
import {
  DEFAULT_WEEKLY_HOURS,
  generateAvailableSlots,
} from "@/lib/booking-slots";

describe("generateAvailableSlots", () => {
  const easternRule = {
    timezone: "America/New_York",
    slotDurationMinutes: 30,
    leadTimeHours: 0,
    bookingHorizonDays: 7,
    weeklyHours: DEFAULT_WEEKLY_HOURS,
    blackoutDates: [] as Date[],
  };

  it("generates 30-minute slots within Mon–Fri 9–5 Eastern", () => {
    const fromDate = new Date("2025-06-02T04:00:00.000Z");

    const slots = generateAvailableSlots({
      rule: easternRule,
      existingBookings: [],
      fromDate,
    });

    const mondaySlots = slots.filter((slot) =>
      slot.startLocal.startsWith("2025-06-02"),
    );

    expect(mondaySlots.length).toBeGreaterThan(0);
    expect(mondaySlots[0]?.startLocal).toContain("T09:00:00");
    expect(mondaySlots[mondaySlots.length - 1]?.startLocal).toContain("T16:30:00");
  });

  it("respects the 24-hour lead time in the business timezone", () => {
    const fromDate = new Date("2025-06-02T14:00:00.000Z");

    const slots = generateAvailableSlots({
      rule: {
        ...easternRule,
        leadTimeHours: 24,
      },
      existingBookings: [],
      fromDate,
    });

    const earliest = slots[0]?.start;
    expect(earliest).toBeDefined();
    expect(earliest!.getTime()).toBeGreaterThanOrEqual(
      fromDate.getTime() + 24 * 60 * 60 * 1000 - 1000,
    );
  });

  it("handles DST spring-forward without producing invalid local times", () => {
    const fromDate = new Date("2025-03-08T05:00:00.000Z");

    const slots = generateAvailableSlots({
      rule: easternRule,
      existingBookings: [],
      fromDate,
    });

    const sundaySlots = slots.filter((slot) =>
      slot.startLocal.startsWith("2025-03-09"),
    );
    const mondaySlots = slots.filter((slot) =>
      slot.startLocal.startsWith("2025-03-10"),
    );

    expect(sundaySlots).toHaveLength(0);
    expect(mondaySlots.length).toBeGreaterThan(0);

    for (const slot of mondaySlots) {
      expect(slot.startLocal).toMatch(/T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      expect(slot.end.getTime() - slot.start.getTime()).toBe(30 * 60 * 1000);
    }
  });

  it("skips blackout dates evaluated in the configured timezone", () => {
    const fromDate = new Date("2025-06-02T04:00:00.000Z");

    const slots = generateAvailableSlots({
      rule: {
        ...easternRule,
        blackoutDates: [new Date("2025-06-04T12:00:00.000Z")],
      },
      existingBookings: [],
      fromDate,
    });

    const wednesdaySlots = slots.filter((slot) =>
      slot.startLocal.startsWith("2025-06-04"),
    );

    expect(wednesdaySlots).toHaveLength(0);

    const tuesdaySlots = slots.filter((slot) =>
      slot.startLocal.startsWith("2025-06-03"),
    );
    expect(tuesdaySlots.length).toBeGreaterThan(0);
  });

  it("aligns slot boundaries across UTC midnight for US Eastern clients", () => {
    const fromDate = new Date("2025-06-02T03:30:00.000Z");

    const slots = generateAvailableSlots({
      rule: easternRule,
      existingBookings: [],
      fromDate,
    });

    const mondayMorning = slots.find((slot) =>
      slot.startLocal.includes("T09:00:00"),
    );

    expect(mondayMorning).toBeDefined();
    expect(mondayMorning!.start.toISOString()).toBe("2025-06-02T13:00:00.000Z");
  });
});
