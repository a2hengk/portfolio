import PageIntro from "@/components/PageIntro";

export default function UsesPage() {
    const pcParts = [
        "CPU: Intel Core i5 14600KF",
        "GPU: AMD Radeon RX 9060 XT",
        "RAM: Kingston Fury 32GB DDR5",
        "Storage: Samsung SSD 990 EVO Plus 2TB",
        "Mainboard: B760 GAMING PLUS WIFI",
        "Cooling: NZXT Kraken 360",
        "Peripherals: Attack Shark M86, Attack Shark X3",
        "Monitor: 2x 27 Zoll 1080p 180Hz/165Hz",
    ];

    const uses = ["VS Code", "Figma", "GitHub", "Vercel", "Spotify", "WSL2", "Discord", "Copilot"];

    return (
        <main id="top" className="route-page">
            <PageIntro
                eyebrow="Uses"
                title="The tools and hardware behind my workflow."
                description="A compact list of the software and PC parts that shape how I code, design, and stay productive."
                highlight="workflow"
            />

            <section className="route-section">
                <div className="section__heading">
                    <p className="eyebrow">Daily tools</p>
                    <h2>Software I keep open all the time.</h2>
                </div>
                <div className="uses-tags">
                    {uses.map((tool) => (
                        <span key={tool}>{tool}</span>
                    ))}
                </div>
            </section>

            <section className="route-section">
                <div className="section__heading">
                    <p className="eyebrow">PC components</p>
                    <h2>The machine I actually use.</h2>
                </div>
                <ul className="pc-list">
                    {pcParts.map((part) => (
                        <li key={part}>{part}</li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
