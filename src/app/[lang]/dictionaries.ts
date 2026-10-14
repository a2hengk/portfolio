import "server-only";
import type { Locale } from "@/i18n/config";
import type en from "./dictionaries/en.json";

// en.json is the source of truth for the shape - de.json has to match it,
// otherwise the return type annotation below fails typechecking.
export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
    en: () => import("./dictionaries/en.json").then((module): Dictionary => module.default),
    de: () => import("./dictionaries/de.json").then((module): Dictionary => module.default),
};

export { hasLocale } from "@/i18n/config";

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
