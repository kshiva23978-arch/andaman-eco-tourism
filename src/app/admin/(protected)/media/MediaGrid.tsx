"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, SecondaryButton, PrimaryButton, Modal } from "@/components/admin/AdminUI";
import { deleteMediaAction } from "./actions";

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
              {item.src.endsWith(".mp4") || item.src.endsWith(".webm") ? (
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
              {preview.src.endsWith(".mp4") || preview.src.endsWith(".webm") ? (
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

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload media"
        footer={
          <>
            <SecondaryButton onClick={() => setUploadOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={() => setUploadOpen(false)}>Upload</PrimaryButton>
          </>
        }
      >
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-black/20 px-4 py-10 text-center text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
          Drag and drop files here, or click to browse.
          <span className="text-xs">File storage isn&apos;t wired up yet — this records nothing.</span>
        </div>
      </Modal>
    </div>
  );
}
