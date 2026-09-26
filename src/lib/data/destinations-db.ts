import { unstable_cache } from "next/cache";
import type { Destination as DestinationRow } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Destination, Region } from "@/lib/types";

/** Cache tag for public destination data; admin actions invalidate it on every write. */
export const DESTINATIONS_TAG = "destinations";

/** Maps a DB row to the shape the public components were built against. */
function toDestination(row: DestinationRow): Destination {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    region: row.region as Region,
    rangeDivision: row.rangeDivision,
    overview: row.overview,
    accessibility: { road: row.accessRoad, ship: row.accessShip },
    bestTime: row.bestTime,
    timing: row.timing,
    permits: row.permits,
    fees: row.fees,
    activities: row.activities,
    facility: row.facility,
    accommodation: row.accommodation,
    hospital: row.hospital,
    nearbyPlaces: row.nearbyPlaces,
    conservationNotes: row.conservationNotes,
    ecoGuidelines: row.ecoGuidelines,
    safetyTips: row.safetyTips,
    whatToSee: row.whatToSee,
    image: row.image,
    heroImagePosition: row.heroImagePosition || undefined,
    // Pages fall back to the hero image when there's no gallery, so an empty
    // list must come through as "no gallery" rather than an empty strip.
    galleryImages: row.galleryImages.length ? row.galleryImages : undefined,
    galleryTitles: row.galleryTitles,
  };
}

/** All published destinations, in the order they were added. */
export const getPublishedDestinations = unstable_cache(
  async (): Promise<Destination[]> => {
    const rows = await prisma.destination.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    return rows.map(toDestination);
  },
  ["published-destinations"],
  { tags: [DESTINATIONS_TAG] },
);
