"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Card,
  FormField,
  MediaInput,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  Tabs,
  inputClass,
} from "@/components/admin/AdminUI";
import { savePageContentAction } from "@/app/admin/(protected)/pages/content-actions";
import type { PageContentOf, PageKey } from "@/lib/content/page-content-db";

/** Replaces one top-level section: objects are merged, arrays/values replaced. */
export type PatchFn<T> = <K extends keyof T>(key: K, value: T[K] extends unknown[] ? T[K] : Partial<T[K]>) => void;

/**
 * Shared frame for the page-content editors: header with save, unsaved-changes and
 * saved notices, tabs, and a per-tab "restore original content" action.
 */
export function ContentEditorShell<K extends PageKey, Tab extends string>({
  pageKey,
  title,
  intro,
  viewHref,
  tabs,
  tabSection,
  defaults,
  initialContent,
  lastSaved,
  children,
}: {
  pageKey: K;
  title: string;
  intro: string;
  viewHref: string;
  tabs: readonly Tab[];
  /** Which top-level section each tab edits (for "restore original content"). */
  tabSection: Record<Tab, keyof PageContentOf<K>>;
  defaults: PageContentOf<K>;
  initialContent: PageContentOf<K>;
  lastSaved: string | null;
  children: (tab: Tab, content: PageContentOf<K>, patch: PatchFn<PageContentOf<K>>) => React.ReactNode;
}) {
  type T = PageContentOf<K>;
  const [content, setContent] = useState<T>(initialContent);
  const [tab, setTab] = useState<Tab>(tabs[0]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  const patch: PatchFn<T> = (key, value) => {
    setContent((c) => {
      const current = c[key];
      const next =
        Array.isArray(current) || typeof current !== "object" || current === null
          ? value
          : { ...current, ...(value as object) };
      return { ...c, [key]: next };
    });
    setDirty(true);
  };

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        const saved = await savePageContentAction(pageKey, content);
        setContent(saved);
        setDirty(false);
        setSavedAt(new Date().toLocaleTimeString());
      } catch (err) {
        setError(
          err instanceof Error && err.message === "FORBIDDEN"
            ? "Your role doesn't have permission to edit content."
            : "Something went wrong while saving.",
        );
      }
    });
  }

  function restoreTab() {
    const key = tabSection[tab];
    setContent((c) => ({ ...c, [key]: defaults[key] }));
    setDirty(true);
  }

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
        title={title}
        description={
          lastSaved
            ? `${intro} Last saved ${new Date(lastSaved).toLocaleString()}.`
            : `${intro} Showing the original content — nothing saved yet.`
        }
        actions={
          <>
            <Link
              href={viewHref}
              target="_blank"
              className="flex items-center gap-2 rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-black/5"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              View on site
            </Link>
            <PrimaryButton icon="save" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </PrimaryButton>
          </>
        }
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-error-container px-4 py-2.5 text-sm font-medium text-on-error-container">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}
      {savedAt && !error && !dirty && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2.5 text-sm font-medium text-on-secondary-container">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Saved at {savedAt} — the live site is updated.
        </div>
      )}
      {dirty && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#fdecd2] px-4 py-2.5 text-sm font-medium text-[#8a5a00]">
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          You have unsaved changes.
        </div>
      )}

      <Card className="p-5">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        {children(tab, content, patch)}
        <div className="mt-6 flex justify-end border-t border-black/10 pt-4">
          <button
            type="button"
            onClick={restoreTab}
            className="flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-error"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Restore this tab to the original content
          </button>
        </div>
      </Card>
    </div>
  );
}

/* --------------------------------------------------- small field helpers */

export const ACCENT_HINT = "Wrap words in *stars* to color them, e.g. Explore Featured *Destinations*.";
export const COUNT_HINT = "{count} is replaced with the live number.";
export const TITLE_HINT = "{title} is replaced with each destination's name.";

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  );
}

export function TextArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      className={`${inputClass} min-h-[90px] resize-y`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** Up / down / remove controls for one item in a list. */
export function ItemControls({
  index,
  count,
  onMove,
  onRemove,
  label,
}: {
  index: number;
  count: number;
  onMove: (dir: -1 | 1) => void;
  onRemove?: () => void;
  label: string;
}) {
  const btn =
    "flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-black/10 disabled:opacity-30";
  return (
    <div className="flex gap-1">
      <button type="button" className={btn} onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Move ${label} up`}>
        <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
      </button>
      <button type="button" className={btn} onClick={() => onMove(1)} disabled={index === count - 1} aria-label={`Move ${label} down`}>
        <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
      </button>
      {onRemove && (
        <button type="button" className={`${btn} hover:text-error`} onClick={onRemove} aria-label={`Remove ${label}`}>
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      )}
    </div>
  );
}

/** A form field description for `SimpleFields`. */
export type SimpleField = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "media" | "mediaList" | "link";
  hint?: string;
};

/** Renders a list of plain text / media fields for one content section. */
export function SimpleFields({
  fields,
  values,
  onChange,
}: {
  fields: SimpleField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: string | string[]) => void;
}) {
  return (
    <>
      {fields.map((field) => {
        const value = values[field.key];
        return (
          <FormField key={field.key} label={field.label} hint={field.hint}>
            {field.kind === "media" ? (
              <MediaInput value={value as string} onChange={(v) => onChange(field.key, v)} />
            ) : field.kind === "mediaList" ? (
              <MediaList items={value as string[]} onChange={(v) => onChange(field.key, v)} />
            ) : field.kind === "textarea" ? (
              <TextArea value={value as string} onChange={(v) => onChange(field.key, v)} />
            ) : (
              <TextInput
                value={value as string}
                onChange={(v) => onChange(field.key, v)}
                placeholder={field.kind === "link" ? "/page-path or https://…" : undefined}
              />
            )}
          </FormField>
        );
      })}
    </>
  );
}

/** Ordered list of media paths with add / reorder / remove. Keeps at least one item. */
export function MediaList({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((src, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex-1">
            <MediaInput value={src} onChange={(v) => onChange(items.map((s, idx) => (idx === i ? v : s)))} />
          </div>
          <ItemControls
            index={i}
            count={items.length}
            label={`image ${i + 1}`}
            onMove={(dir) => onChange(moveItem(items, i, dir))}
            onRemove={items.length > 1 ? () => onChange(items.filter((_, idx) => idx !== i)) : undefined}
          />
        </div>
      ))}
      <div>
        <SecondaryButton icon="add" onClick={() => onChange([...items, ""])}>
          Add image
        </SecondaryButton>
      </div>
    </div>
  );
}

export function moveItem<T>(items: T[], i: number, dir: -1 | 1): T[] {
  const target = i + dir;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[i], next[target]] = [next[target], next[i]];
  return next;
}
