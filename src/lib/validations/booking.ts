import { z } from "zod";

export const BUDGET_RANGES = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
] as const;

export const PROJECT_TYPES = [
  "Logo & Brand Identity",
  "Social Media Design",
  "Print Design",
  "Packaging Design",
  "Banner Design",
  "Visual Design",
  "Custom Graphic Design",
  "Other",
] as const;

export const REFERRAL_SOURCES = [
  "Google Search",
  "Social Media",
  "Referral",
  "Returning Client",
  "Other",
] as const;

export const TIMELINE_OPTIONS = [
  "ASAP",
  "1–2 weeks",
  "2–4 weeks",
  "1–2 months",
  "Flexible",
] as const;

export const bookingStep1Schema = z.object({
  serviceId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
  serviceName: z
    .string()
    .trim()
    .min(1, "Select a service or choose Not sure yet")
    .max(120),
});

export const bookingStep2Schema = z.object({
  scheduledAt: z.coerce.date({
    invalid_type_error: "Select a valid date and time",
  }),
  timezone: z.string().trim().min(1, "Timezone is required").max(80),
});

export const bookingStep3Schema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(30),
  businessName: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
  projectType: z.enum(PROJECT_TYPES, {
    errorMap: () => ({ message: "Select a project type" }),
  }),
  budgetRange: z.enum(BUDGET_RANGES, {
    errorMap: () => ({ message: "Select a budget range" }),
  }),
  timeline: z.enum(TIMELINE_OPTIONS, {
    errorMap: () => ({ message: "Select a timeline" }),
  }),
  description: z
    .string()
    .trim()
    .min(20, "Please describe your project in at least 20 characters")
    .max(5000),
  referralSource: z.enum(REFERRAL_SOURCES, {
    errorMap: () => ({ message: "Select how you heard about us" }),
  }),
});

export const bookingSubmissionSchema = bookingStep1Schema
  .merge(bookingStep2Schema)
  .merge(bookingStep3Schema);

export type BookingStep1Input = z.infer<typeof bookingStep1Schema>;
export type BookingStep2Input = z.infer<typeof bookingStep2Schema>;
export type BookingStep3Input = z.infer<typeof bookingStep3Schema>;
export type BookingSubmissionInput = z.infer<typeof bookingSubmissionSchema>;

export const bookingSlotsQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type BookingSlotsQueryInput = z.infer<typeof bookingSlotsQuerySchema>;
