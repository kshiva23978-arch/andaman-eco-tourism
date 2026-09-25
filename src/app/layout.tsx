import type { Metadata } from "next";
import { Fraunces, Public_Sans, Yeseva_One } from "next/font/google";
import { connection } from "next/server";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ClickSpark } from "@/components/ui/ClickSpark";
import "@fortawesome/fontawesome-svg-core/styles.css";
// Self-hosted icon font — keeps the site free of third-party font CDNs.
import "material-symbols/outlined.css";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const yesevaOne = Yeseva_One({
  variable: "--font-yeseva",
  subsets: ["latin"],
  weight: ["400"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Force every route in the app to render on-demand, per request — no route is
// ever prerendered/cached as static HTML. `connection()` below already causes
// this as a side effect; this declares it explicitly so it can't regress if
// that call is ever removed or refactored.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Andaman & Nicobar Ecotourism",
    template: "%s | Andaman & Nicobar Ecotourism",
  },
  description:
    "Official ecotourism portal for the Andaman & Nicobar Islands — destinations, activities, permits and conservation guidelines from the Department of Environment & Forests.",
  verification: {
    google: "8XuMI2ugyPXGQoeclpGx9fDlFWOOGa8ahFXWB890hsY",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Render per request so Next.js can stamp the CSP nonce from src/proxy.ts on its scripts.
  await connection();

  return (
    <html lang="en" className={`${publicSans.variable} ${yesevaOne.variable} ${fraunces.variable}`}>
      <body className="font-body-md text-body-md antialiased flex flex-col min-h-screen">
        <SmoothScroll />
        <ClickSpark />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
