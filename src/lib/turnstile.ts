export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
    if (!token) {
        return false;
    }

    const body = new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY ?? "",
        response: token,
    });
    if (ip) {
        body.set("remoteip", ip);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!response.ok) {
        return false;
    }

    const data = (await response.json()) as { success: boolean };
    return data.success === true;
}
