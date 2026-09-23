import { NextResponse, type NextRequest } from "next/server";

/**
 * Per-request Content-Security-Policy with a fresh nonce.
 *
 * Next.js reads the nonce from the request's CSP header while rendering and stamps it
 * on its own <script>/<style> tags, so no 'unsafe-inline' is needed for scripts.
 * This requires dynamic rendering — see `connection()` in app/layout.tsx.
 *
 * External origins are limited to what the site actually uses:
 *   - Google Maps embeds (GoogleMap, EcoGuidelinesSection) — iframes only
 *   - OpenStreetMap tiles (AndamanLeafletMap)
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  // <style>/<link> elements need the nonce in production. In dev, the error overlay and
  // HMR inject un-nonced <style> tags, and browsers ignore 'unsafe-inline' whenever a
  // nonce is present — so dev drops the nonce from style sources instead.
  const styleSources = isDev ? "'self' 'unsafe-inline'" : `'self' 'nonce-${nonce}'`;

  const csp = [
    "default-src 'self'",
    // 'strict-dynamic' lets nonce'd Next.js chunks load the chunks they import.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src ${styleSources}`,
    `style-src-elem ${styleSources}`,
    // style="" attributes (React inline styles, Leaflet markers) can't run script.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.tile.openstreetmap.org",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-src https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only — build assets, optimised images, public files (anything with an
      // extension) and prefetches don't need a CSP.
      source: "/((?!_next/static|_next/image|.*\\.\\w+$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
