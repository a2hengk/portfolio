export {};

declare global {
    interface Window {
        turnstile?: {
            reset: (widgetId?: string) => void;
            render: (
                container: HTMLElement | string,
                options: {
                    sitekey: string;
                    theme?: "light" | "dark" | "auto";
                    callback?: (token: string) => void;
                    "expired-callback"?: () => void;
                    "error-callback"?: () => void;
                },
            ) => string | undefined;
            remove: (widgetId: string) => void;
        };
    }
}
