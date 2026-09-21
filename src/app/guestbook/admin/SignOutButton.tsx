"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
    const router = useRouter();

    return (
        <button
            type="button"
            className="guestbook-form__discord"
            onClick={() =>
                authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => router.refresh(),
                    },
                })
            }
        >
            Sign out
        </button>
    );
}
