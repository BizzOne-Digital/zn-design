import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import {
  API_RATE_LIMITS,
  getClientIp,
  rateLimit,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/mail";
import { sanitize } from "@/lib/utils";
import { contactFormSchema } from "@/lib/validations/contact";
import {
  formatZodErrors,
  jsonError,
  jsonSuccess,
} from "@/lib/api-helpers";
import { ContactSubmission } from "@/models";

export const runtime = "nodejs";

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

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limitResult = rateLimit(`contact:${ip}`, API_RATE_LIMITS.contact);

  if (!limitResult.success) {
    return jsonError("Too many submissions. Please try again later.", 429, {
      headers: rateLimitHeaders(limitResult),
    });
  }

  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("Validation failed.", 400, {
        fieldErrors: formatZodErrors(parsed.error),
        headers: rateLimitHeaders(limitResult),
      });
    }

    const data = parsed.data;

    if (data.honeypot) {
      return jsonSuccess(
        { id: "ok" },
        { headers: rateLimitHeaders(limitResult) },
      );
    }

    const turnstileValid = await verifyTurnstile(data.turnstileToken);

    if (!turnstileValid) {
      return jsonError("Security verification failed. Please try again.", 403, {
        headers: rateLimitHeaders(limitResult),
      });
    }

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
      await sendContactNotification({
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        business: submission.business,
        serviceInterest: submission.serviceInterest,
        budgetRange: submission.budgetRange,
        timeline: submission.timeline,
        message: submission.message,
      });
    } catch (error) {
      console.error("Contact notification email failed:", error);
    }

    return jsonSuccess(
      { id: String(submission._id) },
      { status: 201, headers: rateLimitHeaders(limitResult) },
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return jsonError("Unable to submit your message. Please try again.", 500, {
      headers: rateLimitHeaders(limitResult),
    });
  }
}
