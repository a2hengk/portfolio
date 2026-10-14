import Button from "@/components/Buttons/button";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { localizedHref, type Locale } from "@/i18n/config";

export default function ContactSection({ lang, dict }: { lang: Locale; dict: Dictionary["home"]["contact"] }) {
    return (
        <section className="section section--contact" id="contact">
            <div>
                <p className="eyebrow">{dict.eyebrow}</p>
                <h2>{dict.title}</h2>
                <p>
                    {dict.text}
                </p>
            </div>
            <Button href={localizedHref(lang, "/links")} variant="primary">
                {dict.action}
            </Button>
        </section>
    );
}
