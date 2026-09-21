import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";
import ProjectsSection from "@/components/Sections/Projects";

export const metadata = {
    title: "Projects - Lunas",
    description: "Selected builds and experiments from Lunas, and where each project currently stands.",
};

export default function ProjectsPage() {
    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="03"
                eyebrow="Projects"
                title="Selected builds and the problems I like solving."
                description="A clearer look at the apps, experiments, and tools I’ve worked on or am actively shaping."
            />
            <div className="route-inline-actions">
                <Button href="/links" variant="primary">
                    Start a conversation
                </Button>
                <Button href="/links" variant="secondary">
                    Open links
                </Button>
            </div>
            <ProjectsSection />
        </main>
    );
}