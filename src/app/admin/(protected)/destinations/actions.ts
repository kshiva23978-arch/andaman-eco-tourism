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

export type DestinationInput = {
  slug: string;
  title: string;
  subtitle: string;
  region: string;
  rangeDivision: string;
  overview: string;
  accessRoad: string;
  accessShip: string;
  bestTime: string;
  timing: string;
  permits: string;
  fees: string;
  activities: string[];
  facility: string[];
  accommodation: string;
  hospital: string;
  nearbyPlaces: string[];
  conservationNotes: string;
  ecoGuidelines: string[];
  safetyTips: string[];
  whatToSee: string[];
  image: string;
  heroImagePosition?: string;
  galleryImages: string[];
};

export async function saveDestinationAction(
  originalSlug: string | null,
  input: DestinationInput
) {
  const user = await requireUser();
  const ip = await getClientIp();

  if (!input.slug.trim()) {
    throw new Error("Slug is required.");
  }

  const data = {
    slug: input.slug.trim(),
    title: input.title,
    subtitle: input.subtitle,
    region: input.region,
    rangeDivision: input.rangeDivision,
    overview: input.overview,
    accessRoad: input.accessRoad,
    accessShip: input.accessShip,
    bestTime: input.bestTime,
    timing: input.timing,
    permits: input.permits,
    fees: input.fees,
    activities: input.activities,
    facility: input.facility,
    accommodation: input.accommodation,
    hospital: input.hospital,
    nearbyPlaces: input.nearbyPlaces,
    conservationNotes: input.conservationNotes,
    ecoGuidelines: input.ecoGuidelines,
    safetyTips: input.safetyTips,
    whatToSee: input.whatToSee,
    image: input.image,
    heroImagePosition: input.heroImagePosition || null,
    galleryImages: input.galleryImages,
  };

  const isNew = !originalSlug;

  const saved = isNew
    ? await prisma.destination.create({ data: { ...data, status: "DRAFT" } })
    : await prisma.destination.update({ where: { slug: originalSlug }, data });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: isNew
      ? `Created destination "${saved.title}"`
      : `Updated destination "${saved.title}"`,
  });

  revalidatePath("/admin/destinations");
  revalidatePath(`/admin/destinations/${saved.slug}`);

  return { slug: saved.slug };
}

export async function deleteDestinationAction(slug: string) {
  const user = await requireUser();
  const ip = await getClientIp();

  const destination = await prisma.destination.delete({ where: { slug } });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    severity: "WARNING",
    message: `Deleted destination "${destination.title}"`,
  });

  revalidatePath("/admin/destinations");
}

export async function toggleDestinationStatusAction(slug: string) {
  const user = await requireUser();
  const ip = await getClientIp();

  const current = await prisma.destination.findUniqueOrThrow({ where: { slug } });
  const nextStatus: ContentStatus = current.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  const updated = await prisma.destination.update({
    where: { slug },
    data: { status: nextStatus },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: `${nextStatus === "PUBLISHED" ? "Published" : "Unpublished"} destination "${updated.title}"`,
  });

  revalidatePath("/admin/destinations");
}
