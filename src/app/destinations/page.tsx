import type { Metadata } from "next";
import { DestinationsExplorer } from "@/components/destinations/DestinationsExplorer";
import { DestinationsBanner } from "@/components/destinations/DestinationsBanner";
import { destinations, regions } from "@/lib/data/destinations";
import { DecorativeLeaf } from "@/components/ui/DecorativeLeaf";

export const metadata: Metadata = {
  title: "Destinations Directory",
  description:
    "Browse every officially documented destination across the Andaman & Nicobar Islands — beaches, national parks, mangrove walks, sanctuaries and more.",
};

export default function DestinationsPage() {
  return (
    <div className="relative">
      <DestinationsBanner destinationCount={destinations.length} regionCount={regions.length} />

      <DecorativeLeaf className="bottom-6 left-4 md:bottom-10 md:left-8" rotate={-25} size={110} opacity={0.22} delay={4} />

      <div id="destinations-explorer" className="scroll-mt-24 pt-12 md:pt-16">
        <DestinationsExplorer destinations={destinations} />
      </div>
      <DecorativeLeaf className="top-8 right-6 md:top-12 md:right-16" rotate={0} size={160} opacity={0.5} delay={8} />

      <div className="h-20" />
    </div>
  );
}
