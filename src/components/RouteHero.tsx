import React from "react";

interface RouteHeroHighlight {
    label: string;
    value: string;
}

interface RouteHeroProps {
    eyebrow: string;
    title: string;
    description: string;
    panelLabel: string;
    panelNote: string;
    highlights: RouteHeroHighlight[];
    actions?: React.ReactNode;
}

export default function RouteHero({
    eyebrow,
    title,
    description,
    panelLabel,
    panelNote,
    highlights,
    actions,
}: RouteHeroProps) {
    return (
        <section className="route-hero">
            <div>
                <p className="eyebrow">{eyebrow}</p>
                <h1>{title}</h1>
                <p className="route-hero__lede">{description}</p>
                {actions ? <div className="route-hero__actions">{actions}</div> : null}
            </div>

            <aside className="route-hero__panel" aria-label={`${eyebrow} highlights`}>
                <div className="route-hero__panel-top">
                    <span className="route-hero__panel-label">{panelLabel}</span>
                    <span className="route-hero__panel-label">Live</span>
                </div>
                <p className="route-hero__panel-note">{panelNote}</p>
                <div className="route-hero__panel-list">
                    {highlights.map((item) => (
                        <div key={item.label}>
                            <strong>{item.label}</strong>
                            <span>{item.value}</span>
                        </div>
                    ))}
                </div>
            </aside>
        </section>
    );
}