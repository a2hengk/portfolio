"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { authClient } from "@/lib/auth-client";
import { submitEntry, type SubmitEntryState } from "./actions";
import { DISPLAY_NAME_MAX_LENGTH, MESSAGE_MAX_LENGTH } from "@/lib/guestbook-constants";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { fill, localizedHref, type Locale } from "@/i18n/config";
import styles from "./pitwall.module.css";

const initialState: SubmitEntryState = {};

export default function GuestbookForm({ lang, dict }: { lang: Locale; dict: Dictionary["guestbook"]["form"] }) {
    const { data: session } = authClient.useSession();
    const [state, formAction, isSubmitting] = useActionState(submitEntry, initialState);
    const [length, setLength] = useState(0);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
            setLength(0);
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
        <form ref={formRef} action={formAction} className={styles.form}>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />

            <h2 id="pit-radio">{dict.title}</h2>

            {session ? (
                <div className={styles.identity}>
                    {session.user.image ? <img src={session.user.image} alt="" className={styles.avatar} /> : null}
                    <div>
                        <strong>{fill(dict.postingAs, { name: session.user.name })}</strong>
                        <button type="button" className={styles.signOut} onClick={() => authClient.signOut()}>
                            {dict.signOut}
                        </button>
                    </div>
                </div>
            ) : (
                // Defaults to the anonymous field on first render (before the
                // client-side session check resolves) rather than rendering
                // nothing - most visitors aren't signed in, and this avoids a
                // form that's briefly missing its name field on first paint.
                <div className={styles.field}>
                    <label htmlFor="displayName">{dict.nameLabel}</label>
                    <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        maxLength={DISPLAY_NAME_MAX_LENGTH}
                        placeholder={dict.namePlaceholder}
                        required
                        className={styles.input}
                    />
                </div>
            )}

            <div className={styles.field}>
                <label htmlFor="message">{dict.messageLabel}</label>
                <textarea
                    id="message"
                    name="message"
                    maxLength={MESSAGE_MAX_LENGTH}
                    placeholder={dict.messagePlaceholder}
                    required
                    rows={4}
                    className={styles.input}
                    aria-describedby="message-count"
                    onChange={(event) => setLength(event.target.value.length)}
                />
                <span id="message-count" className={`mut ${styles.count}`}>
                    {fill(dict.count, { count: length, max: MESSAGE_MAX_LENGTH })}
                </span>
            </div>

            {siteKey ? <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" /> : null}

            <div className={styles.actions}>
                <button type="submit" className="btn btn-w" disabled={isSubmitting}>
                    {isSubmitting ? dict.sending : dict.submit}
                </button>
                {!session ? (
                    <button
                        type="button"
                        className="btn btn-g"
                        onClick={() =>
                            authClient.signIn.social({ provider: "discord", callbackURL: localizedHref(lang, "/guestbook") })
                        }
                    >
                        {dict.discord}
                    </button>
                ) : null}
            </div>

            {errorText ? (
                <p className={styles.error} role="alert">
                    {errorText}
                </p>
            ) : null}
            {state.success ? (
                <p className={styles.success} role="status">
                    {session ? dict.postedLive : dict.postedPending}
                </p>
            ) : null}
        </form>
    );
}
