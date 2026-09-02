import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { IBooking } from "@/types";
import { siteConfig } from "@/config/site";
import { formatInTimeZone } from "date-fns-tz";
import { sanitize } from "./utils";

export type BookingEmailData = Pick<
  IBooking,
  | "reference"
  | "clientName"
  | "email"
  | "phone"
  | "businessName"
  | "serviceName"
  | "projectType"
  | "budgetRange"
  | "timeline"
  | "description"
  | "referralSource"
  | "scheduledAt"
  | "timezone"
>;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE !== "false";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_USER and SMTP_APP_PASSWORD.",
    );
  }

  return { host, port, secure, auth: { user, pass } };
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(getSmtpConfig());
  }
  return transporter;
}

function getFromAddress(): string {
  const user = process.env.SMTP_USER;
  if (!user) {
    throw new Error("SMTP_USER is not configured");
  }
  return `"${siteConfig.businessName}" <${user}>`;
}

function getNotificationEmail(): string {
  return (
    process.env.BOOKING_NOTIFICATION_EMAIL ??
    process.env.ADMIN_EMAIL ??
    siteConfig.email
  );
}

function formatBookingDateTime(booking: BookingEmailData): string {
  return formatInTimeZone(
    booking.scheduledAt,
    booking.timezone,
    "EEEE, d MMMM yyyy 'at' h:mm a zzz",
  );
}

export async function sendBookingConfirmation(
  booking: BookingEmailData,
): Promise<void> {
  const transport = getTransporter();
  const scheduledLabel = formatBookingDateTime(booking);

  await transport.sendMail({
    from: getFromAddress(),
    to: booking.email,
    subject: `Booking confirmed — ${booking.reference}`,
    text: [
      `Hi ${sanitize(booking.clientName)},`,
      "",
      `Thank you for booking a consultation with ${siteConfig.businessName}.`,
      "",
      `Reference: ${booking.reference}`,
      `Date & time: ${scheduledLabel}`,
      booking.serviceName ? `Service: ${booking.serviceName}` : "",
      "",
      "We look forward to speaking with you.",
      "",
      siteConfig.businessName,
      siteConfig.email,
      siteConfig.phone,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <p>Hi ${sanitize(booking.clientName)},</p>
      <p>Thank you for booking a consultation with <strong>${siteConfig.businessName}</strong>.</p>
      <ul>
        <li><strong>Reference:</strong> ${booking.reference}</li>
        <li><strong>Date &amp; time:</strong> ${scheduledLabel}</li>
        ${booking.serviceName ? `<li><strong>Service:</strong> ${sanitize(booking.serviceName)}</li>` : ""}
      </ul>
      <p>We look forward to speaking with you.</p>
      <p>
        ${siteConfig.businessName}<br />
        <a href="mailto:${siteConfig.email}">${siteConfig.email}</a><br />
        ${siteConfig.phone}
      </p>
    `,
  });
}

export async function sendBookingNotification(
  booking: BookingEmailData,
): Promise<void> {
  const transport = getTransporter();
  const scheduledLabel = formatBookingDateTime(booking);
  const notificationEmail = getNotificationEmail();

  await transport.sendMail({
    from: getFromAddress(),
    to: notificationEmail,
    subject: `New booking — ${booking.reference}`,
    text: [
      "A new booking has been received.",
      "",
      `Reference: ${booking.reference}`,
      `Client: ${booking.clientName}`,
      `Email: ${booking.email}`,
      booking.phone ? `Phone: ${booking.phone}` : "",
      booking.businessName ? `Business: ${booking.businessName}` : "",
      `Scheduled: ${scheduledLabel}`,
      booking.serviceName ? `Service: ${booking.serviceName}` : "",
      booking.projectType ? `Project type: ${booking.projectType}` : "",
      booking.budgetRange ? `Budget: ${booking.budgetRange}` : "",
      booking.timeline ? `Timeline: ${booking.timeline}` : "",
      booking.description ? `Description: ${booking.description}` : "",
      booking.referralSource ? `Referral: ${booking.referralSource}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <h2>New booking received</h2>
      <ul>
        <li><strong>Reference:</strong> ${booking.reference}</li>
        <li><strong>Client:</strong> ${sanitize(booking.clientName)}</li>
        <li><strong>Email:</strong> <a href="mailto:${booking.email}">${booking.email}</a></li>
        ${booking.phone ? `<li><strong>Phone:</strong> ${sanitize(booking.phone)}</li>` : ""}
        ${booking.businessName ? `<li><strong>Business:</strong> ${sanitize(booking.businessName)}</li>` : ""}
        <li><strong>Scheduled:</strong> ${scheduledLabel}</li>
        ${booking.serviceName ? `<li><strong>Service:</strong> ${sanitize(booking.serviceName)}</li>` : ""}
        ${booking.projectType ? `<li><strong>Project type:</strong> ${sanitize(booking.projectType)}</li>` : ""}
        ${booking.budgetRange ? `<li><strong>Budget:</strong> ${sanitize(booking.budgetRange)}</li>` : ""}
        ${booking.timeline ? `<li><strong>Timeline:</strong> ${sanitize(booking.timeline)}</li>` : ""}
      </ul>
      ${booking.description ? `<p><strong>Description:</strong><br />${sanitize(booking.description).replace(/\n/g, "<br />")}</p>` : ""}
      ${booking.referralSource ? `<p><strong>Referral:</strong> ${sanitize(booking.referralSource)}</p>` : ""}
    `,
  });
}

export interface ContactNotificationPayload {
  name: string;
  email: string;
  phone?: string;
  business?: string;
  serviceInterest?: string;
  budgetRange?: string;
  timeline?: string;
  message: string;
}

export async function sendContactNotification(
  submission: ContactNotificationPayload,
): Promise<void> {
  const transport = getTransporter();
  const notificationEmail = getNotificationEmail();

  await transport.sendMail({
    from: getFromAddress(),
    to: notificationEmail,
    replyTo: submission.email,
    subject: `New contact enquiry — ${sanitize(submission.name)}`,
    text: [
      "A new contact form submission has been received.",
      "",
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      submission.phone ? `Phone: ${submission.phone}` : "",
      submission.business ? `Business: ${submission.business}` : "",
      submission.serviceInterest
        ? `Service interest: ${submission.serviceInterest}`
        : "",
      submission.budgetRange ? `Budget: ${submission.budgetRange}` : "",
      submission.timeline ? `Timeline: ${submission.timeline}` : "",
      "",
      submission.message,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <h2>New contact enquiry</h2>
      <ul>
        <li><strong>Name:</strong> ${sanitize(submission.name)}</li>
        <li><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></li>
        ${submission.phone ? `<li><strong>Phone:</strong> ${sanitize(submission.phone)}</li>` : ""}
        ${submission.business ? `<li><strong>Business:</strong> ${sanitize(submission.business)}</li>` : ""}
        ${submission.serviceInterest ? `<li><strong>Service interest:</strong> ${sanitize(submission.serviceInterest)}</li>` : ""}
        ${submission.budgetRange ? `<li><strong>Budget:</strong> ${sanitize(submission.budgetRange)}</li>` : ""}
        ${submission.timeline ? `<li><strong>Timeline:</strong> ${sanitize(submission.timeline)}</li>` : ""}
      </ul>
      <p><strong>Message:</strong></p>
      <p>${sanitize(submission.message).replace(/\n/g, "<br />")}</p>
    `,
  });
}

export async function verifyMailConnection(): Promise<boolean> {
  try {
    await getTransporter().verify();
    return true;
  } catch {
    return false;
  }
}
