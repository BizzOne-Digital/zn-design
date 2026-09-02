"use client";

import {
  deleteBooking,
  updateBookingNotes,
  updateBookingStatus,
} from "@/actions/admin/bookings";
import {
  BookingCalendar,
  type CalendarBooking,
} from "@/components/admin/BookingCalendar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
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
  BOOKING_STATUS_OPTIONS,
  formatAdminDate,
  formatBookingDateTime,
} from "@/lib/admin-utils";
import type { BookingStatus } from "@/types";
import { Download, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export interface BookingRow {
  id: string;
  reference: string;
  clientName: string;
  email: string;
  phone?: string;
  businessName?: string;
  website?: string;
  serviceName?: string;
  projectType?: string;
  budgetRange?: string;
  timeline?: string;
  description?: string;
  referralSource?: string;
  scheduledAt: string;
  timezone: string;
  status: BookingStatus;
  internalNotes?: string;
  createdAt: string;
}

export interface BookingsManagerProps {
  bookings: BookingRow[];
}

export function BookingsManager({ bookings }: BookingsManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<BookingRow | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BookingRow | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (dateFrom && new Date(b.scheduledAt) < new Date(dateFrom)) return false;
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(b.scheduledAt) > to) return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        b.reference.toLowerCase().includes(q) ||
        b.clientName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        (b.serviceName?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [bookings, search, statusFilter, dateFrom, dateTo]);

  const calendarBookings: CalendarBooking[] = filtered.map((b) => ({
    id: b.id,
    reference: b.reference,
    clientName: b.clientName,
    scheduledAt: b.scheduledAt,
    timezone: b.timezone,
    status: b.status,
  }));

  function selectBooking(booking: BookingRow) {
    setSelected(booking);
    setNotes(booking.internalNotes ?? "");
    setError(null);
  }

  async function handleStatusChange(status: BookingStatus) {
    if (!selected) return;
    setLoading(true);
    setError(null);

    const result = await updateBookingStatus({ id: selected.id, status });
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

    const result = await updateBookingNotes({
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

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);

    const result = await deleteBooking({
      id: deleteTarget.id,
      confirmDelete: true,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      setDeleteTarget(null);
      return;
    }

    if (selected?.id === deleteTarget.id) setSelected(null);
    setDeleteTarget(null);
    router.refresh();
  }

  const columns: DataTableColumn<BookingRow>[] = [
    {
      key: "reference",
      header: "Reference",
      sortable: true,
      sortValue: (r) => r.reference,
      render: (r) => (
        <span className="font-mono text-xs">{r.reference}</span>
      ),
    },
    {
      key: "client",
      header: "Client",
      sortable: true,
      sortValue: (r) => r.clientName,
      render: (r) => (
        <div>
          <p className="font-medium">{r.clientName}</p>
          <p className="text-xs text-taupe">{r.email}</p>
        </div>
      ),
    },
    {
      key: "scheduled",
      header: "Scheduled",
      sortable: true,
      sortValue: (r) => new Date(r.scheduledAt),
      render: (r) => (
        <span className="text-xs">
          {formatBookingDateTime(r.scheduledAt, r.timezone)}
        </span>
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
      key: "service",
      header: "Service",
      render: (r) => r.serviceName ?? "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Bookings</h1>
          <p className="mt-1 text-sm text-taupe">
            {filtered.length} of {bookings.length} bookings
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewMode === "table" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
          <Button
            variant={viewMode === "calendar" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            Calendar
          </Button>
          <a href="/api/admin/bookings/export">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-taupe/20 bg-white p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" />
          <input
            type="search"
            placeholder="Search reference, client, email..."
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
          {BOOKING_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className={inputClassName + " w-auto"}
          aria-label="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className={inputClassName + " w-auto"}
          aria-label="To date"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={selected ? "lg:col-span-2" : "lg:col-span-3"}>
          {viewMode === "table" ? (
            <DataTable
              data={filtered}
              columns={columns}
              keyExtractor={(r) => r.id}
              onRowClick={selectBooking}
              selectedKey={selected?.id}
              emptyMessage="No bookings match your filters."
            />
          ) : (
            <BookingCalendar
              bookings={calendarBookings}
              selectedId={selected?.id}
              onSelectBooking={(b) => {
                const full = bookings.find((x) => x.id === b.id);
                if (full) selectBooking(full);
              }}
            />
          )}
        </div>

        {selected ? (
          <div className="rounded-xl border border-taupe/20 bg-white p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  {selected.clientName}
                </h2>
                <p className="font-mono text-xs text-taupe">
                  {selected.reference}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded p-1 text-taupe hover:bg-cream/60"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error ? (
              <p className="mt-3 text-sm text-dusty-rose" role="alert">
                {error}
              </p>
            ) : null}

            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-taupe">Scheduled</dt>
                <dd className="text-ink">
                  {formatBookingDateTime(
                    selected.scheduledAt,
                    selected.timezone,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-taupe">Email</dt>
                <dd>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-gold hover:underline"
                  >
                    {selected.email}
                  </a>
                </dd>
              </div>
              {selected.phone ? (
                <div>
                  <dt className="text-taupe">Phone</dt>
                  <dd className="text-ink">{selected.phone}</dd>
                </div>
              ) : null}
              {selected.serviceName ? (
                <div>
                  <dt className="text-taupe">Service</dt>
                  <dd className="text-ink">{selected.serviceName}</dd>
                </div>
              ) : null}
              {selected.description ? (
                <div>
                  <dt className="text-taupe">Description</dt>
                  <dd className="text-ink">{selected.description}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-taupe">Created</dt>
                <dd className="text-ink">
                  {formatAdminDate(selected.createdAt)}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <StatusBadge status={selected.status} />
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-taupe">
                Update status
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "Confirmed",
                    "In Progress",
                    "Completed",
                    "Cancelled",
                    "No Show",
                  ] as BookingStatus[]
                ).map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant={
                      selected.status === status ? "gold" : "outline"
                    }
                    size="sm"
                    loading={loading}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
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

            <div className="mt-6 border-t border-taupe/15 pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-dusty-rose"
                onClick={() => setDeleteTarget(selected)}
              >
                Delete booking
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete booking"
        description={`Permanently delete booking ${deleteTarget?.reference}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
