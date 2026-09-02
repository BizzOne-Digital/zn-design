import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { MediaImage } from "@/types";

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: MediaImage | string | null;
  noIndex?: boolean;
  type?: "website" | "article";
}

export function buildPageMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  type = "website",
}: PageMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fallbackImage = `${siteConfig.url}/brand/zn-design-logo.png`;
  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url ?? fallbackImage;
  const imageAlt =
    typeof image === "object" && image?.alt
      ? image.alt
      : siteConfig.businessName;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.businessName,
      type,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}
