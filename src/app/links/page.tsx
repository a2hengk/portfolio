import PageIntro from "@/components/PageIntro";

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
        <main id="top" className="route-page">
            <PageIntro
                eyebrow="Links"
                title="Want to reach out? Start here."
                description="These are the best places to contact me, follow my work, or send a quick message."
                highlight="reach out"
            />

            <section className="route-section">
                <div className="section__heading">
                    <p className="eyebrow">Socials</p>
                    <h2>I’m happy to hear from you on whichever platform fits best.</h2>
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
