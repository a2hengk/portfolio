/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["127.0.0.1", "localhost"],
    experimental: {
        // The root layout lives in app/[lang], so there's no single layout
        // to build a 404 from - app/global-not-found.tsx renders its own
        // full document instead (see the not-found docs for this case).
        globalNotFound: true,
    },
};

export default nextConfig;
