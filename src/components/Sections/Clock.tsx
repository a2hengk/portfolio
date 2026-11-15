"use client";

import { useEffect, useState } from "react";

function formatClock(date: Date | null, locale: string) {
    if (!date) {
        return "--:--:--";
    }
    return date.toLocaleTimeString(locale, { hour12: false });
}

// The one genuinely live thing on the timing tower: local time, ticking
// every second. Starts empty so server and client render the same thing.
function useGarageClock() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);

    return now;
}

export default function Clock({ locale }: { locale: string }) {
    const now = useGarageClock();

    return <time dateTime={now?.toISOString()}>{formatClock(now, locale)}</time>;
}
