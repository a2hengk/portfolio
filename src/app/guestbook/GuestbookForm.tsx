"use client";

import { useActionState, useEffect, useRef } from "react";
import Script from "next/script";
import { authClient } from "@/lib/auth-client";
import { submitEntry, type SubmitEntryState } from "./actions";
import { DISPLAY_NAME_MAX_LENGTH, MESSAGE_MAX_LENGTH } from "@/lib/guestbook-constants";

const initialState: SubmitEntryState = {};

export default function GuestbookForm() {
    const { data: session } = authClient.useSession();
    const [state, formAction, isSubmitting] = useActionState(submitEntry, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
            // The Turnstile widget doesn't reset itself with the rest of the
            // form - ask it to issue a fresh token for the next submission.
            window.turnstile?.reset();
        }
    }, [state.success]);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    return (
        <form ref={formRef} action={formAction} className="guestbook-form">
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />

            {session ? (
                <div className="guestbook-form__identity">
                    {session.user.image ? (
                        <img src={session.user.image} alt="" className="guestbook-form__avatar" />
                    ) : null}
                    <div>
                        <strong>Posting as {session.user.name}</strong>
                        <button type="button" className="guestbook-form__signout" onClick={() => authClient.signOut()}>
                            Not you? Sign out
                        </button>
                    </div>
                </div>
            ) : (
                // Defaults to the anonymous field on first render (before the
                // client-side session check resolves) rather than rendering
                // nothing - most visitors aren't signed in, and this avoids a
                // form that's briefly missing its name field on first paint.
                <div className="guestbook-form__field">
                    <label htmlFor="displayName">Name</label>
                    <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        maxLength={DISPLAY_NAME_MAX_LENGTH}
                        placeholder="Pit crew name"
                        required
                        className="guestbook-input"
                    />
                </div>
            )}

            <div className="guestbook-form__field">
                <label htmlFor="message">Message</label>
                <textarea
                    id="message"
                    name="message"
                    maxLength={MESSAGE_MAX_LENGTH}
                    placeholder="How's the lap looking from where you're sitting?"
                    required
                    rows={4}
                    className="guestbook-textarea"
                />
            </div>

            {siteKey ? <div className="cf-turnstile" data-sitekey={siteKey} /> : null}

            <div className="guestbook-form__actions">
                <button type="submit" className="guestbook-form__submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send it over the radio"}
                </button>
                {!session ? (
                    <button
                        type="button"
                        className="guestbook-form__discord"
                        onClick={() => authClient.signIn.social({ provider: "discord", callbackURL: "/guestbook" })}
                    >
                        Continue with Discord
                    </button>
                ) : null}
            </div>

            {state.error ? <p className="guestbook-form__error">{state.error}</p> : null}
            {state.success ? (
                <p className="guestbook-form__success">
                    {session
                        ? "Posted - it's live above."
                        : "Sent - anonymous notes get a quick look before they show up."}
                </p>
            ) : null}
        </form>
    );
}
