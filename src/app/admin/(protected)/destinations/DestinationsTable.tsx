"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  Badge,
  SecondaryButton,
  IconButton,
  Modal,
  Pagination,
  inputClass,
} from "@/components/admin/AdminUI";
import { deleteDestinationAction, toggleDestinationStatusAction } from "./actions";

export type Row = {
  slug: string;
  title: string;
  region: string;
  image: string;
  status: "PUBLISHED" | "DRAFT";
};

const REGIONS: string[] = [
  "South Andaman",
  "Diglipur",
  "Mayabunder",
  "Middle Andaman",
  "Baratang",
  "Little Andaman",
  "Swaraj Dweep",
];

export function DestinationsTable({
  rows,
  total,
  page,
  pageSize,
  query,
  region,
}: {
  rows: Row[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
  region: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(query);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setSearchInput(query);
  }

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "" || value === "All") params.delete(key);
      else params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== query) updateParams({ q: searchInput || null, page: null });
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function confirmDelete() {
    if (!deleteTarget) return;
    const slug = deleteTarget.slug;
    setDeleteTarget(null);
    startTransition(async () => {
      await deleteDestinationAction(slug);
      router.refresh();
    });
  }

  function toggleStatus(slug: string) {
    startTransition(async () => {
      await toggleDestinationStatusAction(slug);
      router.refresh();
    });
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <Card className="mb-4 flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search destinations…"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={region}
          onChange={(e) => updateParams({ region: e.target.value, page: null })}
          className={`${inputClass} w-auto`}
        >
          <option value="All">All regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Card>

      <Card className={`overflow-hidden ${isPending ? "opacity-60" : ""}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase tracking-wide text-on-surface-variant">
              <tr>
                <th className="px-5 py-3 font-semibold">Destination</th>
                <th className="px-5 py-3 font-semibold">Region</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {rows.map((row) => (
                <tr key={row.slug} className="hover:bg-black/[0.015]">
                  <td className="px-5 py-3">
                    <Link href={`/admin/destinations/${row.slug}`} className="flex items-center gap-3">
                      <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-black/5">
                        <Image src={row.image} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface hover:underline">{row.title}</p>
                        <p className="text-xs text-on-surface-variant">/{row.slug}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">{row.region}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleStatus(row.slug)} disabled={isPending}>
                      <Badge tone={row.status === "PUBLISHED" ? "success" : "warning"}>
                        {row.status === "PUBLISHED" ? "Published" : "Draft"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <IconButton icon="visibility" title="Preview" />
                      <IconButton
                        icon="edit"
                        title="Edit full content"
                        onClick={() => router.push(`/admin/destinations/${row.slug}`)}
                      />
                      <IconButton
                        icon="delete"
                        title="Delete"
                        tone="danger"
                        onClick={() => setDeleteTarget(row)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-on-surface-variant">
                    No destinations match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParams({ page: String(p) })} />
      </Card>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete destination"
        footer={
          <>
            <SecondaryButton onClick={() => setDeleteTarget(null)}>Cancel</SecondaryButton>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-error px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#93000a]"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-on-surface-variant">
          Are you sure you want to delete <strong className="text-on-surface">{deleteTarget?.title}</strong>?
          This permanently removes it from the database.
        </p>
      </Modal>
    </div>
  );
}
