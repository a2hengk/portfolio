export default function UsesPage() {
    const pcParts = [
        "CPU: AMD Ryzen 7 7800X3D",
        "GPU: NVIDIA RTX 4070 Super",
        "RAM: 32GB DDR5",
        "Storage: 2TB NVMe SSD",
        "Mainboard: B650 chipset",
        "Cooling: 360mm AIO",
        "Peripherals: Mechanical keyboard + lightweight mouse",
        "Monitor: 27in 1440p high refresh",
    ];

    const uses = ["VS Code", "Figma", "Notion", "GitHub", "Vercel", "Spotify"];

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
