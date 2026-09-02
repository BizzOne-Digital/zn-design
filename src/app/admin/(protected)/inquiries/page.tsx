import { listInquiries } from "@/actions/admin/inquiries";
import {
  InquiriesManager,
  type InquiryRow,
} from "@/components/admin/InquiriesManager";
import type { ContactStatus } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inquiries | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializeInquiries(data: Record<string, unknown>[]): InquiryRow[] {
  return data.map((i) => ({
    id: String(i.id),
    name: String(i.name),
    email: String(i.email),
    phone: i.phone ? String(i.phone) : undefined,
    business: i.business ? String(i.business) : undefined,
    serviceInterest: i.serviceInterest
      ? String(i.serviceInterest)
      : undefined,
    budgetRange: i.budgetRange ? String(i.budgetRange) : undefined,
    timeline: i.timeline ? String(i.timeline) : undefined,
    message: String(i.message),
    status: i.status as ContactStatus,
    internalNotes: i.internalNotes ? String(i.internalNotes) : undefined,
    createdAt:
      i.createdAt instanceof Date
        ? i.createdAt.toISOString()
        : String(i.createdAt),
  }));
}

export default async function InquiriesPage() {
  const result = await listInquiries();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-dusty-rose/30 bg-red-50 px-6 py-8 text-sm text-dusty-rose">
        {result.error}
      </div>
    );
  }

  return <InquiriesManager inquiries={serializeInquiries(result.data)} />;
}
