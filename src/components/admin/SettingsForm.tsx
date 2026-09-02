"use client";

import { updateSiteSettings } from "@/actions/admin/settings";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField, inputClassName, textareaClassName } from "./FormField";
import { ImageUpload } from "./ImageUpload";

export interface SettingsFormProps {
  initialData: SiteSettingsInput;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: initialData,
  });

  const logo = watch("logo");
  const favicon = watch("favicon");
  const ogImage = watch("ogImage");
  const aboutImage = watch("aboutImage");
  const maintenanceEnabled = watch("maintenanceBanner.enabled");

  async function onSubmit(data: SiteSettingsInput) {
    setFormError(null);
    setSuccess(false);

    const result = await updateSiteSettings(data);
    if (!result.success) {
      setFormError(result.error);
      return;
    }

    setSuccess(true);
    router.refresh();
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
          Settings saved successfully.
        </div>
      ) : null}

      <section className="space-y-4 rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Business details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Business name" required error={errors.businessName?.message}>
            <input {...register("businessName")} className={inputClassName} />
          </FormField>
          <FormField label="Contact person" required error={errors.contactPerson?.message}>
            <input {...register("contactPerson")} className={inputClassName} />
          </FormField>
          <FormField label="Email" required error={errors.email?.message}>
            <input type="email" {...register("email")} className={inputClassName} />
          </FormField>
          <FormField label="Notification email" required error={errors.notificationEmail?.message}>
            <input type="email" {...register("notificationEmail")} className={inputClassName} />
          </FormField>
          <FormField label="Phone" required error={errors.phone?.message}>
            <input {...register("phone")} className={inputClassName} />
          </FormField>
          <FormField label="Phone link" required error={errors.phoneLink?.message}>
            <input {...register("phoneLink")} className={inputClassName} />
          </FormField>
          <FormField label="Address" className="md:col-span-2" error={errors.address?.message}>
            <input {...register("address")} className={inputClassName} />
          </FormField>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Hero section</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Eyebrow" error={errors.heroEyebrow?.message}>
            <input {...register("heroEyebrow")} className={inputClassName} />
          </FormField>
          <FormField label="Headline" error={errors.heroHeadline?.message}>
            <input {...register("heroHeadline")} className={inputClassName} />
          </FormField>
          <FormField label="Support text" className="md:col-span-2" error={errors.heroSupport?.message}>
            <textarea {...register("heroSupport")} className={textareaClassName} rows={3} />
          </FormField>
          <FormField label="Primary CTA" error={errors.heroCtaPrimary?.message}>
            <input {...register("heroCtaPrimary")} className={inputClassName} />
          </FormField>
          <FormField label="Secondary CTA" error={errors.heroCtaSecondary?.message}>
            <input {...register("heroCtaSecondary")} className={inputClassName} />
          </FormField>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Content</h2>
        <FormField label="About text" error={errors.aboutText?.message}>
          <textarea {...register("aboutText")} className={textareaClassName} rows={6} />
        </FormField>
        <FormField label="Intro offer text" error={errors.introOfferText?.message}>
          <textarea {...register("introOfferText")} className={textareaClassName} rows={4} />
        </FormField>
        <FormField label="Footer text" error={errors.footerText?.message}>
          <input {...register("footerText")} className={inputClassName} />
        </FormField>
        <FormField label="Booking timezone" required error={errors.bookingTimezone?.message}>
          <input {...register("bookingTimezone")} className={inputClassName} placeholder="America/New_York" />
        </FormField>
      </section>

      <section className="space-y-4 rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Social links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(["instagram", "facebook", "linkedin", "pinterest", "behance", "dribbble"] as const).map(
            (platform) => (
              <FormField key={platform} label={platform}>
                <input
                  {...register(`socialLinks.${platform}`)}
                  type="url"
                  className={inputClassName}
                  placeholder={`https://${platform}.com/...`}
                />
              </FormField>
            ),
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">SEO defaults</h2>
        <FormField label="Default title" error={errors.seoDefaults?.title?.message}>
          <input {...register("seoDefaults.title")} className={inputClassName} />
        </FormField>
        <FormField label="Default description" error={errors.seoDefaults?.description?.message}>
          <textarea {...register("seoDefaults.description")} className={textareaClassName} rows={2} />
        </FormField>
      </section>

      <section className="space-y-4 rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Images</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUpload label="Logo" value={logo} onChange={(v) => setValue("logo", v ?? undefined)} folder="zn-design/brand" />
          <ImageUpload label="Favicon" value={favicon} onChange={(v) => setValue("favicon", v ?? undefined)} folder="zn-design/brand" />
          <ImageUpload label="OG image" value={ogImage} onChange={(v) => setValue("ogImage", v ?? undefined)} folder="zn-design/brand" />
          <ImageUpload label="About image" value={aboutImage} onChange={(v) => setValue("aboutImage", v ?? undefined)} folder="zn-design/brand" />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Maintenance banner</h2>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            {...register("maintenanceBanner.enabled")}
            className="rounded border-taupe/40 text-gold focus:ring-gold"
          />
          Enable maintenance banner
        </label>
        {maintenanceEnabled ? (
          <FormField label="Banner content" error={errors.maintenanceBanner?.content?.message}>
            <textarea
              {...register("maintenanceBanner.content")}
              className={textareaClassName}
              rows={2}
              placeholder="We're currently updating the site..."
            />
          </FormField>
        ) : null}
      </section>

      <section className="space-y-4 rounded-xl border border-taupe/20 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Legal pages</h2>
        <FormField label="Privacy policy" error={errors.privacyContent?.message}>
          <textarea {...register("privacyContent")} className={textareaClassName} rows={8} />
        </FormField>
        <FormField label="Terms of service" error={errors.termsContent?.message}>
          <textarea {...register("termsContent")} className={textareaClassName} rows={8} />
        </FormField>
      </section>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          Save settings
        </Button>
      </div>
    </form>
  );
}
