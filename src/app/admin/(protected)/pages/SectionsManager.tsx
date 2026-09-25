"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  PageHeader,
  Badge,
  PrimaryButton,
  SecondaryButton,
  Modal,
  GalleryEditor,
  BackgroundEditor,
  DEFAULT_BACKGROUND,
  backgroundStyle,
  overlayStyle,
  inputClass,
  FormField,
  type BackgroundConfig,
} from "@/components/admin/AdminUI";
import { createSectionAction, updateSectionAction, deleteSectionAction } from "./actions";

export type SectionRow = {
  id: string;
  pages: string[];
  target?: { type: "destination" | "activity"; slug: string; title: string };
  name: string;
  description: string;
  headline: string;
  body: string;
  updatedAtLabel: string;
  background: BackgroundConfig;
  gallery: string[];
};

const SITE_PAGES = ["Home", "Destinations", "Activities"];
const EVERY_PAGE = "Every Page";
const FILTER_TABS = ["All", ...SITE_PAGES, EVERY_PAGE];

export function SectionsManager({
  initialSections,
  destinationOptions,
  activityOptions,
}: {
  initialSections: SectionRow[];
  destinationOptions: { slug: string; title: string }[];
  activityOptions: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sections, setSections] = useState<SectionRow[]>(initialSections);
  const [pageFilter, setPageFilter] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SectionRow | null>(null);
  const [draft, setDraft] = useState({ headline: "", body: "" });
  const [newSection, setNewSection] = useState<{
    name: string;
    description: string;
    scope: "specific" | "every" | "destination-item" | "activity-item";
    pages: string[];
    itemSlug: string;
  }>({ name: "", description: "", scope: "specific", pages: ["Home"], itemSlug: "" });

  const [prevInitialSections, setPrevInitialSections] = useState(initialSections);
  if (prevInitialSections !== initialSections) {
    setPrevInitialSections(initialSections);
    setSections(initialSections);
  }

  const editingSection = sections.find((s) => s.id === editingId) ?? null;

  const filtered = sections.filter((s) => {
    if (pageFilter === "All") return true;
    if (pageFilter === EVERY_PAGE) return s.pages.includes(EVERY_PAGE);
    return s.pages.includes(pageFilter) || s.pages.includes(EVERY_PAGE);
  });

  function openEditor(section: SectionRow) {
    setEditingId(section.id);
    setDraft({ headline: section.headline, body: section.body });
  }

  function updateLocal(id: string, patch: Partial<SectionRow>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function openCreate() {
    setNewSection({ name: "", description: "", scope: "specific", pages: ["Home"], itemSlug: "" });
    setCreateOpen(true);
  }

  function createSection() {
    const name = newSection.name.trim() || "Untitled section";

    let pages: string[];
    let target: { type: "destination" | "activity"; slug: string; title: string } | undefined;

    if (newSection.scope === "every") {
      pages = [EVERY_PAGE];
    } else if (newSection.scope === "destination-item") {
      const dest = destinationOptions.find((d) => d.slug === newSection.itemSlug);
      pages = ["Destinations"];
      if (dest) target = { type: "destination", slug: dest.slug, title: dest.title };
    } else if (newSection.scope === "activity-item") {
      const act = activityOptions.find((a) => a.slug === newSection.itemSlug);
      pages = ["Activities"];
      if (act) target = { type: "activity", slug: act.slug, title: act.title };
    } else {
      pages = newSection.pages.length ? newSection.pages : ["Home"];
    }

    setCreateOpen(false);
    startTransition(async () => {
      await createSectionAction({
        name,
        description: newSection.description || "No description yet.",
        pages,
        targetType: target?.type ?? null,
        targetSlug: target?.slug ?? null,
        targetTitle: target?.title ?? null,
        background: DEFAULT_BACKGROUND,
        gallery: [],
      });
      router.refresh();
    });
  }

  function saveEditing() {
    if (!editingSection) return;
    const id = editingSection.id;
    startTransition(async () => {
      await updateSectionAction(id, {
        name: editingSection.name,
        description: editingSection.description,
        pages: editingSection.pages,
        targetType: editingSection.target?.type ?? null,
        targetSlug: editingSection.target?.slug ?? null,
        targetTitle: editingSection.target?.title ?? null,
        headline: draft.headline,
        body: draft.body,
        background: editingSection.background,
        gallery: editingSection.gallery,
      });
      setEditingId(null);
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    if (editingId === id) setEditingId(null);
    startTransition(async () => {
      await deleteSectionAction(id);
      router.refresh();
    });
  }

  function togglePageInDraft(page: string) {
    setNewSection((f) => ({
      ...f,
      pages: f.pages.includes(page) ? f.pages.filter((p) => p !== page) : [...f.pages, page],
    }));
  }

  if (editingSection) {
    return (
      <div>
        <button
          onClick={() => setEditingId(null)}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-secondary hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Pages &amp; Sections
        </button>

        <PageHeader
          title={editingSection.name}
          description={`Applies to: ${
            editingSection.target
              ? `${editingSection.target.title} only (${editingSection.target.type} page)`
              : editingSection.pages.join(", ")
          } · ${editingSection.description}`}
          actions={
            <>
              <SecondaryButton icon="visibility">Preview</SecondaryButton>
              <PrimaryButton icon="save" onClick={saveEditing}>
                {isPending ? "Saving…" : "Save changes"}
              </PrimaryButton>
            </>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="p-5">
            <FormField label="Headline">
              <input
                className={inputClass}
                value={draft.headline}
                onChange={(e) => setDraft((d) => ({ ...d, headline: e.target.value }))}
                placeholder="e.g. Where the forest meets the sea"
              />
            </FormField>
            <FormField label="Body copy">
              <textarea
                className={`${inputClass} min-h-[140px] resize-y`}
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                placeholder="Write the section copy…"
              />
            </FormField>
            <FormField label="Background" hint="Use a photo, or a flat color, plus an optional tint overlay for text legibility.">
              <BackgroundEditor
                value={editingSection.background}
                onChange={(v) => updateLocal(editingSection.id, { background: v })}
              />
            </FormField>
            <FormField
              label="Additional gallery images"
              hint="Used for sections with more than one image, e.g. a carousel."
            >
              <GalleryEditor
                images={editingSection.gallery}
                onChange={(v) => updateLocal(editingSection.id, { gallery: v })}
              />
            </FormField>
            <FormField label="Applies to" hint="Which pages this section is shown on.">
              <div className="flex flex-wrap gap-1.5">
                {editingSection.target ? (
                  <Badge tone="warning">
                    Only on {editingSection.target.title} ({editingSection.target.type} page)
                  </Badge>
                ) : (
                  editingSection.pages.map((p) => (
                    <Badge key={p} tone="info">
                      {p}
                    </Badge>
                  ))
                )}
              </div>
            </FormField>
          </Card>

          <Card className="overflow-hidden">
            <h3 className="border-b border-black/10 p-4 pb-3 text-sm font-semibold text-on-surface">
              Live preview
            </h3>
            <div
              className="relative flex min-h-[180px] items-end p-6 text-white"
              style={backgroundStyle(editingSection.background)}
            >
              <div className="absolute inset-0" style={overlayStyle(editingSection.background)} />
              <div className="relative">
                <p className="font-headline-md text-lg font-semibold">
                  {draft.headline || editingSection.name}
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {draft.body || "Section content will appear here as you type."}
                </p>
              </div>
            </div>
            <p className="p-4 text-xs text-on-surface-variant">
              Last edited {editingSection.updatedAtLabel}.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Pages & Sections"
        description="Create and edit copy, backgrounds and layout blocks — scoped to a listing page, to one single destination or activity's own page, or to every page site-wide."
        actions={
          <PrimaryButton icon="add" onClick={openCreate}>
            Add section
          </PrimaryButton>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTER_TABS.map((p) => (
          <button
            key={p}
            onClick={() => setPageFilter(p)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              pageFilter === p
                ? "bg-primary text-white"
                : "bg-white text-on-surface-variant border border-black/10 hover:bg-black/5"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${isPending ? "opacity-60" : ""}`}>
        {filtered.map((section) => (
          <Card key={section.id} className="flex flex-col overflow-hidden">
            <div className="relative h-28 w-full bg-black/5" style={backgroundStyle(section.background)}>
              {section.background.type === "image" && (
                <div className="absolute inset-0" style={overlayStyle(section.background)} />
              )}
              <button
                onClick={() => setDeleteTarget(section)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-error hover:bg-white"
                aria-label={`Delete ${section.name}`}
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                {section.pages.map((p) => (
                  <Badge key={p} tone={p === EVERY_PAGE ? "success" : "info"}>
                    {p}
                  </Badge>
                ))}
                {section.target && <Badge tone="warning">Only: {section.target.title}</Badge>}
                <span className="ml-auto text-xs text-on-surface-variant">{section.updatedAtLabel}</span>
              </div>
              <h3 className="font-semibold text-on-surface">{section.name}</h3>
              <p className="mt-1 flex-1 text-sm text-on-surface-variant">{section.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={() => openEditor(section)}
                  className="flex items-center gap-1 self-start text-sm font-semibold text-secondary hover:underline"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit section
                </button>
                {section.name === "Island map pins" && (
                  <Link
                    href="/admin/pages/map"
                    className="flex items-center gap-1 self-start text-sm font-semibold text-secondary hover:underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                    Manage pins &amp; labels
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-on-surface-variant">
            No sections in this scope yet — add one.
          </p>
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add section"
        wide
        footer={
          <>
            <SecondaryButton onClick={() => setCreateOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={createSection}>Create section</PrimaryButton>
          </>
        }
      >
        <FormField label="Section name">
          <input
            className={inputClass}
            value={newSection.name}
            onChange={(e) => setNewSection((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Volunteer callout banner"
          />
        </FormField>
        <FormField label="Description">
          <input
            className={inputClass}
            value={newSection.description}
            onChange={(e) => setNewSection((f) => ({ ...f, description: e.target.value }))}
            placeholder="What this section is for, and where it appears"
          />
        </FormField>
        <FormField
          label="Scope"
          hint="Show this section on one or more listing pages, on a single destination/activity's own page, or on every page site-wide."
        >
          <div className="mb-3 flex flex-wrap gap-2">
            {(
              [
                { key: "specific", label: "Listing page(s)" },
                { key: "destination-item", label: "One destination's page" },
                { key: "activity-item", label: "One activity's page" },
                { key: "every", label: "Every page (global)" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() =>
                  setNewSection((f) => ({
                    ...f,
                    scope: opt.key,
                    itemSlug:
                      opt.key === "destination-item"
                        ? destinationOptions[0]?.slug ?? ""
                        : opt.key === "activity-item"
                          ? activityOptions[0]?.slug ?? ""
                          : f.itemSlug,
                  }))
                }
                className={`flex-1 min-w-[160px] rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                  newSection.scope === opt.key
                    ? "border-secondary bg-secondary-container text-on-secondary-container"
                    : "border-black/15 text-on-surface-variant hover:bg-black/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {newSection.scope === "specific" && (
            <div className="flex flex-wrap gap-2">
              {SITE_PAGES.map((p) => (
                <label
                  key={p}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${
                    newSection.pages.includes(p)
                      ? "border-secondary bg-secondary-container/40 text-on-surface"
                      : "border-black/15 text-on-surface-variant"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={newSection.pages.includes(p)}
                    onChange={() => togglePageInDraft(p)}
                  />
                  {p}
                </label>
              ))}
            </div>
          )}

          {newSection.scope === "every" && (
            <p className="text-sm text-on-surface-variant">
              This section will render on every page of the site, like the footer or the eco
              guidelines banner.
            </p>
          )}

          {newSection.scope === "destination-item" && (
            <div>
              <select
                className={inputClass}
                value={newSection.itemSlug}
                onChange={(e) => setNewSection((f) => ({ ...f, itemSlug: e.target.value }))}
              >
                {destinationOptions.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.title}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-on-surface-variant">
                This section will appear only on this one destination&apos;s page — nowhere else.
              </p>
            </div>
          )}

          {newSection.scope === "activity-item" && (
            <div>
              <select
                className={inputClass}
                value={newSection.itemSlug}
                onChange={(e) => setNewSection((f) => ({ ...f, itemSlug: e.target.value }))}
              >
                {activityOptions.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.title}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-on-surface-variant">
                This section will appear only on this one activity&apos;s page — nowhere else.
              </p>
            </div>
          )}
        </FormField>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete section"
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
          Are you sure you want to delete <strong className="text-on-surface">{deleteTarget?.name}</strong>?
          This permanently removes it from the database.
        </p>
      </Modal>
    </div>
  );
}
