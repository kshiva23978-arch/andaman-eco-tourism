import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { DestinationPin } from "@/lib/data/destination-pins";

/** Cache tag for the homepage map pins; the map editor invalidates it on save. */
export const MAP_PINS_TAG = "map-pins";

/** Homepage map pins in the order set in the admin map editor. */
export const getMapPins = unstable_cache(
  async (): Promise<DestinationPin[]> => {
    const rows = await prisma.mapPin.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
    return rows.map((p) => ({
      slug: p.destinationSlug ?? undefined,
      label: p.label,
      lat: p.lat,
      lng: p.lng,
      featured: p.featured || undefined,
      dir: p.dir === "LEFT" ? "left" : "right",
      approx: p.approx ? true : undefined,
    }));
  },
  ["map-pins"],
  { tags: [MAP_PINS_TAG] },
);
