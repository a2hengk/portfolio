"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

type Options = {
    /** Render only while this is true (e.g. once a form is actually shown). */
    enabled: boolean;
    siteKey: string | undefined;
    theme?: "light" | "dark" | "auto";
    /** Called with each fresh token, and with "" when it expires, errors or the widget goes away. */
    onToken?: (token: string) => void;
};

/**
 * Renders a Turnstile widget into `containerRef` and returns a `reset` for
 * exactly that widget.
 *
 * Two things this gets around, both of which bit the Pit Wall, where the
 * guestbook form and the start-lights game each have a widget:
 * - It waits for `window.turnstile` itself instead of next/script's onReady.
 *   When two components load the same script, next/script only fires
 *   onReady for the one that started the load, so the other never rendered.
 * - It keeps the widget id, so reset/remove never touch the other widget.
 *   Turnstile only documents those calls with an id.
 *
 * The widget also puts its token in a hidden `cf-turnstile-response` input
 * inside the container, so plain form posts keep working.
 */
export function useTurnstileWidget(containerRef: RefObject<HTMLElement | null>, { enabled, siteKey, theme, onToken }: Options) {
    const widgetIdRef = useRef<string | undefined>(undefined);
    const onTokenRef = useRef(onToken);

    useEffect(() => {
        onTokenRef.current = onToken;
    }, [onToken]);

    useEffect(() => {
        const container = containerRef.current;
        if (!enabled || !siteKey || !container) return;

        const emit = (token: string) => onTokenRef.current?.(token);
        let poll: number | undefined;

        const render = () => {
            if (!window.turnstile) return false;
            widgetIdRef.current = window.turnstile.render(container, {
                sitekey: siteKey,
                theme,
                callback: emit,
                "expired-callback": () => emit(""),
                "error-callback": () => emit(""),
            });
            return true;
        };

        if (!render()) {
            poll = window.setInterval(() => {
                if (render()) window.clearInterval(poll);
            }, 100);
        }

        return () => {
            window.clearInterval(poll);
            const widgetId = widgetIdRef.current;
            if (widgetId) window.turnstile?.remove(widgetId);
            widgetIdRef.current = undefined;
            emit("");
        };
    }, [containerRef, enabled, siteKey, theme]);

    return useCallback(() => {
        onTokenRef.current?.("");
        const widgetId = widgetIdRef.current;
        if (widgetId) window.turnstile?.reset(widgetId);
    }, []);
}
