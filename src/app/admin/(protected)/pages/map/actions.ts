"use server";

import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser, logAudit } from "@/lib/auth";
import type { LabelSide } from "@prisma/client";
import { MAP_PINS_TAG } from "@/lib/data/map-pins-db";

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

export type MapPinInput = {
  label: string;
  lat: number;
  lng: number;
  featured: boolean;
  dir: LabelSide;
  approx: boolean;
  destinationSlug: string | null;
};

export async function savePinsAction(pins: MapPinInput[]) {
  const user = await requireUser();
  const ip = await getClientIp();

  await prisma.$transaction([
    prisma.mapPin.deleteMany({}),
    ...pins.map((p, i) =>
      prisma.mapPin.create({
        data: {
          label: p.label,
          lat: p.lat,
          lng: p.lng,
          featured: p.featured,
          dir: p.dir,
          approx: p.approx,
          destinationSlug: p.destinationSlug || null,
          order: i,
        },
      })
    ),
  ]);

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: `Updated homepage map pins (${pins.length} total)`,
  });

  updateTag(MAP_PINS_TAG);
  revalidatePath("/admin/pages/map");
}
