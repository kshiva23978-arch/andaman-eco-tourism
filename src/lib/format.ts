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
 * Lowercases, drops any parenthetical aside, strips punctuation/spacing and
 * collapses doubled letters — so "Amkunj Beach (~15 km)" and "Aamkunj Beach"
 * (or "Dhani Nallah" vs "Dhaninallah") normalize to the same string. Source
 * data spells the same place inconsistently across documents, and this is
 * cheap enough to tolerate that without a real fuzzy-match dependency.
 */
function squash(text: string): string {
  return text
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]/g, "")
    .replace(/(.)\1+/g, "$1");
}

const NEARBY_STOPWORDS = new Set(["and", "the", "of", "in", "near", "at", "a", "an", "to"]);

/** Same normalization as `squash`, kept as separate words for the core-word fallback below. */
function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/&/g, " and ")
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.replace(/(.)\1+/g, "$1"))
    .filter((w) => w.length >= 3 && !NEARBY_STOPWORDS.has(w));
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
  const mentionSquash = squash(nearbyText);
  const candidates = destinations.filter((d) => d.slug !== currentSlug && d.title.length > 3);

  // Pass 1: one of the two squashed strings contains the other — covers an
  // exact title mention, a short title embedded in a longer one ("Limestone
  // Caves" in "Baratang Limestone Caves"), a mention that's just the title's
  // lead words ("Biological Park" for "Biological Park, Chidiyatapu"), and
  // minor spelling/spacing variants, all in one comparison.
  const exact = candidates.find((d) => {
    const titleSquash = squash(d.title);
    if (titleSquash.length < 5 || mentionSquash.length < 5) return false;
    return titleSquash.includes(mentionSquash) || mentionSquash.includes(titleSquash);
  });
  if (exact) return exact;

  // Pass 2: the title and mention share the same identifying words but
  // diverge after that — e.g. "Yerrata Mangrove Park & Watch Tower" vs. the
  // real title "Yerrata Mangrove Walkway". Compare the first two significant
  // words of whichever side is shorter against the other side's full word
  // set; requiring both (not just one) avoids matching on a single generic
  // shared word like "beach" or "island".
  const mentionWords = significantWords(nearbyText);
  const mentionWordSet = new Set(mentionWords);
  return candidates.find((d) => {
    const titleWords = significantWords(d.title);
    if (titleWords.length === 0 || mentionWords.length === 0) return false;
    const [core, targetSet] =
      titleWords.length <= mentionWords.length
        ? [titleWords.slice(0, 2), mentionWordSet]
        : [mentionWords.slice(0, 2), new Set(titleWords)];
    if (core.length < 2) return false;
    return core.every((w) => targetSet.has(w));
  });
}
