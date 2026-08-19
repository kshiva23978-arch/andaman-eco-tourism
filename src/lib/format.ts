import { destinations } from "@/lib/data/destinations";
import type { Destination } from "@/lib/types";

export function firstClause(text: string, maxLength = 48): string {
  const clause = text.split(/[.\n]/)[0]?.trim() ?? text;
  if (clause.length <= maxLength) return clause;
  return `${clause.slice(0, maxLength).trim()}…`;
}

/**
 * "Nearby places" in the source data are free-text (e.g. "Jolly Buoy Island
 * (same marine park; alternate snorkeling spot)"). This tries to match that
 * text against a real destination title so the site can cross-link nearby
 * places instead of rendering them as dead text.
 */
export function findNearbyDestination(
  nearbyText: string,
  currentSlug: string
): Destination | undefined {
  const normalized = nearbyText.toLowerCase();
  return destinations.find(
    (d) =>
      d.slug !== currentSlug &&
      d.title.length > 3 &&
      normalized.includes(d.title.toLowerCase())
  );
}
