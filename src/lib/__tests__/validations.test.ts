import { describe, expect, it } from "vitest";
import {
  bookingStep1Schema,
  bookingStep2Schema,
  bookingStep3Schema,
  bookingSubmissionSchema,
} from "@/lib/validations/booking";
import { contactFormSchema } from "@/lib/validations/contact";

describe("contactFormSchema", () => {
  it("accepts a valid contact submission", () => {
    const result = contactFormSchema.safeParse({
      name: "Alex Rivera",
      email: "Alex@Example.com",
      phone: "(508) 555-0100",
      business: "Rivera Studio",
      message: "I would like to discuss a brand refresh for my studio.",
      consent: true,
      honeypot: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("alex@example.com");
      expect(result.data.phone).toBe("(508) 555-0100");
    }
  });

  it("rejects submissions without consent", () => {
    const result = contactFormSchema.safeParse({
      name: "Alex Rivera",
      email: "alex@example.com",
      message: "Need help with a logo project for my business.",
      consent: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects honeypot spam submissions", () => {
    const result = contactFormSchema.safeParse({
      name: "Spammer",
      email: "spam@example.com",
      message: "This is definitely not a real inquiry message.",
      consent: true,
      honeypot: "filled",
    });

    expect(result.success).toBe(false);
  });

  it("requires messages to meet minimum length", () => {
    const result = contactFormSchema.safeParse({
      name: "Alex Rivera",
      email: "alex@example.com",
      message: "Too short",
      consent: true,
    });

    expect(result.success).toBe(false);
  });
});

describe("booking schemas", () => {
  const validStep3 = {
    clientName: "Jamie Lee",
    email: "jamie@example.com",
    phone: "5085550101",
    projectType: "Logo & Brand Identity" as const,
    budgetRange: "$1,000 – $2,500" as const,
    timeline: "2–4 weeks" as const,
    description:
      "We are launching a wellness brand and need a logo plus basic brand kit for web and packaging.",
    referralSource: "Google Search" as const,
  };

  it("validates booking step 1 service selection", () => {
    const result = bookingStep1Schema.safeParse({
      serviceId: "",
      serviceName: "Logo & Brand Identity",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.serviceId).toBeUndefined();
    }
  });

  it("requires a service name in booking step 1", () => {
    const result = bookingStep1Schema.safeParse({
      serviceId: "",
      serviceName: "",
    });

    expect(result.success).toBe(false);
  });

  it("validates booking step 2 date and timezone", () => {
    const result = bookingStep2Schema.safeParse({
      scheduledAt: "2025-06-15T14:00:00.000Z",
      timezone: "America/New_York",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scheduledAt).toBeInstanceOf(Date);
      expect(result.data.timezone).toBe("America/New_York");
    }
  });

  it("validates booking step 3 client details", () => {
    const result = bookingStep3Schema.safeParse(validStep3);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("jamie@example.com");
    }
  });

  it("rejects booking descriptions that are too short", () => {
    const result = bookingStep3Schema.safeParse({
      ...validStep3,
      description: "Too short",
    });

    expect(result.success).toBe(false);
  });

  it("validates the full booking submission payload", () => {
    const result = bookingSubmissionSchema.safeParse({
      serviceName: "Social Media Design",
      scheduledAt: "2025-06-15T14:30:00.000Z",
      timezone: "America/New_York",
      ...validStep3,
    });

    expect(result.success).toBe(true);
  });
});
