import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { MEDIA_TYPES, resolveUploadPath } from "@/lib/uploads";

/** Serves admin-uploaded media from storage/uploads (see src/lib/uploads.ts). */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filePath = resolveUploadPath(segments);
  const type = filePath ? MEDIA_TYPES[path.extname(filePath).slice(1).toLowerCase()] : undefined;
  if (!filePath || !type) return new Response("Not found", { status: 404 });

  let size: number;
  try {
    const info = await stat(filePath);
    if (!info.isFile()) return new Response("Not found", { status: 404 });
    size = info.size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const headers: Record<string, string> = {
    "Content-Type": type.mime,
    "Accept-Ranges": "bytes",
    // Upload names are unique, so a URL's content never changes.
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Disposition": "inline",
  };

  // Byte ranges let browsers seek within videos without downloading the whole file.
  const range = request.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (range && (range[1] || range[2])) {
    let start: number;
    let end: number;
    if (range[1]) {
      start = Number(range[1]);
      end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    } else {
      start = Math.max(0, size - Number(range[2])); // suffix range: last N bytes
      end = size - 1;
    }
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream;
    return new Response(stream, {
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;
  return new Response(stream, { headers: { ...headers, "Content-Length": String(size) } });
}
