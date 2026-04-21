import HeroSection from "@/components/Sections/Hero";
import AboutSection from "@/components/Sections/About";
import ProjectsSection from "@/components/Sections/Projects";
import GamesSection from "@/components/Sections/Games";
import AnimeSection from "@/components/Sections/Anime";
import ContactSection from "@/components/Sections/Contact";

export default function Page() {
	return (
		<main id="top">
			<HeroSection />
			<AboutSection />
			<ProjectsSection />
			<GamesSection />
			<AnimeSection />
			<ContactSection />
		</main>
	);
}
