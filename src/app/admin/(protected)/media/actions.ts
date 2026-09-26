"use server";

import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser, requirePermission, logAudit } from "@/lib/auth";
import {
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  MEDIA_TYPES,
  UPLOAD_ROOT,
  UPLOAD_URL_PREFIX,
  isVideoPath,
  resolveUploadPath,
  slugifyFilename,
  sniffMediaType,
} from "@/lib/uploads";

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

export type UploadResult = { ok: true; path: string } | { ok: false; error: string };

/** Uploads one file (the client sends files one at a time to stay under the body limit). */
export async function uploadMediaAction(formData: FormData): Promise<UploadResult> {
  const user = await requirePermission("upload_media");
  const ip = await getClientIp();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file received." };
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return { ok: false, error: `Too large — the limit is ${MAX_VIDEO_BYTES / 1024 / 1024} MB.` };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniffMediaType(bytes);
  if (!ext) {
    return { ok: false, error: "Unsupported file. Use JPG, PNG, WebP, GIF, AVIF, MP4 or WebM." };
  }
  if (MEDIA_TYPES[ext].kind === "image" && file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `Images are limited to ${MAX_IMAGE_BYTES / 1024 / 1024} MB.` };
  }

  // /uploads/YYYY/MM/<name>-<random>.<ext> — the random suffix keeps names unique, so
  // the file can be cached forever and never overwrites another upload.
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const storedName = `${slugifyFilename(file.name)}-${randomBytes(4).toString("hex")}.${ext}`;
  const dir = path.join(UPLOAD_ROOT, year, month);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, storedName), bytes, { flag: "wx" });

  const publicPath = `${UPLOAD_URL_PREFIX}${year}/${month}/${storedName}`;
  const displayName = file.name.slice(0, 200);
  await prisma.mediaAsset.create({
    data: { path: publicPath, filename: displayName, sizeBytes: file.size },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.email,
    ip,
    category: "CONTENT",
    message: `Uploaded media "${displayName}"`,
  });

  revalidatePath("/admin/media");
  return { ok: true, path: publicPath };
}

export type MediaOption = { id: string; path: string; name: string; kind: "image" | "video" };

/** Media library options for the in-editor picker; any signed-in admin can browse. */
export async function listMediaAction(): Promise<MediaOption[]> {
  await requireUser();
  const assets = await prisma.mediaAsset.findMany({ orderBy: { uploadedAt: "desc" } });
  return assets.map((a) => ({
    id: a.id,
    path: a.path,
    name: a.filename,
    kind: isVideoPath(a.path) ? "video" : "image",
  }));
}

export async function deleteMediaAction(id: string) {
  const user = await requireUser();
  const ip = await getClientIp();

  const asset = await prisma.mediaAsset.delete({ where: { id } });

  // Files we uploaded are removed from disk too; the site's bundled images are left alone.
  if (asset.path.startsWith(UPLOAD_URL_PREFIX)) {
    const filePath = resolveUploadPath(asset.path.slice(UPLOAD_URL_PREFIX.length).split("/"));
    if (filePath) await unlink(filePath).catch(() => {});
  }

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
