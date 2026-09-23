import type { Metadata } from "next";
import { Fraunces, Public_Sans, Yeseva_One } from "next/font/google";
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageLoader } from "@/components/ui/PageLoader";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ClickSpark } from "@/components/ui/ClickSpark";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";

fontAwesomeConfig.autoAddCss = false;

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

export const metadata: Metadata = {
  title: {
    default: "Andaman & Nicobar Ecotourism",
    template: "%s | Andaman & Nicobar Ecotourism",
  },
  description:
    "Official ecotourism portal for the Andaman & Nicobar Islands — destinations, activities, permits and conservation guidelines from the Department of Environment & Forests.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${publicSans.variable} ${yesevaOne.variable} ${fraunces.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body-md text-body-md antialiased flex flex-col min-h-screen">
        <PageLoader />
        <SmoothScroll />
        <ClickSpark />
        <SiteHeader />
        <main className="flex-grow">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
