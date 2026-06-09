import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";
import ExperienceSection from "@/components/Sections/Experience";

export default function ExperiencePage() {
    return (
        <main id="top" className="route-page">
            <PageIntro
                eyebrow="Experience"
                title="The road I’ve been taking so far."
                description="A timeline of study, work, and the projects that shaped how I build today."
                highlight="road"
            />
            <div className="route-inline-actions">
                <Button href="/projects" variant="primary">
                    Browse projects
                </Button>
                <Button href="/about" variant="secondary">
                    Back to about
                </Button>
            </div>
            <ExperienceSection />
        </main>
    );
}