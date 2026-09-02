"use client";

import { Button } from "@/components/ui/Button";
import { DAY_LABELS } from "@/lib/admin-utils";
import type { TimeRange, WeeklyHoursEntry } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { FormField, inputClassName } from "./FormField";

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

export interface WeeklyHoursEditorProps {
  value: WeeklyHoursEntry[];
  onChange: (hours: WeeklyHoursEntry[]) => void;
}

function getDayEntry(
  hours: WeeklyHoursEntry[],
  dayOfWeek: number,
): WeeklyHoursEntry | undefined {
  return hours.find((h) => h.dayOfWeek === dayOfWeek);
}

function updateDay(
  hours: WeeklyHoursEntry[],
  dayOfWeek: number,
  ranges: TimeRange[],
): WeeklyHoursEntry[] {
  const filtered = hours.filter((h) => h.dayOfWeek !== dayOfWeek);
  if (ranges.length === 0) return filtered;
  return [...filtered, { dayOfWeek, ranges }].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek,
  );
}

export function WeeklyHoursEditor({ value, onChange }: WeeklyHoursEditorProps) {
  return (
    <div className="space-y-4">
      {ALL_DAYS.map((day) => {
        const entry = getDayEntry(value, day);
        const enabled = Boolean(entry);
        const ranges = entry?.ranges ?? [{ start: "09:00", end: "17:00" }];

        return (
          <div
            key={day}
            className="rounded-lg border border-taupe/20 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange(
                        updateDay(value, day, [{ start: "09:00", end: "17:00" }]),
                      );
                    } else {
                      onChange(updateDay(value, day, []));
                    }
                  }}
                  className="rounded border-taupe/40 text-gold focus:ring-gold"
                />
                {DAY_LABELS[day]}
              </label>
              {enabled ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newRanges = [
                      ...ranges,
                      { start: "13:00", end: "17:00" },
                    ];
                    onChange(updateDay(value, day, newRanges));
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add range
                </Button>
              ) : (
                <span className="text-xs text-taupe">Unavailable</span>
              )}
            </div>

            {enabled ? (
              <div className="mt-3 space-y-2">
                {ranges.map((range, idx) => (
                  <div key={idx} className="flex items-end gap-3">
                    <FormField label="Start" className="flex-1">
                      <input
                        type="time"
                        value={range.start}
                        onChange={(e) => {
                          const updated = [...ranges];
                          updated[idx] = { ...range, start: e.target.value };
                          onChange(updateDay(value, day, updated));
                        }}
                        className={inputClassName}
                      />
                    </FormField>
                    <FormField label="End" className="flex-1">
                      <input
                        type="time"
                        value={range.end}
                        onChange={(e) => {
                          const updated = [...ranges];
                          updated[idx] = { ...range, end: e.target.value };
                          onChange(updateDay(value, day, updated));
                        }}
                        className={inputClassName}
                      />
                    </FormField>
                    {ranges.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = ranges.filter((_, i) => i !== idx);
                          onChange(updateDay(value, day, updated));
                        }}
                        aria-label="Remove time range"
                      >
                        <Trash2 className="h-4 w-4 text-dusty-rose" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
