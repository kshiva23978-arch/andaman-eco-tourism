import type { Destination, Region } from "@/lib/types";
import raw from "./destinations.generated.json";

export const destinations = raw as Destination[];

export const regions: Region[] = [
  "South Andaman",
  "Diglipur",
  "Mayabunder",
  "Middle Andaman",
  "Baratang",
  "Little Andaman",
  "Swaraj Dweep",
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getDestinationsBySlugs(slugs: string[]): Destination[] {
  return slugs
    .map((slug) => getDestinationBySlug(slug))
    .filter((d): d is Destination => Boolean(d));
}

export function getDestinationsByRegion(region: Region): Destination[] {
  return destinations.filter((d) => d.region === region);
}

/** Curated subset for the homepage carousel. */
export const featuredDestinationSlugs = [
  "radhanagar-beach",
  "jolly-buoy-island",
  "limestone-caves-baratang",
  "cuthbert-bay-beach-wildlife-sanctuary",
  "saddle-peak-national-park",
  "elephanta-beach",
];
