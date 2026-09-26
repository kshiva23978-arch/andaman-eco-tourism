import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { normalizeHome } from "@/lib/content/home";
import { normalizeDestinationPage, normalizeDestinationsList } from "@/lib/content/destinations";
import { normalizeActivitiesGuide, normalizeActivityPage } from "@/lib/content/activities";

/** Cache tag for editable page content; the page editors invalidate it on save. */
export const PAGE_CONTENT_TAG = "page-content";

/** Page keys and how each one's stored JSON is normalized. */
export const PAGE_NORMALIZERS = {
  home: normalizeHome,
  destinations: normalizeDestinationsList,
  "destination-page": normalizeDestinationPage,
  activities: normalizeActivitiesGuide,
  "activity-page": normalizeActivityPage,
} as const;

export type PageKey = keyof typeof PAGE_NORMALIZERS;
export type PageContentOf<K extends PageKey> = ReturnType<(typeof PAGE_NORMALIZERS)[K]>;

/** Raw stored JSON per page key (cached); normalized by the typed getter below. */
const getStoredContent = unstable_cache(
  async (key: PageKey) => {
    const row = await prisma.pageContent.findUnique({ where: { key } });
    return row?.data ?? null;
  },
  ["page-content"],
  { tags: [PAGE_CONTENT_TAG] },
);

/** A page's content from the database, with any unset fields filled from its defaults. */
export async function getPageContent<K extends PageKey>(key: K): Promise<PageContentOf<K>> {
  const normalize = PAGE_NORMALIZERS[key] as (input: unknown) => PageContentOf<K>;
  return normalize(await getStoredContent(key));
}

export const getHomeContent = () => getPageContent("home");
