import type { MergedSiteSettings } from "@/lib/data";
import { siteConfig } from "@/config/site";

export interface JsonLdProps {
  settings: MergedSiteSettings;
}

export function JsonLd({ settings }: JsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings.businessName,
    description: settings.seoDefaults.description,
    url: siteConfig.url,
    email: settings.email,
    telephone: settings.phoneLink || settings.phone,
    image: settings.logo?.url ?? `${siteConfig.url}/brand/zn-design-logo.png`,
    ...(settings.address
      ? {
          areaServed: settings.address,
        }
      : {}),
    founder: settings.contactPerson
      ? {
          "@type": "Person",
          name: settings.contactPerson,
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
