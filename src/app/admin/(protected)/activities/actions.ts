"use server";

import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser, logAudit } from "@/lib/auth";
import type { BackgroundType, ContentStatus } from "@prisma/client";
import type { BackgroundConfig } from "@/components/admin/AdminUI";
import { ACTIVITIES_TAG } from "@/lib/data/activities-db";

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

export type ActivityGuidelineInput = { icon: string; title: string; body: string };

export type ActivityInput = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  /** Hero banner background; `image` holds the hero image path. */
  heroBackground: BackgroundConfig;
  overview: string[];
  duration: string;
  difficulty: string;
  guidelines: ActivityGuidelineInput[];
  equipmentProvided: string[];
  permitNote: string;
  destinationSlugs: string[];
  relatedActivitySlugs: string[];
  guideBody: string;
  guideBullets: string[];
  galleryImages: string[];
  galleryTitles: string[];
};

const HERO_BACKGROUND_TYPE: Record<BackgroundConfig["type"], BackgroundType> = {
  image: "IMAGE",
  color: "COLOR",
  plain: "PLAIN",
};

export async function saveActivityAction(originalSlug: string | null, input: ActivityInput) {
  const user = await requireUser();
  const ip = await getClientIp();

  if (!input.slug.trim()) {
    throw new Error("Slug is required.");
  }

  const data = {
    slug: input.slug.trim(),
    title: input.title,
    tagline: input.tagline,
    icon: input.icon,
    // The hero image path is kept even when another background type is chosen, so
    // switching back to "Image" doesn't lose it (and cards/listings still use it).
    heroImage: input.heroBackground.image,
    heroBackgroundType: HERO_BACKGROUND_TYPE[input.heroBackground.type],
    heroBackgroundColor: input.heroBackground.color,
    heroOverlayEnabled: input.heroBackground.overlay.enabled,
    heroOverlayColor: input.heroBackground.overlay.color,
    heroOverlayOpacity: input.heroBackground.overlay.opacity,
    overview: input.overview,
    duration: input.duration,
    difficulty: input.difficulty,
    equipmentProvided: input.equipmentProvided,
    permitNote: input.permitNote,
    destinationSlugs: input.destinationSlugs,
    relatedActivitySlugs: input.relatedActivitySlugs,
    guideBody: input.guideBody,
    guideBullets: input.guideBullets,
    galleryImages: input.galleryImages,
    galleryTitles: input.galleryImages.map((_, i) => input.galleryTitles[i]?.trim() ?? ""),
  };

  const isNew = !originalSlug;

  const saved = isNew
    ? await prisma.activity.create({ data: { ...data, status: "DRAFT" } })
    : await prisma.activity.update({ where: { slug: originalSlug }, data });

  await prisma.activityGuideline.deleteMany({ where: { activityId: saved.id } });
  if (input.guidelines.length) {
    await prisma.activityGuideline.createMany({
      data: input.guidelines.map((g, i) => ({
        activityId: saved.id,
        icon: g.icon,
        title: g.title,
        body: g.body,
        order: i,
      })),
    });
  }

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: isNew ? `Created activity "${saved.title}"` : `Updated activity "${saved.title}"`,
  });

  updateTag(ACTIVITIES_TAG);
  revalidatePath("/admin/activities");
  revalidatePath(`/admin/activities/${saved.slug}`);

  return { slug: saved.slug };
}

export async function deleteActivityAction(slug: string) {
  const user = await requireUser();
  const ip = await getClientIp();

  const activity = await prisma.activity.delete({ where: { slug } });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    severity: "WARNING",
    message: `Deleted activity "${activity.title}"`,
  });

  updateTag(ACTIVITIES_TAG);
  revalidatePath("/admin/activities");
}

export async function setActivityStatusAction(slug: string, nextStatus: ContentStatus) {
  const user = await requireUser();
  const ip = await getClientIp();

  if (nextStatus !== "PUBLISHED" && nextStatus !== "DRAFT") {
    throw new Error("Invalid status.");
  }
  const updated = await prisma.activity.update({ where: { slug }, data: { status: nextStatus } });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: `${nextStatus === "PUBLISHED" ? "Published" : "Unpublished"} activity "${updated.title}"`,
  });

  updateTag(ACTIVITIES_TAG);
  revalidatePath("/admin/activities");
  revalidatePath(`/admin/activities/${slug}`);
}
