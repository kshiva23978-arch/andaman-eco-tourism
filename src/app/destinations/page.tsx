import type { Metadata } from "next";
import { DestinationsExplorer } from "@/components/destinations/DestinationsExplorer";
import { destinations } from "@/lib/data/destinations";

export const metadata: Metadata = {
  title: "Destinations Directory",
  description:
    "Browse every officially documented destination across the Andaman & Nicobar Islands — beaches, national parks, mangrove walks, sanctuaries and more.",
};

export default function DestinationsPage() {
  return (
    <>
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 mb-4">
        <div className="border-l-4 border-primary pl-6 py-2">
          <h1 className="font-headline-xl text-3xl md:text-headline-xl text-primary mb-2">
            Destinations Directory
          </h1>
        </div>
      </section>
      <DestinationsExplorer destinations={destinations} />
      <div className="h-20" />
    </>
  );
}
