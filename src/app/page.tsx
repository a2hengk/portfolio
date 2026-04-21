import HeroSection from "@/components/Sections/Hero";
import AboutSection from "@/components/Sections/About";
import ProjectsSection from "@/components/Sections/Projects";
import GamesSection from "@/components/Sections/Games";
import ProcessSection from "@/components/Sections/Process";
import ContactSection from "@/components/Sections/Contact";

export default function Page() {
	return (
		<main id="top">
			<HeroSection />
			<AboutSection />
			<ProjectsSection />
			<GamesSection />
			<ProcessSection />
			<ContactSection />
		</main>
	);
}
