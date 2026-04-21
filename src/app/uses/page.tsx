export default function UsesPage() {
    const pcParts = [
        "CPU: Intel Core i5 14600KF",
        "GPU: AMD Radeon RX 9060 XT",
        "RAM: Kingston Fury 32GB DDR5",
        "Storage: Samsung SSD 990 EVO Plus 2TB",
        "Mainboard: B760 GAMING PLUS WIFI",
        "Cooling: NZXT Kraken 360",
        "Peripherals: Attack Shark M86, Attack Shark X3",
        "Monitor: 2x 27 Zoll 1080p 180Hz/165Hz"
    ];

    const uses = ["VS Code", "Figma", "GitHub", "Vercel", "Spotify", "WSL2", "Discord", "Copilot"];

    return (
        <main id="top" className="links-page">
            <section className="section">
                <div className="section__heading">
                    <p className="eyebrow">Uses</p>
                    <h2>Tools and PC components I currently use.</h2>
                </div>
                <div className="uses-grid">
                    <article className="uses-card">
                        <p className="uses-card__title">Daily tools</p>
                        <div className="uses-tags">
                            {uses.map((tool) => (
                                <span key={tool}>{tool}</span>
                            ))}
                        </div>
                    </article>
                    <article className="uses-card">
                        <p className="uses-card__title">PC components</p>
                        <ul className="pc-list">
                            {pcParts.map((part) => (
                                <li key={part}>{part}</li>
                            ))}
                        </ul>
                    </article>
                </div>
            </section>
        </main>
    );
}
