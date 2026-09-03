import type { Metadata } from "next";
import { DestinationsExplorer } from "@/components/destinations/DestinationsExplorer";
import { destinations } from "@/lib/data/destinations";
import { DecorativeLeaf } from "@/components/ui/DecorativeLeaf";
import { Birdinhand } from "@/components/ui/Birdinhand";
import { FloatingPhotoStack } from "@/components/ui/FloatingPhotoStack";

export const metadata: Metadata = {
  title: "Destinations Directory",
  description:
    "Browse every officially documented destination across the Andaman & Nicobar Islands — beaches, national parks, mangrove walks, sanctuaries and more.",
};

export default function DestinationsPage() {
  return (
    <div className="relative">
      <FloatingPhotoStack side="left" />
      <FloatingPhotoStack side="right" />

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 mb-4">
        <div className="border-l-4 border-primary pl-6 py-2">
          <h1 className="font-headline-xl text-3xl md:text-headline-xl text-primary mb-2">
            Destinations Directory
          </h1>
        </div>
      </section>
      <DecorativeLeaf className="bottom-6 left-4 md:bottom-10 md:left-8" rotate={-25} size={110} opacity={0.22} />


      <DestinationsExplorer destinations={destinations} />
      <DecorativeLeaf className="top-8 right-6 md:top-12 md:right-16" rotate={0} size={160} opacity={0.5} />

      <div className="h-20" />
    </div>
  );
}
