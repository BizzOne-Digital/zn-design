"use server";

import { headers } from "next/headers";
import type { ActionResponse } from "@/types/actions";
import { connectDB } from "@/lib/db";
import { rateLimit, API_RATE_LIMITS } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/mail";
import { sanitize } from "@/lib/utils";
import { contactFormSchema } from "@/lib/validations/contact";
import { validationError } from "@/actions/helpers";
import { ContactSubmission } from "@/models";

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
        }),
      },
    );

    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

function getClientKey(headerStore: Headers): string {
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `contact:${ip}`;
}

export async function createContactSubmission(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const parsed = contactFormSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const data = parsed.data;

  if (data.honeypot) {
    return { success: true, data: { id: "ok" } };
  }

  const headerStore = await headers();
  const rateLimitResult = rateLimit(
    getClientKey(headerStore),
    API_RATE_LIMITS.contact,
  );

  if (!rateLimitResult.success) {
    return {
      success: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  const turnstileValid = await verifyTurnstile(data.turnstileToken);

  if (!turnstileValid) {
    return {
      success: false,
      error: "Security verification failed. Please try again.",
    };
  }

  try {
    await connectDB();

    const submission = await ContactSubmission.create({
      name: sanitize(data.name),
      email: data.email,
      phone: data.phone ? sanitize(data.phone) : undefined,
      business: data.business ? sanitize(data.business) : undefined,
      serviceInterest: data.serviceInterest
        ? sanitize(data.serviceInterest)
        : undefined,
      budgetRange: data.budgetRange,
      timeline: data.timeline,
      message: sanitize(data.message),
      consent: data.consent,
      status: "new",
      honeypot: data.honeypot ?? "",
    });

    try {
      await sendContactNotification(submission);
    } catch (error) {
      console.error("Contact notification email failed:", error);
    }

    return {
      success: true,
      data: { id: String(submission._id) },
    };
  } catch (error) {
    console.error("createContactSubmission error:", error);
    return {
      success: false,
      error: "Unable to submit your message. Please try again.",
    };
  }
}
