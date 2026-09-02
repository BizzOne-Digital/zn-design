import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid identifier");

const optionalObjectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid identifier")
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined);

const mediaImageSchema = z.object({
  url: z.string().url("Image URL must be valid"),
  publicId: z.string().trim().min(1, "Image public ID is required"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z
    .string()
    .trim()
    .min(1, "Alt text is required")
    .max(500, "Alt text must be 500 characters or fewer"),
  dominantColor: z.string().trim().max(20).optional(),
});

const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("full-width-image"),
    image: mediaImageSchema,
    caption: z.string().trim().max(500).optional(),
    displayOrder: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal("two-column-images"),
    leftImage: mediaImageSchema,
    rightImage: mediaImageSchema,
    leftCaption: z.string().trim().max(500).optional(),
    rightCaption: z.string().trim().max(500).optional(),
    displayOrder: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal("text-image"),
    heading: z.string().trim().max(200).optional(),
    body: z.string().trim().min(1).max(5000),
    image: mediaImageSchema,
    imagePosition: z.enum(["left", "right"]).default("right"),
    displayOrder: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal("color-palette"),
    heading: z.string().trim().max(200).optional(),
    colors: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(80),
          hex: z
            .string()
            .trim()
            .regex(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/, "Invalid hex color"),
        }),
      )
      .min(1)
      .max(12),
    displayOrder: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal("typography"),
    heading: z.string().trim().max(200).optional(),
    samples: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(120),
          fontFamily: z.string().trim().min(1).max(120),
          fontWeight: z.string().trim().max(40).optional(),
          fontSize: z.string().trim().max(40).optional(),
          sampleText: z.string().trim().max(500).optional(),
        }),
      )
      .min(1)
      .max(6),
    displayOrder: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal("quote"),
    quote: z.string().trim().min(1).max(1000),
    attribution: z.string().trim().max(200).optional(),
    displayOrder: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal("video-embed"),
    url: z.string().url("Embed URL must be valid"),
    title: z.string().trim().max(200).optional(),
    provider: z.enum(["youtube", "vimeo", "other"]).optional(),
    displayOrder: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal("final-result"),
    heading: z.string().trim().max(200).optional(),
    body: z.string().trim().max(5000).optional(),
    images: z.array(mediaImageSchema).max(6).default([]),
    displayOrder: z.number().int().min(0).optional(),
  }),
]);

const projectCategories = [
  "Branding",
  "Logo Design",
  "Social Media",
  "Print",
  "Packaging",
  "Banners",
  "Visual Design",
  "Custom",
] as const;

const bookingStatuses = [
  "New",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
  "No Show",
] as const;

const contactStatuses = ["new", "read", "archived"] as const;

const timeRangeSchema = z.object({
  start: z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm format"),
  end: z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm format"),
});

const weeklyHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  ranges: z.array(timeRangeSchema).min(1).max(4),
});

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must use lowercase letters, numbers, and hyphens",
  );

export const createProjectSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: slugSchema,
  category: z.enum(projectCategories),
  shortDescription: z.string().trim().min(10).max(300),
  client: z.string().trim().max(120).optional(),
  year: z.number().int().min(2000).max(2100),
  services: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  coverImage: mediaImageSchema,
  gallery: z.array(mediaImageSchema).max(30).default([]),
  contentBlocks: z.array(contentBlockSchema).max(40).default([]),
  challenge: z.string().trim().max(5000).optional(),
  strategy: z.string().trim().max(5000).optional(),
  creativeDirection: z.string().trim().max(5000).optional(),
  solution: z.string().trim().max(5000).optional(),
  result: z.string().trim().max(5000).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
  aspectRatio: z.string().trim().max(20).optional(),
  isSample: z.boolean().default(false),
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .extend({
    id: objectIdSchema,
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field must be provided",
  });

export const deleteProjectSchema = z.object({
  id: objectIdSchema,
  confirmDelete: z.literal(true, {
    errorMap: () => ({ message: "Deletion must be confirmed" }),
  }),
});

export const createServiceSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: slugSchema,
  shortDescription: z.string().trim().min(10).max(300),
  fullDescription: z.string().trim().min(20).max(10000),
  deliverables: z.array(z.string().trim().min(1).max(200)).min(1).max(30),
  processNotes: z.string().trim().max(5000).optional(),
  featuredImage: mediaImageSchema.optional(),
  gallery: z.array(mediaImageSchema).max(20).default([]),
  displayOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
});

export const updateServiceSchema = createServiceSchema
  .partial()
  .extend({
    id: objectIdSchema,
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field must be provided",
  });

export const deleteServiceSchema = z.object({
  id: objectIdSchema,
  confirmDelete: z.literal(true, {
    errorMap: () => ({ message: "Deletion must be confirmed" }),
  }),
});

