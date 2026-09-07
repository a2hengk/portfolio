import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";
import AboutSection from "@/components/Sections/About";

export const metadata = {
    title: "About - Lunas",
    description: "Background, stack, and skills of Lunas, a dual student and developer building polished web experiences.",
};

export default function AboutPage() {
    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="01"
                eyebrow="About"
                title="A clearer view of who I am."
                description="This page shows the background, stack, and habits that shape the way I build."
                highlight="who I am"
            />
            <div className="route-inline-actions">
                <Button href="/experience" variant="primary">
                    View experience
                </Button>
                <Button href="/projects" variant="secondary">
                    See projects
                </Button>
            </div>
            <AboutSection />
        </main>
    );
}