import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";

// Picks /de or /en from Accept-Language (q-values respected, region ignored,
// so "de-AT" counts as German). Anything unknown falls back to English.
function getLocale(request: NextRequest): Locale {
    const header = request.headers.get("accept-language");
    if (!header) {
        return defaultLocale;
    }

    const ranked = header
        .split(",")
        .map((part, index) => {
            const [tag, ...params] = part.trim().split(";");
            const qParam = params.map((param) => param.trim()).find((param) => param.startsWith("q="));
            const q = qParam ? Number(qParam.slice(2)) : 1;
            return { base: tag.trim().toLowerCase().split("-")[0], q, index };
        })
        .filter((entry) => entry.base && Number.isFinite(entry.q) && entry.q > 0)
        .sort((a, b) => b.q - a.q || a.index - b.index);

    const match = ranked.find((entry) => hasLocale(entry.base));
    return match && hasLocale(match.base) ? match.base : defaultLocale;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const [, first] = pathname.split("/");

    if (hasLocale(first ?? "")) {
        // Locale already in the URL. It's passed on as a request header for
        // global-not-found.tsx, which renders outside the [lang] tree and
        // doesn't get route params.
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-lang", first);
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${getLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        // Everything except API routes, Next internals and files with an
        // extension (public/ images, favicon, etc.).
        "/((?!api|_next/static|_next/image|.*\\..*).*)",
    ],
};
