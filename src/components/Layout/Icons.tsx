// Small arrows shared across sections. Decorative - the link text says
// where it goes.

export function ArrowUpRight({ size = 13, className }: { size?: number; className?: string }) {
    return (
        <svg className={className} aria-hidden="true" width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11 11 3M5 3h6v6" />
        </svg>
    );
}

export function ArrowDown({ size = 13 }: { size?: number }) {
    return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 2v10M2.5 7.5 7 12l4.5-4.5" />
        </svg>
    );
}
