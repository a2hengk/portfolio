import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import BackHeader from "@/components/Layout/BackHeader";
import Orb from "@/components/Layout/Orb";
import PageTitle from "@/components/Layout/PageTitle";
import SiteFooter from "@/components/Layout/SiteFooter";
import LaunchControlOverlay from "@/components/Effects/LaunchControlOverlay";
import SecretRaceGame from "@/components/Effects/SecretRaceGame";
import { defaultLocale, hasLocale, localizedHref, type Locale } from "@/i18n/config";
import { getDictionary } from "./[lang]/dictionaries";
import { fontVariables } from "./fonts";
import "./globals.css";

// Renders for any URL that doesn't match a route. It sits outside the [lang]
// tree, so the language comes from the x-lang header the proxy sets on
// /en/... and /de/... requests (anything else got redirected there first).
async function getLang(): Promise<Locale> {
    const lang = (await headers()).get("x-lang") ?? "";
    return hasLocale(lang) ? lang : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary(await getLang());

    return {
        title: dict.notFound.metaTitle,
        description: dict.notFound.title,
    };
}

export default async function GlobalNotFound() {
    const lang = await getLang();
    const dict = await getDictionary(lang);
    const t = dict.notFound;

    return (
        <html lang={lang} className={fontVariables}>
            <body>
                <div className="page">
                    <Orb color="dark" size="clamp(300px, 46vw, 680px)" opacity={0.9} right="-6%" top="-10%" />
                    <Orb color="red" size="clamp(200px, 26vw, 380px)" opacity={0.42} left="-6%" bottom="-8%" duration={42} delay={-12} />

                    <BackHeader lang={lang} label={dict.back} />

                    <main id="top" className="wrap" style={{ flex: 1, paddingBlock: "clamp(48px, 7vw, 112px)" }}>
                        <PageTitle kicker="404" title={t.title} text={t.description} small />
                        <div className="ld" style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12, animationDelay: "0.6s" }}>
                            <Link className="btn btn-w" href={localizedHref(lang, "/")}>
                                {t.home}
                            </Link>
                            <Link className="btn btn-g" href={localizedHref(lang, "/#builds")}>
                                {t.builds}
                            </Link>
                        </div>
                    </main>

                    <SiteFooter lang={lang} dict={dict.footer} languages={dict.nav.language} path="/" />
                </div>
                <LaunchControlOverlay />
                <SecretRaceGame />
            </body>
        </html>
    );
}
