"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser, logAudit } from "@/lib/auth";
import type { ContentStatus } from "@prisma/client";

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
  heroImage: string;
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
    heroImage: input.heroImage,
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

  revalidatePath("/admin/activities");
}

export async function toggleActivityStatusAction(slug: string) {
  const user = await requireUser();
  const ip = await getClientIp();

  const current = await prisma.activity.findUniqueOrThrow({ where: { slug } });
  const nextStatus: ContentStatus = current.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  const updated = await prisma.activity.update({ where: { slug }, data: { status: nextStatus } });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: `${nextStatus === "PUBLISHED" ? "Published" : "Unpublished"} activity "${updated.title}"`,
  });

  revalidatePath("/admin/activities");
}
