"use client";

import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminSignInButton() {
    // Come back to the same language version after the Discord round-trip.
    const { lang } = useParams<{ lang: string }>();

    return (
        <button
            type="button"
            className="guestbook-form__discord"
            onClick={() => authClient.signIn.social({ provider: "discord", callbackURL: `/${lang}/guestbook/admin` })}
        >
            Continue with Discord
        </button>
    );
}
