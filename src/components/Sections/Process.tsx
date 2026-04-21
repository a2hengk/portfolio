export default function ProcessSection() {
    const steps = [
        {
            id: 1,
            title: "1. Clarify",
            description: "Define the story, audience, and visual priorities.",
        },
        {
            id: 2,
            title: "2. Structure",
            description: "Lay out the homepage around clear section anchors.",
        },
        {
            id: 3,
            title: "3. Refine",
            description: "Polish spacing, contrast, and motion until the page feels complete.",
        },
    ];

    return (
        <section className="section" id="process">
            <div className="section__heading">
                <p className="eyebrow">Process</p>
                <h2>Built to stay simple as the portfolio grows.</h2>
            </div>
            <div className="process-list">
                {steps.map((step) => (
                    <div key={step.id}>
                        <strong>{step.title}</strong>
                        <span>{step.description}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
