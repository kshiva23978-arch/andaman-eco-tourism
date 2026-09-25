"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser, logAudit } from "@/lib/auth";
import type { BackgroundConfig } from "@/components/admin/AdminUI";

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

export type SectionInput = {
  name: string;
  description: string;
  pages: string[];
  targetType?: "destination" | "activity" | null;
  targetSlug?: string | null;
  targetTitle?: string | null;
  headline?: string | null;
  body?: string | null;
  background: BackgroundConfig;
  gallery: string[];
};

function flattenBackground(background: BackgroundConfig) {
  return {
    backgroundType: background.type === "color" ? ("COLOR" as const) : ("IMAGE" as const),
    backgroundImage: background.type === "image" ? background.image : null,
    backgroundColor: background.type === "color" ? background.color : null,
    overlayEnabled: background.overlay.enabled,
    overlayColor: background.overlay.color,
    overlayOpacity: background.overlay.opacity,
  };
}

export async function createSectionAction(input: SectionInput) {
  const user = await requireUser();
  const ip = await getClientIp();

  const section = await prisma.section.create({
    data: {
      name: input.name,
      description: input.description,
      pages: input.pages,
      targetType: input.targetType ?? null,
      targetSlug: input.targetSlug ?? null,
      targetTitle: input.targetTitle ?? null,
      headline: input.headline ?? null,
      body: input.body ?? null,
      gallery: input.gallery,
      status: "DRAFT",
      ...flattenBackground(input.background),
    },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: `Created section "${section.name}"`,
  });

  revalidatePath("/admin/pages");
  return { id: section.id };
}

export async function updateSectionAction(id: string, input: SectionInput) {
  const user = await requireUser();
  const ip = await getClientIp();

  const section = await prisma.section.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      pages: input.pages,
      targetType: input.targetType ?? null,
      targetSlug: input.targetSlug ?? null,
      targetTitle: input.targetTitle ?? null,
      headline: input.headline ?? null,
      body: input.body ?? null,
      gallery: input.gallery,
      ...flattenBackground(input.background),
    },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: `Updated section "${section.name}"`,
  });

  revalidatePath("/admin/pages");
}

export async function deleteSectionAction(id: string) {
  const user = await requireUser();
  const ip = await getClientIp();

  const section = await prisma.section.delete({ where: { id } });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    severity: "WARNING",
    message: `Deleted section "${section.name}"`,
  });

  revalidatePath("/admin/pages");
}
