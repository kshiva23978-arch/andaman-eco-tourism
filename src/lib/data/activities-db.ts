import { unstable_cache } from "next/cache";
import type { Activity as ActivityRow, ActivityGuideline as GuidelineRow } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Activity } from "@/lib/types";

/** Cache tag for public activity data; admin actions invalidate it on every write. */
export const ACTIVITIES_TAG = "activities";

/** Maps a DB row to the shape the public components were built against. */
function toActivity(row: ActivityRow & { guidelines: GuidelineRow[] }): Activity {
  return {
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    icon: row.icon,
    heroImage: row.heroImage,
    overview: row.overview,
    duration: row.duration,
    difficulty: row.difficulty,
    guidelines: row.guidelines.map((g) => ({ icon: g.icon, title: g.title, body: g.body })),
    equipmentProvided: row.equipmentProvided,
    permitNote: row.permitNote,
    destinationSlugs: row.destinationSlugs,
    relatedActivitySlugs: row.relatedActivitySlugs,
    guideBody: row.guideBody,
    guideCallout: row.guideCallout || undefined,
    guideBullets: row.guideBullets.length ? row.guideBullets : undefined,
    // Pages fall back to the hero image when there's no gallery.
    galleryImages: row.galleryImages.length ? row.galleryImages : undefined,
    galleryTitles: row.galleryTitles,
    heroBackground: {
      type:
        row.heroBackgroundType === "COLOR"
          ? "color"
          : row.heroBackgroundType === "PLAIN"
            ? "plain"
            : "image",
      color: row.heroBackgroundColor ?? "#0f2b1e",
      overlay: {
        enabled: row.heroOverlayEnabled,
        color: row.heroOverlayColor,
        opacity: row.heroOverlayOpacity,
      },
    },
  };
}

/** All published activities, in the order they were added. */
export const getPublishedActivities = unstable_cache(
  async (): Promise<Activity[]> => {
    const rows = await prisma.activity.findMany({
      where: { status: "PUBLISHED" },
      include: { guidelines: { orderBy: { order: "asc" } } },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    return rows.map(toActivity);
  },
  ["published-activities"],
  { tags: [ACTIVITIES_TAG] },
);

/** Resolves slugs against a list, keeping the slug order and skipping unknown/draft ones. */
export function pickBySlugs<T extends { slug: string }>(items: T[], slugs: string[]): T[] {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  return slugs.map((slug) => bySlug.get(slug)).filter((item): item is T => Boolean(item));
}
