import { headers } from "next/headers";
import type { Metadata } from "next";
import Header from "@/components/Header/header";
import Footer from "@/components/footer/footer";
import BackgroundFX from "@/components/Effects/BackgroundFX";
import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";
import { defaultLocale, hasLocale, localizedHref, type Locale } from "@/i18n/config";
import { getDictionary } from "./[lang]/dictionaries";
import { bigShoulders, cormorant } from "./fonts";
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
        <html lang={lang} className={`${cormorant.variable} ${bigShoulders.variable}`}>
            <body>
                <BackgroundFX />
                <Header lang={lang} dict={dict.header} />
                <main id="top" className="route-page">
                    <PageIntro
                        eyebrow="404"
                        title={t.title}
                        description={t.description}
                    />
                    <div className="route-inline-actions">
                        <Button href={localizedHref(lang, "/")} variant="primary">
                            {t.home}
                        </Button>
                        <Button href={localizedHref(lang, "/projects")} variant="secondary">
                            {t.projects}
                        </Button>
                    </div>
                </main>
                <Footer lang={lang} dict={dict.footer} />
            </body>
        </html>
    );
}
