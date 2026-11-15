import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LaunchControlOverlay from "@/components/Effects/LaunchControlOverlay";
import SecretRaceGame from "@/components/Effects/SecretRaceGame";
import { SITE_URL, alternatesFor, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "./dictionaries";
import { fontVariables } from "../fonts";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Only /en and /de exist - anything else in the first segment (e.g. a
// missing /foo.txt, which the proxy skips) goes straight to the 404 page.
export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.site.title,
    description: dict.meta.site.description,
    alternates: alternatesFor(lang, "/"),
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  // Nav and footer differ between the one-pager and the standalone pages,
  // so each page renders its own.
  return (
    <html lang={lang} className={fontVariables}>
      <body>
        {children}
        <LaunchControlOverlay />
        <SecretRaceGame />
      </body>
    </html>
  );
}
