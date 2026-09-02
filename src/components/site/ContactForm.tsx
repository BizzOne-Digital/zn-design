"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContactSubmission } from "@/actions/contact";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/validations/contact";
import { BUDGET_RANGES, TIMELINE_OPTIONS } from "@/lib/validations/booking";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import type { SerializedService } from "@/lib/data";

export interface ContactFormProps {
  services?: SerializedService[];
  defaultService?: string;
}

export function ContactForm({
  services = [],
  defaultService = "",
}: ContactFormProps) {
  const [submitState, setSubmitState] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      business: "",
      serviceInterest: defaultService,
      budgetRange: undefined,
      timeline: undefined,
      message: "",
      consent: undefined,
      honeypot: "",
    },
  });

  const serviceOptions = [
    { value: "", label: "Select a service (optional)" },
    ...services.map((service) => ({
      value: service.title,
      label: service.title,
    })),
  ];

  const onSubmit = async (data: ContactFormInput) => {
    setServerError(null);
    const result = await createContactSubmission(data);

    if (!result.success) {
      setSubmitState("error");
      setServerError(result.error);
      return;
    }

    setSubmitState("success");
    reset();
  };

  if (submitState === "success") {
    return (
      <div
        role="status"
        className="rounded-[1.5rem] border border-gold/30 bg-cream/50 px-8 py-10 text-center"
      >
        <p className="font-display text-3xl text-ink">Message sent</p>
        <p className="mt-3 text-sm text-soft-black/75">
          Thank you for reaching out. ZN Design will get back to you soon.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitState("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="hidden" aria-hidden="true">
        <Input {...register("honeypot")} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="contact-name" required className="mb-2">
            Name
          </Label>
          <Input
            id="contact-name"
            {...register("name")}
            error={errors.name?.message}
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="contact-email" required>
            Email
          </Label>
          <Input
            id="contact-email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            type="tel"
            {...register("phone")}
            error={errors.phone?.message}
            autoComplete="tel"
          />
        </div>
        <div>
          <Label htmlFor="contact-business">Business</Label>
          <Input
            id="contact-business"
            {...register("business")}
            error={errors.business?.message}
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="contact-service">Service interest</Label>
          <Select
            id="contact-service"
            options={serviceOptions}
            {...register("serviceInterest")}
            error={errors.serviceInterest?.message}
          />
        </div>
        <div>
          <Label htmlFor="contact-budget">Budget range</Label>
          <Select
            id="contact-budget"
            options={[
              { value: "", label: "Select budget" },
              ...BUDGET_RANGES.map((value) => ({ value, label: value })),
            ]}
            {...register("budgetRange")}
            error={errors.budgetRange?.message}
          />
        </div>
        <div>
          <Label htmlFor="contact-timeline">Timeline</Label>
          <Select
            id="contact-timeline"
            options={[
              { value: "", label: "Select timeline" },
              ...TIMELINE_OPTIONS.map((value) => ({ value, label: value })),
            ]}
            {...register("timeline")}
            error={errors.timeline?.message}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contact-message" required>
          Message
        </Label>
        <Textarea
          id="contact-message"
          rows={6}
          {...register("message")}
          error={errors.message?.message}
        />
      </div>

      <Checkbox
        id="contact-consent"
        label="I agree to be contacted about my inquiry and understand my information will be handled according to the privacy policy."
        {...register("consent")}
        error={errors.consent?.message}
      />

      {serverError ? (
        <p role="alert" className="text-sm text-dusty-rose">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" variant="gold" size="lg" loading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
}
