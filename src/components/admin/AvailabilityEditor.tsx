"use client";

import { updateAvailability } from "@/actions/admin/availability";
import { FormField, inputClassName, selectClassName } from "@/components/admin/FormField";
import { WeeklyHoursEditor } from "@/components/admin/WeeklyHoursEditor";
import { Button } from "@/components/ui/Button";
import { generateAvailableSlots } from "@/lib/booking-slots";
import {
  updateAvailabilitySchema,
  type UpdateAvailabilityInput,
} from "@/lib/validations/admin";
import type { WeeklyHoursEntry } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatInTimeZone } from "date-fns-tz";
import { useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";

export interface AvailabilityEditorProps {
  initialData: UpdateAvailabilityInput;
}

export function AvailabilityEditor({ initialData }: AvailabilityEditorProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [blackoutInput, setBlackoutInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAvailabilityInput>({
    resolver: zodResolver(updateAvailabilitySchema) as Resolver<UpdateAvailabilityInput>,
    defaultValues: initialData,
  });

  const weeklyHours = watch("weeklyHours");
  const timezone = watch("timezone");
  const slotDuration = watch("slotDurationMinutes");
  const leadTime = watch("leadTimeHours");
  const horizon = watch("bookingHorizonDays");
  const blackoutDates = watch("blackoutDates");

  const previewSlots = useMemo(() => {
    try {
      const slots = generateAvailableSlots({
        rule: {
          timezone,
          slotDurationMinutes: slotDuration,
          leadTimeHours: leadTime,
          bookingHorizonDays: Math.min(horizon, 14),
          weeklyHours,
          blackoutDates: blackoutDates.map((d) =>
            d instanceof Date ? d : new Date(d),
          ),
        },
        existingBookings: [],
      });
      return slots.slice(0, 12);
    } catch {
      return [];
    }
  }, [timezone, slotDuration, leadTime, horizon, weeklyHours, blackoutDates]);

  function addBlackoutDate() {
    if (!blackoutInput) return;
    const date = new Date(blackoutInput);
    const current = blackoutDates.map((d) =>
      d instanceof Date ? d : new Date(d),
    );
    if (current.some((d) => d.toDateString() === date.toDateString())) return;
    setValue("blackoutDates", [...current, date]);
    setBlackoutInput("");
  }

  function removeBlackout(index: number) {
    const current = blackoutDates.map((d) =>
      d instanceof Date ? d : new Date(d),
    );
    setValue(
      "blackoutDates",
      current.filter((_, i) => i !== index),
    );
  }

  async function onSubmit(data: UpdateAvailabilityInput) {
    setFormError(null);
    setSuccess(false);

    const result = await updateAvailability(data);
    if (!result.success) {
      setFormError(result.error);
      return;
    }

    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {formError ? (
        <div className="rounded-lg border border-dusty-rose/30 bg-red-50 px-4 py-3 text-sm text-dusty-rose">
          {formError}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Availability settings saved.
        </div>
      ) : null}

      <section className="rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Booking rules</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField label="Timezone" required error={errors.timezone?.message}>
            <input {...register("timezone")} className={inputClassName} />
          </FormField>
          <FormField
            label="Slot duration (minutes)"
            required
            error={errors.slotDurationMinutes?.message}
          >
            <select
              {...register("slotDurationMinutes", { valueAsNumber: true })}
              className={selectClassName}
            >
              {[15, 30, 45, 60, 90, 120].map((m) => (
                <option key={m} value={m}>
                  {m} minutes
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Lead time (hours)"
            required
            error={errors.leadTimeHours?.message}
          >
            <input
              type="number"
              {...register("leadTimeHours", { valueAsNumber: true })}
              className={inputClassName}
              min={0}
            />
          </FormField>
          <FormField
            label="Booking horizon (days)"
            required
            error={errors.bookingHorizonDays?.message}
          >
            <input
              type="number"
              {...register("bookingHorizonDays", { valueAsNumber: true })}
              className={inputClassName}
              min={1}
              max={365}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Weekly hours</h2>
        <div className="mt-4">
          <WeeklyHoursEditor
            value={weeklyHours as WeeklyHoursEntry[]}
            onChange={(hours) => setValue("weeklyHours", hours)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Blackout dates</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            type="date"
            value={blackoutInput}
            onChange={(e) => setBlackoutInput(e.target.value)}
            className={inputClassName + " w-auto"}
          />
          <Button type="button" variant="outline" size="sm" onClick={addBlackoutDate}>
            Add date
          </Button>
        </div>
        {blackoutDates.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {blackoutDates.map((date, i) => {
              const d = date instanceof Date ? date : new Date(date);
              return (
                <li
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-cream/60 px-3 py-1.5 text-sm"
                >
                  {d.toLocaleDateString()}
                  <button
                    type="button"
                    onClick={() => removeBlackout(i)}
                    className="text-dusty-rose hover:underline"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-taupe">No blackout dates set.</p>
        )}
      </section>

      <section className="rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Slot preview</h2>
        <p className="mt-1 text-sm text-taupe">
          Next available slots based on current settings (no existing bookings).
        </p>
        {previewSlots.length > 0 ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {previewSlots.map((slot) => (
              <li
                key={slot.start.toISOString()}
                className="rounded-lg border border-taupe/15 bg-cream/30 px-3 py-2 text-sm"
              >
                {formatInTimeZone(
                  slot.start,
                  timezone,
                  "EEE d MMM, h:mm a",
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-taupe">
            No slots available with current settings.
          </p>
        )}
      </section>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          Save availability
        </Button>
      </div>
    </form>
  );
}
