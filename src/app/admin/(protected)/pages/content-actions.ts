"use server";

import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requirePermission, logAudit } from "@/lib/auth";
import {
  PAGE_CONTENT_TAG,
  PAGE_NORMALIZERS,
  type PageContentOf,
  type PageKey,
} from "@/lib/content/page-content-db";

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

const PAGE_LABELS: Record<PageKey, string> = {
  home: "home page",
  destinations: "destinations directory page",
  "destination-page": "destination page layout",
  activities: "activities guide page",
  "activity-page": "activity page layout",
};

/** Saves one page's content document. Input is re-validated, never trusted as-is. */
export async function savePageContentAction<K extends PageKey>(
  key: K,
  input: PageContentOf<K>,
): Promise<PageContentOf<K>> {
  const user = await requirePermission("edit_content");
  const ip = await getClientIp();

  if (!Object.hasOwn(PAGE_NORMALIZERS, key)) throw new Error("Unknown page.");
  const normalize = PAGE_NORMALIZERS[key] as (value: unknown) => PageContentOf<K>;
  const data = normalize(input);

  await prisma.pageContent.upsert({
    where: { key },
    update: { data },
    create: { key, data },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: `Updated ${PAGE_LABELS[key]} content`,
  });

  updateTag(PAGE_CONTENT_TAG);
  revalidatePath("/admin/pages", "layout");
  return data;
}
