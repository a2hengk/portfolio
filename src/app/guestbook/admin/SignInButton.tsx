"use client";

import { authClient } from "@/lib/auth-client";

export default function AdminSignInButton() {
    return (
        <button
            type="button"
            className="guestbook-form__discord"
            onClick={() => authClient.signIn.social({ provider: "discord", callbackURL: "/guestbook/admin" })}
        >
            Continue with Discord
        </button>
    );
}
