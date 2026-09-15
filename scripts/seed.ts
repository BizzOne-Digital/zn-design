import { loadEnv } from "./load-env";

loadEnv();

import type { MediaImage } from "../src/types";

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
  address: "New York, United States",
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
    "Hi, I'm Zafreen — the designer behind ZN Design.\n\nI'm a New York–based graphic designer passionate about helping small businesses and entrepreneurs build brands that feel authentic, polished, and memorable. From logo design and brand identity to social media, print, and packaging, I partner closely with each client to translate their vision into thoughtful visual design.\n\nWhen I'm not designing, you'll find me exploring new creative inspiration, refining brand systems, and collaborating with founders who are ready to stand out.",
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
      "New York graphic designer",
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
    title: "Logo & Brand Identity Design",
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
    title: "Social Media Design",
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
      "Sierra Link executive transportation Instagram carousel design",
    ),
    displayOrder: 2,
    featured: true,
  },
  {
    title: "Print Design",
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
    title: "Packaging Design",
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
      "Serendip Tea Co. lifestyle packaging and brand applications mockup",
    ),
    displayOrder: 4,
    featured: false,
  },
  {
    title: "Banner & Large-Format Design",
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
      "Serendip Tea Co. website and large-format digital design mockup",
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
      "/images/services/visual.png",
      "Underwater vector illustration visual design sample",
    ),
    displayOrder: 6,
    featured: false,
  },
  {
    title: "Custom Graphic Design",
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

const portfolioProjectsData = [] as const;

async function loadPortfolioProjects() {
  const { vectorGraphicsPortfolioData } = await import(
    "./data/vector-graphics-portfolio"
  );
  const { brandingWebsiteAssetPackageData } = await import(
    "./data/branding-website-asset-package"
  );
  const { serendipTeaCoPortfolioData } = await import(
    "./data/serendip-tea-co-portfolio"
  );
  const { comfortSolutionPortfolioData } = await import(
    "./data/comfort-solution-portfolio"
  );
  const { asianFoodPortfolioData } = await import(
    "./data/asian-food-portfolio"
  );
  const { brisaCafePortfolioData } = await import("./data/brisa-cafe-portfolio");
  return [
    ...vectorGraphicsPortfolioData,
    ...brandingWebsiteAssetPackageData,
    ...serendipTeaCoPortfolioData,
    ...comfortSolutionPortfolioData,
    ...asianFoodPortfolioData,
    ...brisaCafePortfolioData,
  ];
}

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

  const removed = await PortfolioProject.deleteMany({ isSample: true });
  console.log(`Removed ${removed.deletedCount} sample portfolio projects.`);

  const portfolioProjectsData = await loadPortfolioProjects();

  for (const project of portfolioProjectsData) {
    await PortfolioProject.findOneAndUpdate(
      { slug: project.slug },
      { $set: project },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
    );
  }
  if (portfolioProjectsData.length > 0) {
    console.log(`Seeded ${portfolioProjectsData.length} portfolio projects.`);
  } else {
    console.log("Portfolio projects cleared — awaiting client content.");
  }

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
