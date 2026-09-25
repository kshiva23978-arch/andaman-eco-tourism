"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/admin/AdminUI";
import type { PinRow } from "@/components/admin/AdminMapPinEditor";

// Leaflet touches `window` on import, so it can only render on the client.
const AdminMapPinEditor = dynamic(() => import("@/components/admin/AdminMapPinEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center rounded-xl border border-black/10 bg-white text-on-surface-variant">
      Loading map…
    </div>
  ),
});

export function MapPageClient({
  initialPins,
  destinationOptions,
}: {
  initialPins: PinRow[];
  destinationOptions: { slug: string; title: string }[];
}) {
  return (
    <div>
      <Link
        href="/admin/pages"
        className="mb-4 flex items-center gap-1 text-sm font-semibold text-secondary hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Pages &amp; Sections
      </Link>

      <PageHeader
        title="Homepage map — pins & labels"
        description="Add, move, relabel or remove the pins shown on the interactive island map on the homepage."
      />

      <AdminMapPinEditor initialPins={initialPins} destinationOptions={destinationOptions} />
    </div>
  );
}
