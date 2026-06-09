interface PageIntroProps {
    eyebrow: string;
    title: string;
    description: string;
    highlight?: string;
}

function renderHighlightedTitle(title: string, highlight?: string) {
    if (!highlight) {
        return title;
    }

    const start = title.toLowerCase().indexOf(highlight.toLowerCase());

    if (start === -1) {
        return title;
    }

    const before = title.slice(0, start);
    const matched = title.slice(start, start + highlight.length);
    const after = title.slice(start + highlight.length);

    return (
        <>
            {before}
            <span className="page-intro__highlight">{matched}</span>
            {after}
        </>
    );
}

export default function PageIntro({ eyebrow, title, description, highlight }: PageIntroProps) {
    return (
        <section className="page-intro">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{renderHighlightedTitle(title, highlight)}</h1>
            <p>{description}</p>
        </section>
    );
}