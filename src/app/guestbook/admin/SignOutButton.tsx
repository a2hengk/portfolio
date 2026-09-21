"use client";

import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
    return (
        <button
            type="button"
            className="guestbook-form__discord"
            onClick={() =>
                authClient.signOut({
                    fetchOptions: {
                        // Full reload instead of router.refresh() - makes the
                        // signed-out state unambiguous instead of relying on
                        // the router cache picking up the change.
                        onSuccess: () => {
                            window.location.href = "/guestbook/admin";
                        },
                    },
                })
            }
        >
            Sign out
        </button>
    );
}
