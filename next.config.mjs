/** @type {import('next').NextConfig} */

// Upstream User Order service — proxied through Next so browser requests stay
// same-origin (the service does not send CORS headers for localhost).
const API_UPSTREAM =
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://www.microservices.tech";

// Security headers applied to every route. HSTS is intentionally scoped to
// the deployed origin (browsers ignore it on http/localhost).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Tuned to the layout's real breakpoints (see tailwind.config screens).
    deviceSizes: [360, 430, 640, 750, 828, 1080, 1200, 1320, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Short optimizer cache so swapped images (same filename, new content) don't
    // linger for a year. Static assets with hashed URLs still get long cache
    // via the /_next/static header rule below.
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["gsap"],
  },
  async rewrites() {
    // Proxy every backend path to the User Order service so the browser only
    // ever sees same-origin `/api/*` calls (no CORS).
    return [
      { source: "/api/:path*", destination: `${API_UPSTREAM}/api/:path*` },
      { source: "/health", destination: `${API_UPSTREAM}/health` },
      { source: "/uploads/:path*", destination: `${API_UPSTREAM}/uploads/:path*` },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Immutable, content-hashed static assets can be cached forever.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Raw /public/images/* served directly (not via Next Image optimizer).
        // Force browsers to revalidate so replaced files show up immediately
        // instead of serving a stale copy from cache.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
