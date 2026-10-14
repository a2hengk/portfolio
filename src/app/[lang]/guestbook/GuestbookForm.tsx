"use client";

import { useActionState, useEffect, useRef } from "react";
import Script from "next/script";
import { authClient } from "@/lib/auth-client";
import { submitEntry, type SubmitEntryState } from "./actions";
import { DISPLAY_NAME_MAX_LENGTH, MESSAGE_MAX_LENGTH } from "@/lib/guestbook-constants";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { fill, localizedHref, type Locale } from "@/i18n/config";

const initialState: SubmitEntryState = {};

export default function GuestbookForm({ lang, dict }: { lang: Locale; dict: Dictionary["guestbook"]["form"] }) {
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
    // The action returns an error key, translated here.
    const errorText = state.error
        ? (dict.errors as Record<string, string>)[state.error] ?? dict.errors.invalid
        : null;

    return (
        <form ref={formRef} action={formAction} className="guestbook-form">
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />

            {session ? (
                <div className="guestbook-form__identity">
                    {session.user.image ? (
                        <img src={session.user.image} alt="" className="guestbook-form__avatar" />
                    ) : null}
                    <div>
                        <strong>{fill(dict.postingAs, { name: session.user.name })}</strong>
                        <button type="button" className="guestbook-form__signout" onClick={() => authClient.signOut()}>
                            {dict.signOut}
                        </button>
                    </div>
                </div>
            ) : (
                // Defaults to the anonymous field on first render (before the
                // client-side session check resolves) rather than rendering
                // nothing - most visitors aren't signed in, and this avoids a
                // form that's briefly missing its name field on first paint.
                <div className="guestbook-form__field">
                    <label htmlFor="displayName">{dict.nameLabel}</label>
                    <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        maxLength={DISPLAY_NAME_MAX_LENGTH}
                        placeholder={dict.namePlaceholder}
                        required
                        className="guestbook-input"
                    />
                </div>
            )}

            <div className="guestbook-form__field">
                <label htmlFor="message">{dict.messageLabel}</label>
                <textarea
                    id="message"
                    name="message"
                    maxLength={MESSAGE_MAX_LENGTH}
                    placeholder={dict.messagePlaceholder}
                    required
                    rows={4}
                    className="guestbook-textarea"
                />
            </div>

            {siteKey ? <div className="cf-turnstile" data-sitekey={siteKey} /> : null}

            <div className="guestbook-form__actions">
                <button type="submit" className="guestbook-form__submit" disabled={isSubmitting}>
                    {isSubmitting ? dict.sending : dict.submit}
                </button>
                {!session ? (
                    <button
                        type="button"
                        className="guestbook-form__discord"
                        onClick={() =>
                            authClient.signIn.social({ provider: "discord", callbackURL: localizedHref(lang, "/guestbook") })
                        }
                    >
                        {dict.discord}
                    </button>
                ) : null}
            </div>

            {errorText ? <p className="guestbook-form__error">{errorText}</p> : null}
            {state.success ? (
                <p className="guestbook-form__success">
                    {session ? dict.postedLive : dict.postedPending}
                </p>
            ) : null}
        </form>
    );
}
