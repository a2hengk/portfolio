import { notFound } from "next/navigation";
import HeroSection from "@/components/Sections/Hero";
import ContactSection from "@/components/Sections/Contact";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function Page({ params }: PageProps<"/[lang]">) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);

	return (
		<main id="top">
			<HeroSection lang={lang} dict={dict.home.hero} />
			<ContactSection lang={lang} dict={dict.home.contact} />
		</main>
	);
}
