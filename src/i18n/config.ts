// Shared locale config - safe to import from proxy, server and client code
// (no dictionaries in here, those stay server-only in app/[lang]/dictionaries.ts).

export const locales = ["en", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Used for metadataBase so the hreflang/canonical URLs come out absolute.
export const SITE_URL = "https://www.about-lunas.dev";

export const hasLocale = (locale: string): locale is Locale => (locales as readonly string[]).includes(locale);

// "/about" -> "/de/about", "/" -> "/de". Hashes and external links pass through untouched.
export function localizedHref(lang: Locale, href: string): string {
    if (!href.startsWith("/")) {
        return href;
    }

    return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

// Strips the locale prefix again: "/de/about" -> "/about", "/en" -> "/".
export function stripLocale(pathname: string): string {
    const [, first, ...rest] = pathname.split("/");

    if (!hasLocale(first ?? "")) {
        return pathname || "/";
    }

    return rest.length ? `/${rest.join("/")}` : "/";
}

// canonical + hreflang links for a page, path given without locale ("/about").
export function alternatesFor(lang: Locale, path: string) {
    return {
        canonical: localizedHref(lang, path),
        languages: {
            ...Object.fromEntries(locales.map((locale) => [locale, localizedHref(locale, path)])),
            "x-default": localizedHref(defaultLocale, path),
        },
    };
}

// Tiny "{name}" placeholder fill for dictionary strings with values in them.
export function fill(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
