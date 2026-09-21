import PageIntro from "@/components/PageIntro";
import UsesSection from "@/components/Sections/Uses";

export const metadata = {
    title: "Uses - Lunas",
    description: "The software and setup behind Lunas's daily workflow.",
};

export default function UsesPage() {
    return (
        <main id="top" className="route-page">
            <PageIntro
                sector="06"
                eyebrow="Uses"
                title="The tools and setup behind my workflow."
                description="A garage-board look at the software I keep open and the setup it runs on."
            />

            <UsesSection />
        </main>
    );
}
