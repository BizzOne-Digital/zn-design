export const siteConfig = {
  businessName: "ZN Design",
  contactPerson: "Zafreen Nihmathullah",
  tagline: "Creative Design That Brings Your Vision to Life",
  email: "zafreennihmathullah@gmail.com",
  phone: "(508) 851-7086",
  phoneLink: "+15088517086",
  address: "New York, United States",
  timezone: "America/New_York",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    behance: "",
  },
  seo: {
    title: "ZN Design | Creative Brand & Visual Design Studio",
    description:
      "ZN Design creates thoughtful brand identities and visual experiences for small businesses, entrepreneurs, and growing brands.",
    keywords: [
      "graphic design",
      "branding",
      "logo design",
      "social media design",
      "packaging design",
      "brand identity",
      "New York graphic designer",
    ],
  },
  hero: {
    eyebrow: "Independent Graphic Design Studio",
    headline: "Creative Design That Brings Your Vision to Life",
    support:
      "ZN Design creates thoughtful brand identities and visual experiences for small businesses, entrepreneurs, and growing brands—turning ideas into work that feels clear, distinctive, and memorable.",
    ctaPrimary: "Explore Portfolio",
    ctaSecondary: "Start a Project",
  },
  about:
    "Hi, I'm Zafreen — the designer behind ZN Design. I'm a New York–based graphic designer helping small businesses and entrepreneurs build brands that feel authentic, polished, and memorable.",
  pricingStatement:
    "Every project is different. Pricing is shaped by the scope, complexity, deliverables, and timeline. Share your vision to receive a custom quote designed around what your brand actually needs.",
  introOffer:
    "New clients may contact ZN Design for introductory package options. Custom packages are available based on individual branding and design needs.",
  finalCta: "Have a vision? Let's make it unforgettable.",
  footer: {
    text: `© ${new Date().getFullYear()} ZN Design. All rights reserved.`,
  },
  booking: {
    slotDurationMinutes: 30,
    leadTimeHours: 24,
    bookingHorizonDays: 60,
    notificationEmail:
      process.env.BOOKING_NOTIFICATION_EMAIL ?? "zafreennihmathullah@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
