import { loadEnv } from "./load-env";

loadEnv();

import type { ContentBlock, MediaImage } from "../src/types";

const TIMEZONE = "America/New_York";

function unsplashImage(
  photoPath: string,
  alt: string,
  width = 1600,
  height = 1200,
): MediaImage {
  return {
    url: `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${width}&h=${height}&q=80`,
    publicId: `seed/unsplash/${photoPath.replace(/\//g, "-")}`,
    alt,
    width,
    height,
  };
}

function localImage(path: string, alt: string): MediaImage {
  return {
    url: path,
    publicId: path.replace(/^\//, "").replace(/\//g, "-"),
    alt,
  };
}

const siteSettingsData = {
  businessName: "ZN Design",
  contactPerson: "Zafreen Nihmathullah",
  email: "zafreennihmathullah@gmail.com",
  phone: "(508) 851-7086",
  phoneLink: "tel:+15088517086",
  address: "Massachusetts, United States",
  socialLinks: {
    instagram: "",
    behance: "",
    linkedin: "",
    pinterest: "",
  },
  heroEyebrow: "Creative Design Studio",
  heroHeadline: "Design that elevates your brand",
  heroSupport:
    "From logos and brand identity to social content, print, packaging, and custom graphics — crafted with strategy and style for businesses that want to stand out.",
  heroCtaPrimary: "Book a consultation",
  heroCtaSecondary: "View portfolio",
  aboutText:
    "ZN Design is a creative studio led by Zafreen Nihmathullah, helping brands communicate with clarity and confidence. Every project blends strategic thinking with polished visual execution — whether you need a new logo, a full brand system, campaign visuals, or ongoing creative support.",
  introOfferText:
    "Every project is scoped individually. Packages below are starting points — final pricing depends on scope, timeline, and deliverables. Request a custom quote to get started.",
  bookingTimezone: TIMEZONE,
  notificationEmail: "zafreennihmathullah@gmail.com",
  footerText: `© ${new Date().getFullYear()} ZN Design. All rights reserved.`,
  seoDefaults: {
    title: "ZN Design | Creative Brand & Visual Design Studio",
    description:
      "ZN Design helps businesses elevate their brand with thoughtful logo design, branding, social media visuals, print, packaging, and custom creative direction.",
    keywords: [
      "graphic design",
      "branding",
      "logo design",
      "social media design",
      "packaging design",
      "Massachusetts designer",
    ],
  },
  privacyContent: `# Privacy Policy

**Last updated:** ${new Date().toISOString().slice(0, 10)}

ZN Design ("we", "us", or "our") respects your privacy. This policy explains how we collect, use, and protect personal information submitted through our website.

## Information we collect

We may collect your name, email address, phone number, business name, project details, and booking preferences when you contact us, request a quote, or schedule a consultation.

## How we use your information

We use your information to respond to inquiries, provide design services, manage bookings, send service-related communications, and improve our website.

## Sharing

We do not sell your personal information. We may share data with trusted service providers (such as hosting, email, and file storage) only as needed to operate the site and deliver services.

## Data retention

We retain information for as long as needed to fulfill the purposes described in this policy, unless a longer retention period is required by law.

## Your rights

You may request access, correction, or deletion of your personal information by contacting us at zafreennihmathullah@gmail.com.

## Contact

ZN Design  
Email: zafreennihmathullah@gmail.com  
Phone: (508) 851-7086`,
  termsContent: `# Terms of Service

**Last updated:** ${new Date().toISOString().slice(0, 10)}

Welcome to ZN Design. By using this website or engaging our services, you agree to the following terms.

## Services

ZN Design provides creative design services including branding, logo design, social media graphics, print design, packaging, banners, and custom graphic design. Specific deliverables, timelines, and fees are defined in a written proposal or statement of work.

## Quotes and payment

Pricing shown on this site is indicative unless otherwise stated. Final fees are confirmed in writing before work begins. Payment terms will be outlined in your project agreement.

## Intellectual property

Upon full payment, you receive usage rights as defined in your project agreement. ZN Design retains the right to display completed work in our portfolio unless otherwise agreed in writing.

## Client responsibilities

You agree to provide timely feedback, content, and approvals so projects can stay on schedule. Delays in client input may affect delivery dates.

## Cancellations

Consultation bookings may be rescheduled according to our booking policy. Project cancellation terms are defined in your signed agreement.

## Limitation of liability

ZN Design is not liable for indirect, incidental, or consequential damages arising from use of this website or our services, to the fullest extent permitted by law.

## Contact

Questions about these terms: zafreennihmathullah@gmail.com`,
};

const servicesData = [
  {
    title: "Logo & Brand Identity",
    slug: "logo-brand-identity",
    shortDescription:
      "Distinctive logos and cohesive brand systems that make your business memorable.",
    fullDescription:
      "Build a brand that feels intentional from day one. We develop logo marks, color palettes, typography, and brand guidelines tailored to your audience and goals.",
    deliverables: [
      "Primary and secondary logo files",
      "Color and typography system",
      "Brand usage guidelines",
      "Social profile assets",
    ],
    featuredImage: localImage(
      "/images/services/logo-brand-identity.jpg",
      "Logo and brand identity design showcase",
    ),
    displayOrder: 1,
    featured: true,
  },
  {
    title: "Social Media",
    slug: "social-media",
    shortDescription:
      "Scroll-stopping templates and campaign visuals for consistent social presence.",
    fullDescription:
      "Stay on-brand across every platform with reusable templates, launch graphics, and content kits designed for engagement.",
    deliverables: [
      "Post and story templates",
      "Campaign launch graphics",
      "Highlight covers and profile assets",
      "Editable source files",
    ],
    featuredImage: localImage(
      "/images/services/social-media.jpg",
      "Social media design templates on devices",
    ),
    displayOrder: 2,
    featured: true,
  },
  {
    title: "Print",
    slug: "print",
    shortDescription:
      "Business cards, brochures, flyers, and print-ready collateral with polished layouts.",
    fullDescription:
      "From business stationery to event materials, we design print assets that look professional on paper and on screen.",
    deliverables: [
      "Print-ready PDF files",
      "Bleed and trim specifications",
      "Source files for future edits",
      "Vendor handoff support",
    ],
    featuredImage: localImage(
      "/images/services/print.jpg",
      "Print stationery and collateral design",
    ),
    displayOrder: 3,
    featured: false,
  },
  {
    title: "Packaging",
    slug: "packaging",
    shortDescription:
      "Product packaging and label design that stands out on the shelf.",
    fullDescription:
      "We design packaging that communicates quality and clarity — from dielines to final artwork ready for production.",
    deliverables: [
      "Packaging concept directions",
      "Label and box artwork",
      "Production-ready files",
      "Mockup visuals",
    ],
    featuredImage: localImage(
      "/images/services/packaging.jpg",
      "Luxury product packaging design",
    ),
    displayOrder: 4,
    featured: false,
  },
  {
    title: "Banner",
    slug: "banner",
    shortDescription:
      "Event banners, signage, and large-format graphics built for impact.",
    fullDescription:
      "Make a strong first impression at trade shows, retail spaces, and events with bold, readable banner design.",
    deliverables: [
      "Large-format artwork files",
      "Multiple size variations",
      "High-resolution exports",
      "Print vendor specifications",
    ],
    featuredImage: localImage(
      "/images/services/banner.jpg",
      "Event banner and signage design",
    ),
    displayOrder: 5,
    featured: false,
  },
  {
    title: "Visual",
    slug: "visual",
    shortDescription:
      "General visual design for campaigns, presentations, and marketing assets.",
    fullDescription:
      "Need a cohesive visual direction for a launch or campaign? We create flexible design systems and supporting assets.",
    deliverables: [
      "Campaign visual direction",
      "Marketing asset suite",
      "Presentation templates",
      "Asset library organization",
    ],
    featuredImage: localImage(
      "/images/services/visual.jpg",
      "Visual design mood board and materials",
    ),
    displayOrder: 6,
    featured: false,
  },
  {
    title: "Custom Graphic",
    slug: "custom-graphic",
    shortDescription:
      "Tailored graphic design for unique projects outside standard packages.",
    fullDescription:
      "Have a specific vision or an unconventional brief? We scope custom creative work to match your needs.",
    deliverables: [
      "Scoped creative deliverables",
      "Custom artwork files",
      "Revision rounds as agreed",
      "Final export package",
    ],
    featuredImage: localImage(
      "/images/services/custom-graphic.jpg",
      "Custom branding and stationery design",
    ),
    displayOrder: 7,
    featured: false,
  },
] as const;

const pricingPackagesData = [
  {
    title: "Logo Essentials",
    subtitle: "A focused logo package for new businesses",
    description:
      "Ideal when you need a professional logo and core brand files to launch quickly.",
    deliverables: [
      "Logo concepts and refinements",
      "Primary logo files (PNG, SVG, PDF)",
      "Basic color palette",
      "One round of revisions",
    ],
    idealFor: "Startups, solopreneurs, and rebrands on a tight timeline",
    priceLabel: "Custom Quote",
    displayOrder: 1,
    featured: false,
  },
  {
    title: "Brand Identity",
    subtitle: "A complete visual identity system",
    description:
      "Build a cohesive brand with logo, typography, colors, and guidelines for consistent use.",
    deliverables: [
      "Logo suite and variations",
      "Typography and color system",
      "Brand guidelines PDF",
      "Social and print starter assets",
    ],
    idealFor: "Growing businesses ready to invest in a full brand foundation",
    priceLabel: "Custom Quote",
    displayOrder: 2,
    featured: true,
  },
  {
    title: "Custom Creative Support",
    subtitle: "Flexible ongoing design partnership",
    description:
      "Monthly or project-based creative support for teams that need a reliable design partner.",
    deliverables: [
      "Scoped monthly or project hours",
      "Priority turnaround",
      "Asset organization",
      "Strategy check-ins",
    ],
    idealFor: "Teams needing recurring design support without hiring in-house",
    priceLabel: "Custom Quote",
    displayOrder: 3,
    featured: false,
  },
] as const;

const availabilityData = {
  timezone: TIMEZONE,
  slotDurationMinutes: 30,
  leadTimeHours: 24,
  bookingHorizonDays: 60,
  weeklyHours: [
    { dayOfWeek: 1, ranges: [{ start: "09:00", end: "17:00" }] },
    { dayOfWeek: 2, ranges: [{ start: "09:00", end: "17:00" }] },
    { dayOfWeek: 3, ranges: [{ start: "09:00", end: "17:00" }] },
    { dayOfWeek: 4, ranges: [{ start: "09:00", end: "17:00" }] },
    { dayOfWeek: 5, ranges: [{ start: "09:00", end: "17:00" }] },
  ],
  blackoutDates: [] as Date[],
};

const portfolioProjectsData = [
  {
    title: "Bloom Botanicals Rebrand",
    slug: "bloom-botanicals-rebrand",
    category: "Branding" as const,
    shortDescription:
      "A warm, modern identity for a boutique plant shop expanding to e-commerce.",
    client: "Bloom Botanicals",
    year: 2025,
    services: ["Brand Identity", "Logo Design", "Packaging"],
    coverImage: localImage(
      "/images/portfolio/bloom-botanicals-rebrand.jpg",
      "Botanical brand sketchbook and illustration process",
    ),
    gallery: [
      unsplashImage(
        "photo-1499951360447-b19be8fe80f5",
        "Minimal brand stationery layout",
      ),
      unsplashImage(
        "photo-1556228578-0d85b1a4d571",
        "Product packaging on shelf",
      ),
    ],
    contentBlocks: [
      {
        type: "text-image" as const,
        displayOrder: 0,
        heading: "Rooted in nature",
        body: "The rebrand centered on organic shapes, earthy tones, and approachable typography to reflect the shop's community-focused mission.",
        image: unsplashImage(
          "photo-1485955900006-10f4d324d411",
          "Greenhouse interior with plants",
        ),
        imagePosition: "right" as const,
      },
      {
        type: "color-palette" as const,
        displayOrder: 1,
        heading: "Color palette",
        colors: [
          { name: "Moss", hex: "#4A6741" },
          { name: "Clay", hex: "#C9A27E" },
          { name: "Cream", hex: "#F5F0E8" },
          { name: "Charcoal", hex: "#2B2B2B" },
        ],
      },
      {
        type: "final-result" as const,
        displayOrder: 2,
        heading: "Final brand suite",
        body: "Delivered logo suite, packaging templates, and social launch kit.",
        images: [
          unsplashImage(
            "photo-1618005182384-a83a8bd57fbe",
            "Brand pattern and logo applications",
          ),
        ],
      },
    ] satisfies ContentBlock[],
    challenge:
      "The client needed a premium feel without losing their neighborhood charm.",
    solution:
      "We built a flexible identity system with soft textures and clear hierarchy across print and digital touchpoints.",
    status: "published" as const,
    featured: true,
    displayOrder: 1,
    isSample: true,
  },
  {
    title: "Northwind Coffee Mark",
    slug: "northwind-coffee-mark",
    category: "Logo Design" as const,
    shortDescription:
      "A bold wordmark and badge system for a specialty coffee roaster.",
    client: "Northwind Coffee Co.",
    year: 2024,
    services: ["Logo Design", "Brand Marks"],
    coverImage: localImage(
      "/images/portfolio/northwind-coffee-mark.jpg",
      "ZN monogram logo on premium stationery",
    ),
    gallery: [
      unsplashImage(
        "photo-1509042239860-f550ce710b93",
        "Coffee beans close-up",
      ),
    ],
    contentBlocks: [
      {
        type: "typography" as const,
        displayOrder: 0,
        heading: "Typography",
        samples: [
          {
            label: "Primary wordmark",
            fontFamily: "Playfair Display",
            fontWeight: "700",
            sampleText: "Northwind",
          },
          {
            label: "Supporting sans",
            fontFamily: "Inter",
            fontWeight: "500",
            sampleText: "Small batch. Big character.",
          },
        ],
      },
      {
        type: "quote" as const,
        displayOrder: 1,
        quote:
          "The mark feels established and distinctive — exactly what we needed for wholesale partners.",
        attribution: "Northwind Coffee Co. (sample client)",
      },
    ] satisfies ContentBlock[],
    status: "published" as const,
    featured: true,
    displayOrder: 2,
    isSample: true,
  },
  {
    title: "Luxe Skincare Launch Campaign",
    slug: "luxe-skincare-launch-campaign",
    category: "Social Media" as const,
    shortDescription:
      "A cohesive Instagram and paid social kit for a clean beauty product launch.",
    client: "Luxe Skincare (sample)",
    year: 2025,
    services: ["Social Media", "Visual Design"],
    coverImage: localImage(
      "/images/portfolio/luxe-skincare-launch-campaign.jpg",
      "Social media design grid on tablet mockup",
    ),
    gallery: [
      unsplashImage(
        "photo-1571781926291-c477ebfd024b",
        "Beauty product flat lay",
      ),
      unsplashImage(
        "photo-1522335789203-aabd1fc54bc9",
        "Social media content mockup",
      ),
    ],
    contentBlocks: [
      {
        type: "two-column-images" as const,
        displayOrder: 0,
        leftImage: unsplashImage(
          "photo-1596755389378-c31d21fd1273",
          "Instagram story template mockup",
        ),
        rightImage: unsplashImage(
          "photo-1612817288484-6f916006741a",
          "Carousel post design mockup",
        ),
        leftCaption: "Story templates",
        rightCaption: "Carousel frames",
      },
      {
        type: "full-width-image" as const,
        displayOrder: 1,
        image: unsplashImage(
          "photo-1515377905703-c4788e51af15",
          "Campaign hero visual",
        ),
        caption: "Launch week hero creative",
      },
    ] satisfies ContentBlock[],
    status: "published" as const,
    featured: false,
    displayOrder: 3,
    isSample: true,
  },
  {
    title: "Artisan Bakery Menu Suite",
    slug: "artisan-bakery-menu-suite",
    category: "Print" as const,
    shortDescription:
      "Print-ready menus, signage, and loyalty cards for a neighborhood bakery.",
    client: "Hearth & Crumb Bakery",
    year: 2024,
    services: ["Print Design"],
    coverImage: localImage(
      "/images/portfolio/artisan-bakery-menu-suite.jpg",
      "Branded stationery and retail collateral suite",
    ),
    gallery: [
      unsplashImage(
        "photo-1555507036-ab1f4038808a",
        "Printed menu on table",
      ),
    ],
    contentBlocks: [
      {
        type: "text-image" as const,
        displayOrder: 0,
        heading: "Readable at a glance",
        body: "Menus were structured for quick scanning during busy morning rushes, with clear category hierarchy and appetizing photography.",
        image: unsplashImage(
          "photo-1486427944299-d1955d23e34d",
          "Pastries display case",
        ),
        imagePosition: "left" as const,
      },
    ] satisfies ContentBlock[],
    status: "published" as const,
    featured: false,
    displayOrder: 4,
    isSample: true,
  },
  {
    title: "Clean Label Snack Packaging",
    slug: "clean-label-snack-packaging",
    category: "Packaging" as const,
    shortDescription:
      "Shelf-ready pouch design for a better-for-you snack brand.",
    client: "Trailbite Co.",
    year: 2025,
    services: ["Packaging", "Visual Design"],
    coverImage: localImage(
      "/images/portfolio/clean-label-snack-packaging.jpg",
      "Luxury snack packaging pouch lineup",
    ),
    gallery: [
      unsplashImage(
        "photo-1621939514649-280e2ee25f60",
        "Product pouch mockup",
      ),
    ],
    contentBlocks: [
      {
        type: "full-width-image" as const,
        displayOrder: 0,
        image: unsplashImage(
          "photo-1587049352846-4a222e784d38",
          "Honey jar packaging inspiration",
        ),
        caption: "Material and texture direction",
      },
      {
        type: "final-result" as const,
        displayOrder: 1,
        heading: "Production files",
        images: [
          unsplashImage(
            "photo-1606313564200-e75d5e30476c",
            "Chocolate bar packaging mockup",
          ),
        ],
      },
    ] satisfies ContentBlock[],
    status: "published" as const,
    featured: false,
    displayOrder: 5,
    isSample: true,
  },
  {
    title: "Tech Conference Hero Signage",
    slug: "tech-conference-hero-signage",
    category: "Banners" as const,
    shortDescription:
      "Large-format banner system for a regional technology summit.",
    client: "Summit East (sample)",
    year: 2025,
    services: ["Banner Design", "Visual Design"],
    coverImage: localImage(
      "/images/portfolio/tech-conference-hero-signage.jpg",
      "Roll-up banner and event signage mockup",
    ),
    gallery: [
      unsplashImage(
        "photo-1505373877841-8d25f7d46678",
        "Event banner mockup",
      ),
    ],
    contentBlocks: [
      {
        type: "video-embed" as const,
        displayOrder: 0,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Event sizzle reel placeholder",
        provider: "youtube" as const,
      },
      {
        type: "quote" as const,
        displayOrder: 1,
        quote:
          "Signage was legible from across the hall and photographed beautifully for sponsor recaps.",
        attribution: "Summit East events team (sample)",
      },
    ] satisfies ContentBlock[],
    status: "published" as const,
    featured: false,
    displayOrder: 6,
    isSample: true,
  },
  {
    title: "Editorial Type Collection",
    slug: "editorial-type-collection",
    category: "Visual Design" as const,
    shortDescription:
      "A series of typographic art prints blending serif letterforms with geometric color blocks.",
    client: "ZN Design Studio",
    year: 2025,
    services: ["Visual Design", "Custom Graphic"],
    coverImage: localImage(
      "/images/portfolio/editorial-type-collection.jpg",
      "Editorial typographic art print series",
    ),
    gallery: [],
    contentBlocks: [
      {
        type: "quote" as const,
        displayOrder: 0,
        quote:
          "Each print pairs classic serif typography with blush and gold geometric accents for a gallery-ready finish.",
        attribution: "ZN Design",
      },
    ] satisfies ContentBlock[],
    status: "published" as const,
    featured: true,
    displayOrder: 7,
    isSample: true,
  },
];

const testimonialsData = [
  {
    clientName: "Jordan M. (Sample)",
    businessRole: "Founder, Sample Studio",
    quote:
      "[SAMPLE TESTIMONIAL] Zafreen translated our messy ideas into a polished brand we are proud to share. This is placeholder copy for demo purposes only.",
    showRating: true,
    rating: 5,
    featured: true,
    displayOrder: 1,
    published: true,
    isSample: true,
  },
  {
    clientName: "Elena R. (Sample)",
    businessRole: "Marketing Lead, Demo Brand Co.",
    quote:
      "[SAMPLE TESTIMONIAL] The social templates saved our team hours every week. Replace this quote with a real client testimonial before launch.",
    showRating: true,
    rating: 5,
    featured: false,
    displayOrder: 2,
    published: true,
    isSample: true,
  },
  {
    clientName: "Marcus T. (Sample)",
    businessRole: "Owner, Placeholder Retail",
    quote:
      "[SAMPLE TESTIMONIAL] Packaging design helped our product stand out on shelf. This review is seeded sample content and not from a real customer.",
    showRating: false,
    featured: false,
    displayOrder: 3,
    published: true,
    isSample: true,
  },
];

async function main(): Promise<void> {
  const { connectDB } = await import("../src/lib/db");
  const {
    SiteSettings,
    SITE_SETTINGS_SINGLETON_KEY,
    Service,
    PricingPackage,
    AvailabilityRule,
    AVAILABILITY_SINGLETON_KEY,
    PortfolioProject,
    Testimonial,
  } = await import("../src/models");

  await connectDB();

  await SiteSettings.findOneAndUpdate(
    { singletonKey: SITE_SETTINGS_SINGLETON_KEY },
    { $set: siteSettingsData },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
  );
  console.log("Site settings seeded.");

  for (const service of servicesData) {
    await Service.findOneAndUpdate(
      { slug: service.slug },
      {
        $set: {
          ...service,
          active: true,
          gallery: [],
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
    );
  }
  console.log(`Seeded ${servicesData.length} services.`);

  for (const pkg of pricingPackagesData) {
    await PricingPackage.findOneAndUpdate(
      { title: pkg.title },
      {
        $set: {
          ...pkg,
          active: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
    );
  }
  console.log(`Seeded ${pricingPackagesData.length} pricing packages.`);

  await AvailabilityRule.findOneAndUpdate(
    { singletonKey: AVAILABILITY_SINGLETON_KEY },
    { $set: availabilityData },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
  );
  console.log("Availability rules seeded.");

  for (const project of portfolioProjectsData) {
    await PortfolioProject.findOneAndUpdate(
      { slug: project.slug },
      { $set: project },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
    );
  }
  console.log(`Seeded ${portfolioProjectsData.length} sample portfolio projects.`);

  for (const testimonial of testimonialsData) {
    await Testimonial.findOneAndUpdate(
      { clientName: testimonial.clientName, isSample: true },
      { $set: testimonial },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
    );
  }
  console.log(`Seeded ${testimonialsData.length} sample testimonials.`);

  console.log("Seed completed successfully.");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
