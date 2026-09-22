import { destinations } from "@/lib/data/destinations";
import type { Destination } from "@/lib/types";

/**
 * Returns the text up to its first real sentence break. A naive split on
 * "." breaks on abbreviations like "G.B. Pant Hospital" (yielding just "G"),
 * so periods are only treated as a break when they aren't a short
 * all-caps initial (e.g. "G.", "B.") and are followed by whitespace or the
 * end of the string.
 */
export function firstClause(text: string, maxLength = 48): string {
  const trimmed = text.trim();
  const breakRegex = /[.\n]/g;
  let match: RegExpExecArray | null;

  while ((match = breakRegex.exec(trimmed))) {
    const index = match.index;
    const before = trimmed.slice(0, index);
    const after = trimmed.slice(index + 1);

    if (match[0] === ".") {
      const lastWord = before.match(/[A-Za-z]+$/)?.[0] ?? "";
      const isInitial = lastWord.length > 0 && lastWord.length <= 3 && lastWord === lastWord.toUpperCase();
      if (isInitial) continue;
      if (after.length > 0 && !/^\s/.test(after)) continue;
    }

    const clause = before.trim();
    if (clause.length > 0) {
      return clause.length <= maxLength ? clause : `${clause.slice(0, maxLength).trim()}…`;
    }
  }

  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}…`;
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
