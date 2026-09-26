"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, SecondaryButton, PrimaryButton, Modal } from "@/components/admin/AdminUI";
import { ACCEPT_ATTR, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from "@/lib/upload-limits";
import { isVideoPath } from "@/lib/uploads";
import { deleteMediaAction, uploadMediaAction } from "./actions";

export type MediaRow = {
  id: string;
  src: string;
  name: string;
  usedIn: string;
  size: string;
};

export function MediaGrid({ items }: { items: MediaRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<MediaRow | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function copyPath() {
    if (!preview) return;
    try {
      await navigator.clipboard.writeText(preview.src);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = preview.src;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const filtered = useMemo(
    () =>
      items.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.usedIn.toLowerCase().includes(query.toLowerCase())
      ),
    [items, query]
  );

  function remove() {
    if (!preview) return;
    const id = preview.id;
    setPreview(null);
    startTransition(async () => {
      await deleteMediaAction(id);
      router.refresh();
    });
  }

  return (
    <div>
      <Card className="mb-4 flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media by file name or usage…"
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 pl-9 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <PrimaryButton icon="upload" onClick={() => setUploadOpen(true)}>
          Upload media
        </PrimaryButton>
      </Card>

      <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ${isPending ? "opacity-60" : ""}`}>
        {filtered.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <button
              type="button"
              onClick={() => setPreview(item)}
              className="relative block aspect-[4/3] w-full overflow-hidden bg-black/5"
            >
              {isVideoPath(item.src) ? (
                <div className="flex h-full w-full items-center justify-center bg-black/80 text-white">
                  <span className="material-symbols-outlined text-[32px]">movie</span>
                </div>
              ) : (
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
            </button>
            <div className="p-2.5">
              <p className="truncate text-xs font-semibold text-on-surface" title={item.name}>
                {item.name}
              </p>
              <p className="truncate text-[11px] text-on-surface-variant" title={item.usedIn}>
                {item.usedIn || "Unused"}
              </p>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-on-surface-variant">
            No media matches your search.
          </p>
        )}
      </div>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.name ?? ""}
        wide
        footer={
          <>
            <SecondaryButton icon={copied ? "check" : "content_copy"} onClick={copyPath}>
              {copied ? "Copied!" : "Copy path"}
            </SecondaryButton>
            <PrimaryButton icon="delete" onClick={remove}>
              Remove from library
            </PrimaryButton>
          </>
        }
      >
        {preview && (
          <div>
            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-black/5">
              {isVideoPath(preview.src) ? (
                <video src={preview.src} controls className="h-full w-full object-contain" />
              ) : (
                <Image src={preview.src} alt={preview.name} fill className="object-contain" />
              )}
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-on-surface-variant">File path</dt>
                <dd className="font-medium text-on-surface break-all">{preview.src}</dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Used in</dt>
                <dd className="font-medium text-on-surface">{preview.usedIn || "Unused"}</dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">File size</dt>
                <dd className="font-medium text-on-surface">{preview.size}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      {uploadOpen && (
        <UploadDialog
          onClose={() => setUploadOpen(false)}
          onUploaded={() => router.refresh()}
        />
      )}
    </div>
  );
}

type QueuedFile = {
  id: number;
  file: File;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
};

const MB = 1024 * 1024;

function formatBytes(bytes: number) {
  return bytes < MB ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / MB).toFixed(1)} MB`;
}

/** Client-side pre-check for instant feedback; the server re-validates the actual bytes. */
function precheck(file: File): string | undefined {
  const isVideo = file.type.startsWith("video/") || /\.(mp4|webm)$/i.test(file.name);
  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) return `Too large — ${isVideo ? "videos" : "images"} are limited to ${limit / MB} MB.`;
  if (!/\.(jpe?g|png|webp|gif|avif|mp4|webm)$/i.test(file.name)) {
    return "Unsupported type. Use JPG, PNG, WebP, GIF, AVIF, MP4 or WebM.";
  }
  return undefined;
}

function UploadDialog({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pending = queue.filter((q) => q.status === "queued");
  const doneCount = queue.filter((q) => q.status === "done").length;
  const finished = queue.length > 0 && pending.length === 0 && !uploading;

  function addFiles(files: FileList | null) {
    if (!files) return;
    const added: QueuedFile[] = Array.from(files).map((file) => {
      const error = precheck(file);
      return { id: nextId.current++, file, status: error ? "error" : "queued", error };
    });
    setQueue((q) => [...q, ...added]);
  }

  function update(id: number, patch: Partial<QueuedFile>) {
    setQueue((q) => q.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function startUpload() {
    setUploading(true);
    let uploadedAny = false;
    // One request per file keeps each under the server's body-size limit.
    for (const item of pending) {
      update(item.id, { status: "uploading" });
      try {
        const data = new FormData();
        data.append("file", item.file);
        const result = await uploadMediaAction(data);
        if (result.ok) {
          uploadedAny = true;
          update(item.id, { status: "done" });
        } else {
          update(item.id, { status: "error", error: result.error });
        }
      } catch {
        update(item.id, { status: "error", error: "Upload failed — check your connection and permissions." });
      }
    }
    setUploading(false);
    if (uploadedAny) onUploaded();
  }

  return (
    <Modal
      open
      onClose={uploading ? () => {} : onClose}
      title="Upload media"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={uploading}>
            {finished ? "Close" : "Cancel"}
          </SecondaryButton>
          <PrimaryButton
            icon="upload"
            onClick={startUpload}
            disabled={uploading || pending.length === 0}
          >
            {uploading
              ? "Uploading…"
              : pending.length > 0
                ? `Upload ${pending.length} file${pending.length === 1 ? "" : "s"}`
                : "Upload"}
          </PrimaryButton>
        </>
      }
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!uploading) addFiles(e.dataTransfer.files);
        }}
        disabled={uploading}
        className={`flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center text-sm transition-colors ${
          dragging
            ? "border-secondary bg-secondary-container/40 text-on-surface"
            : "border-black/20 text-on-surface-variant hover:bg-black/[0.02]"
        }`}
      >
        <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
        Drag and drop files here, or click to browse.
        <span className="text-xs">
          JPG, PNG, WebP, GIF, AVIF up to {MAX_IMAGE_BYTES / MB} MB · MP4, WebM up to{" "}
          {MAX_VIDEO_BYTES / MB} MB
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = ""; // allow re-picking the same file
        }}
      />

      {queue.length > 0 && (
        <ul className="mt-4 flex max-h-64 flex-col gap-2 overflow-y-auto">
          {queue.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-lg border border-black/10 px-3 py-2">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  item.status === "done"
                    ? "text-secondary"
                    : item.status === "error"
                      ? "text-error"
                      : item.status === "uploading"
                        ? "animate-spin text-on-surface-variant"
                        : "text-on-surface-variant"
                }`}
              >
                {item.status === "done"
                  ? "check_circle"
                  : item.status === "error"
                    ? "error"
                    : item.status === "uploading"
                      ? "progress_activity"
                      : "draft"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-on-surface">{item.file.name}</p>
                <p className={`text-xs ${item.status === "error" ? "text-error" : "text-on-surface-variant"}`}>
                  {item.error ?? formatBytes(item.file.size)}
                </p>
              </div>
              {item.status !== "uploading" && item.status !== "done" && !uploading && (
                <button
                  type="button"
                  onClick={() => setQueue((q) => q.filter((x) => x.id !== item.id))}
                  className="rounded p-1 text-on-surface-variant hover:bg-black/5"
                  aria-label={`Remove ${item.file.name}`}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {finished && doneCount > 0 && (
        <p className="mt-3 text-sm font-medium text-secondary">
          {doneCount} file{doneCount === 1 ? "" : "s"} added to the library.
        </p>
      )}
    </Modal>
  );
}
