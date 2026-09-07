import Button from "@/components/Buttons/button";
import PageIntro from "@/components/PageIntro";

export const metadata = {
    title: "Page not found - Lunas",
    description: "This page doesn't exist.",
};

export default function NotFound() {
    return (
        <main id="top" className="route-page">
            <PageIntro
                eyebrow="404"
                title="This page doesn't exist."
                description="The link might be outdated, or the page moved. Here are a few places to pick back up."
                highlight="doesn't exist"
            />
            <div className="route-inline-actions">
                <Button href="/" variant="primary">
                    Back to home
                </Button>
                <Button href="/projects" variant="secondary">
                    See projects
                </Button>
            </div>
        </main>
    );
}
