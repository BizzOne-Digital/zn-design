"use client";

import { updateInquiry } from "@/actions/admin/inquiries";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import {
  FormField,
  inputClassName,
  selectClassName,
  textareaClassName,
} from "@/components/admin/FormField";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import {
  CONTACT_STATUS_OPTIONS,
  formatAdminDate,
} from "@/lib/admin-utils";
import type { ContactStatus } from "@/types";
import { Download, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export interface InquiryRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  serviceInterest?: string;
  budgetRange?: string;
  timeline?: string;
  message: string;
  status: ContactStatus;
  internalNotes?: string;
  createdAt: string;
}

export interface InquiriesManagerProps {
  inquiries: InquiryRow[];
}

export function InquiriesManager({ inquiries }: InquiriesManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<InquiryRow | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return inquiries.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q)
      );
    });
  }, [inquiries, search, statusFilter]);

  function selectInquiry(inquiry: InquiryRow) {
    setSelected(inquiry);
    setNotes(inquiry.internalNotes ?? "");
    setError(null);

    if (inquiry.status === "new") {
      void updateInquiry({ id: inquiry.id, status: "read" }).then((result) => {
        if (result.success) router.refresh();
      });
    }
  }

  async function handleStatusChange(status: ContactStatus) {
    if (!selected) return;
    setLoading(true);
    setError(null);

    const result = await updateInquiry({ id: selected.id, status });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSelected({ ...selected, status });
    router.refresh();
  }

  async function handleSaveNotes() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    const result = await updateInquiry({
      id: selected.id,
      internalNotes: notes,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSelected({ ...selected, internalNotes: notes });
    router.refresh();
  }

  const columns: DataTableColumn<InquiryRow>[] = [
    {
      key: "name",
      header: "Contact",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div>
          <p className="font-medium">{r.name}</p>
          <p className="text-xs text-taupe">{r.email}</p>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      render: (r) => (
        <span className="line-clamp-2 text-xs">{r.message}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "created",
      header: "Received",
      sortable: true,
      sortValue: (r) => new Date(r.createdAt),
      render: (r) => (
        <span className="text-xs text-taupe">
          {formatAdminDate(r.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Inquiries</h1>
          <p className="mt-1 text-sm text-taupe">
            {filtered.length} of {inquiries.length} submissions
          </p>
        </div>
        <a href="/api/admin/inquiries/export">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </a>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-taupe/20 bg-white p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" />
          <input
            type="search"
            placeholder="Search name, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClassName + " pl-9"}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClassName + " w-auto"}
        >
          <option value="all">All statuses</option>
          {CONTACT_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={selected ? "lg:col-span-2" : "lg:col-span-3"}>
          <DataTable
            data={filtered}
            columns={columns}
            keyExtractor={(r) => r.id}
            onRowClick={selectInquiry}
            selectedKey={selected?.id}
            emptyMessage="No inquiries match your filters."
          />
        </div>

        {selected ? (
          <div className="rounded-xl border border-taupe/20 bg-white p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  {selected.name}
                </h2>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-sm text-gold hover:underline"
                >
                  {selected.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded p-1 text-taupe hover:bg-cream/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error ? (
              <p className="mt-3 text-sm text-dusty-rose">{error}</p>
            ) : null}

            <dl className="mt-4 space-y-2 text-sm">
              {selected.phone ? (
                <div>
                  <dt className="text-taupe">Phone</dt>
                  <dd>{selected.phone}</dd>
                </div>
              ) : null}
              {selected.business ? (
                <div>
                  <dt className="text-taupe">Business</dt>
                  <dd>{selected.business}</dd>
                </div>
              ) : null}
              {selected.serviceInterest ? (
                <div>
                  <dt className="text-taupe">Service interest</dt>
                  <dd>{selected.serviceInterest}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-taupe">Message</dt>
                <dd className="mt-1 whitespace-pre-wrap">{selected.message}</dd>
              </div>
              <div>
                <dt className="text-taupe">Received</dt>
                <dd>{formatAdminDate(selected.createdAt)}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <StatusBadge status={selected.status} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {CONTACT_STATUS_OPTIONS.map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={selected.status === status ? "gold" : "outline"}
                  size="sm"
                  loading={loading}
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </Button>
              ))}
            </div>

            <div className="mt-6">
              <FormField label="Internal notes">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={textareaClassName}
                  rows={4}
                />
              </FormField>
              <Button
                type="button"
                size="sm"
                className="mt-2"
                loading={loading}
                onClick={handleSaveNotes}
              >
                Save notes
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
