interface PageIntroProps {
    eyebrow: string;
    title: string;
    description: string;
    sector?: string;
}

export default function PageIntro({ eyebrow, title, description, sector }: PageIntroProps) {
    return (
        <section className="page-intro">
            <div className="section-marker">
                {sector ? <span className="sector-tag">Sector {sector}</span> : null}
                <p className="eyebrow">{eyebrow}</p>
            </div>
            <h1>{title}</h1>
            <p>{description}</p>
        </section>
    );
}
