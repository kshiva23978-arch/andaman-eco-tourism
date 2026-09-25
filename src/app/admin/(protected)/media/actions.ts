"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser, logAudit } from "@/lib/auth";

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

export async function deleteMediaAction(id: string) {
  const user = await requireUser();
  const ip = await getClientIp();

  const asset = await prisma.mediaAsset.delete({ where: { id } });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    severity: "WARNING",
    message: `Removed media asset "${asset.filename}" from the library`,
  });

  revalidatePath("/admin/media");
}
