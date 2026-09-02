import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MaintenanceBanner } from "@/components/site/MaintenanceBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { SiteMotionShell } from "@/components/providers/SiteMotionShell";
import { getMergedSettings } from "@/lib/data";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getMergedSettings();

  return (
    <>
      <JsonLd settings={settings} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <MaintenanceBanner settings={settings} />
      <Header settings={settings} />
      <main id="main-content" className="flex-1">
        <SiteMotionShell>{children}</SiteMotionShell>
      </main>
      <Footer settings={settings} />
    </>
  );
}
