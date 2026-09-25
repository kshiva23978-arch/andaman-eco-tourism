"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requirePermission, logAudit } from "@/lib/auth";

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

export async function saveSettingsAction(values: Record<string, string>) {
  const user = await requirePermission("manage_settings");
  const ip = await getClientIp();

  await prisma.$transaction(
    Object.entries(values).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "SYSTEM",
    message: "Updated site settings",
  });

  revalidatePath("/admin/settings");
}
