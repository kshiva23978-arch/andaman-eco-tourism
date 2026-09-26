import path from "node:path";

/**
 * Uploaded media lives outside `public/`: in production Next.js only serves files that
 * were in `public/` at build time, so runtime uploads are served by
 * `app/uploads/[...path]/route.ts` instead. Public URLs look like `/uploads/2026/09/x.jpg`.
 */
export const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads");
export const UPLOAD_URL_PREFIX = "/uploads/";

export { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from "./upload-limits";

type Kind = "image" | "video";

export const MEDIA_TYPES: Record<string, { mime: string; kind: Kind }> = {
  jpg: { mime: "image/jpeg", kind: "image" },
  png: { mime: "image/png", kind: "image" },
  webp: { mime: "image/webp", kind: "image" },
  gif: { mime: "image/gif", kind: "image" },
  avif: { mime: "image/avif", kind: "image" },
  mp4: { mime: "video/mp4", kind: "video" },
  webm: { mime: "video/webm", kind: "video" },
};

/**
 * Identifies the file from its leading bytes rather than trusting the name or the
 * browser-supplied MIME type. Returns the canonical extension, or null if unsupported.
 */
export function sniffMediaType(bytes: Uint8Array): keyof typeof MEDIA_TYPES | null {
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...bytes.subarray(start, end));

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "png";
  if (ascii(0, 4) === "GIF8") return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return "webm";
  if (ascii(4, 8) === "ftyp") {
    const brand = ascii(8, 12);
    if (brand === "avif" || brand === "avis") return "avif";
    return "mp4"; // isom, mp41, mp42, M4V, etc.
  }
  return null;
}

/** "My Photo (1).JPG" -> "my-photo-1" — safe for URLs and every filesystem. */
export function slugifyFilename(name: string): string {
  const base = name.replace(/\.[^.]*$/, "");
  const slug = base
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "file";
}

/**
 * Maps a `/uploads/...` URL (or its path segments) to an absolute file path inside
 * UPLOAD_ROOT, or null if it would escape the upload directory.
 */
export function resolveUploadPath(segments: string[]): string | null {
  if (segments.some((s) => !s || s === "." || s === ".." || /[\\/\0]/.test(s))) return null;
  const full = path.resolve(UPLOAD_ROOT, ...segments);
  return full.startsWith(UPLOAD_ROOT + path.sep) ? full : null;
}
