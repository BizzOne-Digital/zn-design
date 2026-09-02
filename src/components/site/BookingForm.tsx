"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { createBooking } from "@/actions/booking";
import {
  bookingStep1Schema,
  bookingStep2Schema,
  bookingStep3Schema,
  BUDGET_RANGES,
  PROJECT_TYPES,
  REFERRAL_SOURCES,
  TIMELINE_OPTIONS,
  type BookingSubmissionInput,
} from "@/lib/validations/booking";
import { siteConfig } from "@/config/site";
import type { SerializedService } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

interface BookingSlot {
  start: string;
  end: string;
  startLocal: string;
  endLocal: string;
}

export interface BookingFormProps {
  services: SerializedService[];
  preselectedServiceSlug?: string;
  timezone?: string;
}

type Step = 1 | 2 | 3 | 4;

const stepLabels = ["Service", "Schedule", "Details", "Review"] as const;

export function BookingForm({
  services,
  preselectedServiceSlug = "",
  timezone = siteConfig.timezone,
}: BookingFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<Partial<BookingSubmissionInput>>({
    timezone,
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const preselectedService = useMemo(
    () => services.find((service) => service.slug === preselectedServiceSlug),
    [services, preselectedServiceSlug],
  );

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm<BookingSubmissionInput>({
    defaultValues: {
      serviceId: preselectedService?._id ?? "",
      serviceName: preselectedService?.title ?? "",
      timezone,
      clientName: "",
      email: "",
      phone: "",
      businessName: "",
      website: "",
      projectType: undefined,
      budgetRange: undefined,
      timeline: undefined,
      description: "",
      referralSource: undefined,
    },
  });

  useEffect(() => {
    if (preselectedService) {
      setValue("serviceId", preselectedService._id);
      setValue("serviceName", preselectedService.title);
    }
  }, [preselectedService, setValue]);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    const loadSlots = async () => {
      setSlotsLoading(true);
      try {
        const startDate = new Date(`${selectedDate}T00:00:00`);
        const endDate = new Date(`${selectedDate}T23:59:59`);
        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        const response = await fetch(`/api/bookings/slots?${params.toString()}`);
        if (!response.ok) {
          setSlots([]);
          return;
        }
        const data = (await response.json()) as {
          data?: { slots: BookingSlot[] };
          slots?: BookingSlot[];
        };
        const nextSlots = data.data?.slots ?? data.slots ?? [];
        setSlots(nextSlots);
      } finally {
        setSlotsLoading(false);
      }
    };

    void loadSlots();
  }, [selectedDate]);

  const serviceOptions = [
    { value: "not-sure", label: "Not sure yet" },
    ...services.map((service) => ({
      value: service._id,
      label: service.title,
    })),
  ];

  const goToNextStep = () => {
    setServerError(null);
    clearErrors();
    const values = getValues();

    if (step === 1) {
      const parsed = bookingStep1Schema.safeParse(values);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          const field = issue.path[0];
          if (typeof field === "string") {
            setError(field as keyof BookingSubmissionInput, {
              message: issue.message,
            });
          }
        });
        return;
      }
      setFormData((current) => ({ ...current, ...parsed.data }));
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!selectedSlot) {
        setServerError("Please select an available time slot.");
        return;
      }
      const scheduledAt = new Date(selectedSlot);
      const parsed = bookingStep2Schema.safeParse({
        scheduledAt,
        timezone,
      });
      if (!parsed.success) {
        setServerError(parsed.error.issues[0]?.message ?? "Invalid schedule.");
        return;
      }
      setFormData((current) => ({ ...current, ...parsed.data }));
      setStep(3);
      return;
    }

    if (step === 3) {
      const parsed = bookingStep3Schema.safeParse(values);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          const field = issue.path[0];
          if (typeof field === "string") {
            setError(field as keyof BookingSubmissionInput, {
              message: issue.message,
            });
          }
        });
        return;
      }
      setFormData((current) => ({ ...current, ...parsed.data }));
      setStep(4);
    }
  };

  const submitBooking = async () => {
    setSubmitting(true);
    setServerError(null);

    const payload = {
      ...formData,
      ...getValues(),
      scheduledAt: formData.scheduledAt,
      timezone,
    } as BookingSubmissionInput;

    const result = await createBooking(payload);

    if (!result.success) {
      setServerError(result.error);
      setSubmitting(false);
      return;
    }

    setReference(result.data.reference);
    setSubmitting(false);
    reset();
  };

  if (reference) {
    return (
      <div
        role="status"
        className="rounded-[1.5rem] border border-gold/30 bg-cream/50 px-8 py-10 text-center"
      >
        <p className="font-display text-3xl text-ink">Booking confirmed</p>
        <p className="mt-3 text-sm text-soft-black/75">
          Your consultation has been scheduled. Reference:{" "}
          <strong>{reference}</strong>
        </p>
        <p className="mt-2 text-sm text-soft-black/70">
          A confirmation email will be sent if email delivery is configured.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-8 flex flex-wrap gap-2 sm:mb-10 sm:gap-3">
        {stepLabels.map((label, index) => {
          const stepNumber = (index + 1) as Step;
          const isActive = step === stepNumber;
          const isComplete = step > stepNumber;

          return (
            <li
              key={label}
              className={cn(
                "rounded-full px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] sm:px-4 sm:text-xs sm:tracking-[0.14em]",
                isActive
                  ? "bg-ink text-ivory"
                  : isComplete
                    ? "bg-gold/15 text-gold"
                    : "bg-cream text-taupe",
              )}
            >
              {index + 1}. {label}
            </li>
          );
        })}
      </ol>

      {step === 1 ? (
        <form onSubmit={(event) => { event.preventDefault(); goToNextStep(); }} className="space-y-6" noValidate>
          <div>
            <Label htmlFor="booking-service" required>
              Select a service
            </Label>
            <Select
              id="booking-service"
              options={serviceOptions}
              {...register("serviceId", {
                onChange: (event) => {
                  const value = event.target.value;
                  if (value === "not-sure") {
                    setValue("serviceId", "");
                    setValue("serviceName", "Not sure yet");
                    return;
                  }
                  const service = services.find((item) => item._id === value);
                  setValue("serviceId", value);
                  setValue("serviceName", service?.title ?? "");
                },
              })}
              error={errors.serviceName?.message}
            />
            <input type="hidden" {...register("serviceName")} />
          </div>
          <Button type="submit" variant="gold">
            Continue
          </Button>
        </form>
      ) : null}

      {step === 2 ? (
        <form onSubmit={(event) => { event.preventDefault(); goToNextStep(); }} className="space-y-6" noValidate>
          <div>
            <Label htmlFor="booking-date" required>
              Preferred date
            </Label>
            <Input
              id="booking-date"
              type="date"
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setSelectedSlot("");
              }}
              min={format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div>
            <Label required>Available time slots</Label>
            {slotsLoading ? (
              <p className="text-sm text-taupe">Loading available slots…</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-taupe">
                {selectedDate
                  ? "No available slots for this date. Please choose another day."
                  : "Select a date to view available times."}
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => setSelectedSlot(slot.start)}
                    className={cn(
                      "min-h-11 rounded-xl border px-4 py-3 text-sm transition-colors",
                      selectedSlot === slot.start
                        ? "border-ink bg-ink text-ivory"
                        : "border-taupe/25 bg-ivory hover:border-gold",
                    )}
                  >
                    {slot.startLocal}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" variant="gold" className="w-full sm:w-auto">
              Continue
            </Button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <form onSubmit={(event) => { event.preventDefault(); goToNextStep(); }} className="space-y-6" noValidate>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="booking-name" required>
                Name
              </Label>
              <Input
                id="booking-name"
                {...register("clientName")}
                error={errors.clientName?.message}
              />
            </div>
            <div>
              <Label htmlFor="booking-email" required>
                Email
              </Label>
              <Input
                id="booking-email"
                type="email"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="booking-phone" required>
                Phone
              </Label>
              <Input
                id="booking-phone"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </div>
            <div>
              <Label htmlFor="booking-business">Business name</Label>
              <Input id="booking-business" {...register("businessName")} />
            </div>
          </div>

          <div>
            <Label htmlFor="booking-website">Website or social link</Label>
            <Input id="booking-website" {...register("website")} />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <Label htmlFor="booking-project-type" required>
                Project type
              </Label>
              <Select
                id="booking-project-type"
                options={PROJECT_TYPES.map((value) => ({ value, label: value }))}
                placeholder="Select project type"
                {...register("projectType")}
                error={errors.projectType?.message}
              />
            </div>
            <div>
              <Label htmlFor="booking-budget" required>
                Budget range
              </Label>
              <Select
                id="booking-budget"
                options={BUDGET_RANGES.map((value) => ({ value, label: value }))}
                placeholder="Select budget"
                {...register("budgetRange")}
                error={errors.budgetRange?.message}
              />
            </div>
            <div>
              <Label htmlFor="booking-timeline" required>
                Timeline
              </Label>
              <Select
                id="booking-timeline"
                options={TIMELINE_OPTIONS.map((value) => ({ value, label: value }))}
                placeholder="Select timeline"
                {...register("timeline")}
                error={errors.timeline?.message}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="booking-description" required>
              Project description
            </Label>
            <Textarea
              id="booking-description"
              rows={5}
              {...register("description")}
              error={errors.description?.message}
            />
          </div>

          <div>
            <Label htmlFor="booking-referral" required>
              How did you hear about us?
            </Label>
            <Select
              id="booking-referral"
              options={REFERRAL_SOURCES.map((value) => ({ value, label: value }))}
              placeholder="Select referral source"
              {...register("referralSource")}
              error={errors.referralSource?.message}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button type="submit" variant="gold" className="w-full sm:w-auto">
              Review booking
            </Button>
          </div>
        </form>
      ) : null}

      {step === 4 ? (
        <div className="space-y-6">
          <div className="rounded-[1.25rem] border border-taupe/15 bg-cream/40 p-6 text-sm">
            <p>
              <strong>Service:</strong> {formData.serviceName}
            </p>
            <p className="mt-2">
              <strong>Date & time:</strong>{" "}
              {formData.scheduledAt
                ? format(new Date(formData.scheduledAt), "PPP p")
                : "—"}
            </p>
            <p className="mt-2">
              <strong>Name:</strong> {getValues("clientName")}
            </p>
            <p className="mt-2">
              <strong>Email:</strong> {getValues("email")}
            </p>
            <p className="mt-2">
              <strong>Project type:</strong> {getValues("projectType")}
            </p>
          </div>

          {serverError ? (
            <p role="alert" className="text-sm text-dusty-rose">
              {serverError}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button
              type="button"
              variant="gold"
              className="w-full sm:w-auto"
              loading={submitting}
              onClick={submitBooking}
            >
              Confirm booking
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
