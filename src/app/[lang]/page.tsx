import { notFound } from "next/navigation";
import Nav from "@/components/Layout/Nav";
import SiteFooter from "@/components/Layout/SiteFooter";
import HeroSection from "@/components/Sections/Hero";
import AboutSection from "@/components/Sections/About";
import BuildsSection from "@/components/Sections/Builds";
import PathSection from "@/components/Sections/Path";
import StackSection from "@/components/Sections/Stack";
import OffDutySection from "@/components/Sections/OffDuty";
import ContactSection from "@/components/Sections/Contact";
import { getDictionary, hasLocale } from "./dictionaries";

// The one-pager. Everything except the pit wall and the links page lives
// here, reachable by anchor: #about, #builds, #path, #stack, #offduty, #contact.
export default async function Page({ params }: PageProps<"/[lang]">) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	const t = dict.home;

	return (
		// The nav sits inside .page so the hero light runs up behind it
		// instead of being cut off at the top of <main>.
		<div className="page">
			<Nav lang={lang} dict={dict.nav} />
			<main id="top" style={{ flex: "1 0 auto", display: "flex", flexDirection: "column" }}>
				<HeroSection lang={lang} dict={t.hero} />
				<AboutSection lang={lang} dict={t.about} />
				<BuildsSection dict={t.builds} />
				<PathSection dict={t.path} />
				<StackSection dict={t.stack} />
				<OffDutySection dict={t.offDuty} />
				<ContactSection
					lang={lang}
					dict={t.contact}
					footer={<SiteFooter lang={lang} dict={dict.footer} languages={dict.nav.language} path="/" inline />}
				/>
			</main>
		</div>
	);
}
