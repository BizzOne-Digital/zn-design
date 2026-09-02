import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default:
        settings?.seoDefaults?.title ??
        settings?.businessName ??
        siteConfig.seo.title,
      template: `%s | ${settings?.businessName ?? siteConfig.businessName}`,
    },
    description:
      settings?.seoDefaults?.description ?? siteConfig.seo.description,
    keywords: settings?.seoDefaults?.keywords ?? [...siteConfig.seo.keywords],
    icons: settings?.favicon?.url
      ? { icon: settings.favicon.url, apple: settings.favicon.url }
      : { icon: "/brand/zn-design-logo.jpg" },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: settings?.businessName ?? siteConfig.businessName,
      images: settings?.ogImage?.url
        ? [
            {
              url: settings.ogImage.url,
              alt: settings.ogImage.alt || siteConfig.businessName,
            },
          ]
        : [{ url: "/brand/zn-design-logo.jpg", alt: "ZN Design" }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
