import { connectDB } from "@/lib/db";
import { jsonError, requireAdminSession, toCsv } from "@/lib/api-helpers";
import { ContactSubmission } from "@/models";

export const runtime = "nodejs";

const CSV_HEADERS = [
  "Name",
  "Email",
  "Phone",
  "Business",
  "Service Interest",
  "Budget",
  "Timeline",
  "Message",
  "Status",
  "Created At",
];

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return admin.response;
  }

  try {
    await connectDB();

    const inquiries = await ContactSubmission.find()
      .sort({ createdAt: -1 })
      .lean();

    const rows = inquiries.map((inquiry) => [
      inquiry.name,
      inquiry.email,
      inquiry.phone ?? "",
      inquiry.business ?? "",
      inquiry.serviceInterest ?? "",
      inquiry.budgetRange ?? "",
      inquiry.timeline ?? "",
      inquiry.message,
      inquiry.status,
      inquiry.createdAt.toISOString(),
    ]);

    const csv = toCsv(CSV_HEADERS, rows);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="zn-design-inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/inquiries/export error:", error);
    return jsonError("Unable to export inquiries.", 500);
  }
}
