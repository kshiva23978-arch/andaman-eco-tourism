import type { NextConfig } from "next";

// Content-Security-Policy is set per request (with a nonce) in src/proxy.ts.
const securityHeaders = [
  // Only honoured over HTTPS; ignored on local http://localhost.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Legacy XSS auditor is disabled per OWASP guidance; CSP replaces it.
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version to scanners.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
