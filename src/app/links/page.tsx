export default function LinksPage() {
    const socials = [
        {
            id: 1,
            name: "GitHub",
            handle: "@a2hengk",
            href: "https://github.com/a2hengk",
        },
        {
            id: 2,
            name: "Discord",
            handle: "@lunas3407",
            href: "https://discord.com/",
        },
        {
            id: 3,
            name: "Instagram",
            handle: "Add your profile",
            href: "https://www.instagram.com/hengkevin1405?igsh=MWF2aWZmb2tqdXhuNw==",
        },
        {
            id: 4,
            name: "TikTok",
            handle: "Add your profile",
            href: "https://www.tiktok.com/@lunas.118f20?_r=1&_t=ZG-95j9qvTOsWO",
        },
    ];

    return (
        <main id="top" className="links-page">
            <section className="section">
                <div className="section__heading">
                    <p className="eyebrow">Links</p>
                    <h2>Find me online.</h2>
                </div>
                <div className="links-grid">
                    {socials.map((social) => (
                        <a key={social.id} href={social.href} target="_blank" rel="noopener noreferrer" className="link-card">
                            <strong>{social.name}</strong>
                            <span>{social.handle}</span>
                        </a>
                    ))}
                </div>
            </section>
        </main>
    );
}