export const createPricingPackageSchema = z.object({
  title: z.string().trim().min(2).max(120),
  subtitle: z.string().trim().max(200).optional(),
  description: z.string().trim().min(10).max(5000),
  deliverables: z.array(z.string().trim().min(1).max(200)).min(1).max(30),
  idealFor: z.string().trim().max(500).optional(),
  priceLabel: z.string().trim().max(80).optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const updatePricingPackageSchema = createPricingPackageSchema
  .partial()
  .extend({
    id: objectIdSchema,
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field must be provided",
  });

export const deletePricingPackageSchema = z.object({
  id: objectIdSchema,
  confirmDelete: z.literal(true, {
    errorMap: () => ({ message: "Deletion must be confirmed" }),
  }),
});

export const createTestimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  businessRole: z.string().trim().max(160).optional(),
  quote: z.string().trim().min(10).max(2000),
  clientImage: mediaImageSchema.optional(),
  relatedProject: optionalObjectIdSchema,
  showRating: z.boolean().default(false),
  rating: z.number().int().min(1).max(5).optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
  isSample: z.boolean().default(false),
});

export const updateTestimonialSchema = createTestimonialSchema
  .partial()
  .extend({
    id: objectIdSchema,
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field must be provided",
  });

export const deleteTestimonialSchema = z.object({
  id: objectIdSchema,
  confirmDelete: z.literal(true, {
    errorMap: () => ({ message: "Deletion must be confirmed" }),
  }),
});

export const updateBookingStatusSchema = z.object({
  id: objectIdSchema,
  status: z.enum(bookingStatuses),
});

export const rescheduleBookingSchema = z.object({
  id: objectIdSchema,
  scheduledAt: z.coerce.date({
    invalid_type_error: "Select a valid date and time",
  }),
  timezone: z.string().trim().min(1).max(80),
});

export const updateBookingNotesSchema = z.object({
  id: objectIdSchema,
  internalNotes: z.string().trim().max(10000),
});

export const deleteBookingSchema = z.object({
  id: objectIdSchema,
  confirmDelete: z.literal(true, {
    errorMap: () => ({ message: "Deletion must be confirmed" }),
  }),
});

export const updateAvailabilitySchema = z.object({
  timezone: z.string().trim().min(1).max(80),
  slotDurationMinutes: z.number().int().min(15).max(240),
  leadTimeHours: z.number().int().min(0).max(720),
  bookingHorizonDays: z.number().int().min(1).max(365),
  weeklyHours: z.array(weeklyHoursSchema).min(1).max(7),
  blackoutDates: z.array(z.coerce.date()).max(120).default([]),
});

export const updateInquirySchema = z.object({
  id: objectIdSchema,
  status: z.enum(contactStatuses).optional(),
  internalNotes: z.string().trim().max(10000).optional(),
});

export const siteSettingsSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  contactPerson: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(30),
  phoneLink: z.string().trim().min(7).max(40),
  address: z.string().trim().max(300).optional(),
  socialLinks: z
    .object({
      instagram: z.string().url().optional().or(z.literal("")),
      facebook: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      pinterest: z.string().url().optional().or(z.literal("")),
      behance: z.string().url().optional().or(z.literal("")),
      dribbble: z.string().url().optional().or(z.literal("")),
    })
    .partial()
    .optional(),
  heroEyebrow: z.string().trim().max(120).optional(),
  heroHeadline: z.string().trim().max(200).optional(),
  heroSupport: z.string().trim().max(1000).optional(),
  heroCtaPrimary: z.string().trim().max(80).optional(),
  heroCtaSecondary: z.string().trim().max(80).optional(),
  aboutText: z.string().trim().max(10000).optional(),
  introOfferText: z.string().trim().max(2000).optional(),
  bookingTimezone: z.string().trim().min(1).max(80),
  notificationEmail: z.string().trim().email(),
  footerText: z.string().trim().max(500).optional(),
  seoDefaults: z
    .object({
      title: z.string().trim().max(160).optional(),
      description: z.string().trim().max(320).optional(),
    })
    .optional(),
  logo: mediaImageSchema.optional(),
  favicon: mediaImageSchema.optional(),
  ogImage: mediaImageSchema.optional(),
  maintenanceBanner: z
    .object({
      enabled: z.boolean(),
      content: z.string().trim().max(500).optional(),
    })
    .optional(),
  privacyContent: z.string().trim().max(50000).optional(),
  termsContent: z.string().trim().max(50000).optional(),
  aboutImage: mediaImageSchema.optional(),
});

export const uploadSignatureSchema = z.object({
  folder: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-zA-Z0-9/_-]+$/, "Invalid folder name")
    .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CreatePricingPackageInput = z.infer<typeof createPricingPackageSchema>;
export type UpdatePricingPackageInput = z.infer<typeof updatePricingPackageSchema>;
export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
