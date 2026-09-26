import { getPublishedDestinations } from "@/lib/data/destinations-db";
import { getPublishedActivities, pickBySlugs } from "@/lib/data/activities-db";
import { getMapPins } from "@/lib/data/map-pins-db";
import { getHomeContent } from "@/lib/content/page-content-db";
import { HomeClient } from "./HomeClient";

// Rendered per request so it never needs the database at build time; the queries
// themselves are cached and refreshed whenever an admin saves.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, destinations, activities, pins] = await Promise.all([
    getHomeContent(),
    getPublishedDestinations(),
    getPublishedActivities(),
    getMapPins(),
  ]);

  const published = new Set(destinations.map((d) => d.slug));
  // Pins linked to a draft/deleted destination are hidden rather than left pointing at a 404.
  const mapPins = pins.filter((pin) => !pin.slug || published.has(pin.slug));

  return (
    <HomeClient
      content={content}
      featuredDestinations={pickBySlugs(destinations, content.featuredDestinations.slugs)}
      featuredActivities={pickBySlugs(activities, content.featuredActivities.slugs)}
      destinationCount={destinations.length}
      activityCount={activities.length}
      mapPins={mapPins}
    />
  );
}
