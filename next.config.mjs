/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["127.0.0.1", "localhost"],
    experimental: {
        // The root layout lives in app/[lang], so there's no single layout
        // to build a 404 from - app/global-not-found.tsx renders its own
        // full document instead (see the not-found docs for this case).
        globalNotFound: true,
    },
    // The old standalone pages are sections of the one-pager now. Old links
    // land on the matching anchor instead of the 404. Unprefixed paths
    // (/about) get their locale from the proxy first, then end up here.
    async redirects() {
        return [
            ["about", "about"],
            ["experience", "path"],
            ["projects", "builds"],
            ["off-duty", "offduty"],
            ["uses", "stack"],
        ].map(([page, anchor]) => ({
            source: `/:lang(en|de)/${page}`,
            destination: `/:lang#${anchor}`,
            permanent: true,
        }));
    },
};

export default nextConfig;
