import { formatInTimeZone } from "date-fns-tz";
import { connectDB } from "@/lib/db";
import { jsonError, requireAdminSession, toCsv } from "@/lib/api-helpers";
import { Booking } from "@/models";

export const runtime = "nodejs";

const CSV_HEADERS = [
  "Reference",
  "Client Name",
  "Email",
  "Phone",
  "Business",
  "Website",
  "Service",
  "Project Type",
  "Budget",
  "Timeline",
  "Scheduled At (UTC)",
  "Scheduled At (Local)",
  "Timezone",
  "Status",
  "Description",
  "Referral Source",
  "Email Sent",
  "Created At",
];

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return admin.response;
  }

  try {
    await connectDB();

    const bookings = await Booking.find()
      .sort({ scheduledAt: -1, createdAt: -1 })
      .lean();

    const rows = bookings.map((booking) => [
      booking.reference,
      booking.clientName,
      booking.email,
      booking.phone ?? "",
      booking.businessName ?? "",
      booking.website ?? "",
      booking.serviceName ?? "",
      booking.projectType ?? "",
      booking.budgetRange ?? "",
      booking.timeline ?? "",
      booking.scheduledAt.toISOString(),
      formatInTimeZone(
        booking.scheduledAt,
        booking.timezone,
        "yyyy-MM-dd HH:mm:ss zzz",
      ),
      booking.timezone,
      booking.status,
      booking.description ?? "",
      booking.referralSource ?? "",
      booking.emailSent ? "yes" : "no",
      booking.createdAt.toISOString(),
    ]);

    const csv = toCsv(CSV_HEADERS, rows);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="zn-design-bookings-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/bookings/export error:", error);
    return jsonError("Unable to export bookings.", 500);
  }
}
