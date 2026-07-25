import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_DEV_URL || "http://localhost:5000";

/**
 * CSP tuned for this app:
 * - Next.js / React hydration (script unsafe-inline + unsafe-eval)
 * - MUI Emotion inline styles
 * - Google Fonts (Bitter)
 * - Google favicon images on vault cards
 * - API calls to the Express backend
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://www.google.com",
  isProd
    ? `connect-src 'self' ${apiBaseUrl}`
    : `connect-src 'self' ${apiBaseUrl} ws: wss:`,
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
      "clipboard-read=(self)",
      "clipboard-write=(self)",
    ].join(", "),
  },
  // Browsers ignore HSTS on plain HTTP; required for HTTPS production.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    domains: ["www.google.com"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/profile/managepasswords",
        destination: "/vault",
        permanent: true,
      },
      {
        source: "/profile/manageaccount",
        destination: "/settings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
