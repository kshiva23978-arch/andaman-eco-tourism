"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  PageHeader,
  Badge,
  PrimaryButton,
  SecondaryButton,
  Tabs,
  TagListEditor,
  CardListEditor,
  GalleryEditor,
  FormField,
  inputClass,
} from "@/components/admin/AdminUI";
import { saveActivityAction, type ActivityInput } from "../actions";

const TABS = ["Overview", "Guidelines", "Equipment & Permits", "Related Content", "Gallery & Media"] as const;
type Tab = (typeof TABS)[number];

const BLANK: ActivityInput = {
  slug: "",
  title: "",
  tagline: "",
  icon: "hiking",
  heroImage: "/images/alternate/alternate-image-destinations.jpg",
  overview: [],
  duration: "",
  difficulty: "",
  guidelines: [],
  equipmentProvided: [],
  permitNote: "",
  destinationSlugs: [],
  relatedActivitySlugs: [],
  guideBody: "",
  guideBullets: [],
  galleryImages: [],
};

export function ActivityEditorClient({
  initialData,
  originalSlug,
  status,
}: {
  initialData: ActivityInput | null;
  originalSlug: string | null;
  status: "PUBLISHED" | "DRAFT" | null;
}) {
  const router = useRouter();
  const isNew = !originalSlug;
  const [form, setForm] = useState<ActivityInput>(initialData ?? BLANK);
  const [tab, setTab] = useState<Tab>("Overview");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ActivityInput>(key: K, value: ActivityInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await saveActivityAction(originalSlug, form);
        setSavedAt(new Date().toLocaleTimeString());
        if (isNew) {
          router.push(`/admin/activities/${result.slug}`);
        } else {
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong while saving.");
      }
    });
  }

  return (
    <div>
      <Link
        href="/admin/activities"
        className="mb-4 flex items-center gap-1 text-sm font-semibold text-secondary hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Activities
      </Link>

      <PageHeader
        title={isNew ? "Add activity" : form.title || "Untitled activity"}
        description={isNew ? "Fill in every tab below, then publish when ready." : `/${form.slug}`}
        actions={
          <>
            <SecondaryButton icon="visibility">Preview on site</SecondaryButton>
            <PrimaryButton icon="save" onClick={save}>
              {pending ? "Saving…" : isNew ? "Create activity" : "Save changes"}
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

      {savedAt && !error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2.5 text-sm font-medium text-on-secondary-container">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Saved to the database at {savedAt}.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="p-5">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />

          {tab === "Overview" && (
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Title">
                  <input
                    className={inputClass}
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  />
                </FormField>
                <FormField label="URL slug">
                  <input
                    className={inputClass}
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                    placeholder="e.g. scuba-snorkeling"
                  />
                </FormField>
                <FormField label="Icon" hint="Material Symbols icon name.">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined flex h-9 w-9 items-center justify-center rounded-md bg-secondary-container text-secondary">
                      {form.icon || "hiking"}
                    </span>
                    <input
                      className={inputClass}
                      value={form.icon}
                      onChange={(e) => set("icon", e.target.value)}
                    />
                  </div>
                </FormField>
                <FormField label="Difficulty">
                  <input
                    className={inputClass}
                    value={form.difficulty}
                    onChange={(e) => set("difficulty", e.target.value)}
                    placeholder="e.g. Moderate"
                  />
                </FormField>
                <FormField label="Duration">
                  <input
                    className={inputClass}
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="e.g. 3-4 Hours"
                  />
                </FormField>
              </div>
              <FormField label="Tagline" hint="Shown under the title on the activity's hero banner.">
                <textarea
                  className={`${inputClass} min-h-[80px] resize-y`}
                  value={form.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                />
              </FormField>
              <FormField label="Overview paragraphs">
                <TagListEditor
                  items={form.overview}
                  onChange={(v) => set("overview", v)}
                  placeholder="Add a paragraph…"
                />
              </FormField>
              <FormField label="Guide body">
                <textarea
                  className={`${inputClass} min-h-[100px] resize-y`}
                  value={form.guideBody}
                  onChange={(e) => set("guideBody", e.target.value)}
                />
              </FormField>
              <FormField label="Guide bullets">
                <TagListEditor items={form.guideBullets} onChange={(v) => set("guideBullets", v)} />
              </FormField>
            </div>
          )}

          {tab === "Guidelines" && (
            <div>
              <p className="mb-3 text-sm text-on-surface-variant">
                The icon + title + body cards shown as regulatory guidelines on the activity page.
              </p>
              <CardListEditor items={form.guidelines} onChange={(v) => set("guidelines", v)} />
            </div>
          )}

          {tab === "Equipment & Permits" && (
            <div>
              <FormField label="Equipment provided">
                <TagListEditor
                  items={form.equipmentProvided}
                  onChange={(v) => set("equipmentProvided", v)}
                />
              </FormField>
              <FormField label="Permit note">
                <textarea
                  className={`${inputClass} min-h-[100px] resize-y`}
                  value={form.permitNote}
                  onChange={(e) => set("permitNote", e.target.value)}
                />
              </FormField>
            </div>
          )}

          {tab === "Related Content" && (
            <div>
              <FormField label="Available at destinations (slugs)">
                <TagListEditor
                  items={form.destinationSlugs}
                  onChange={(v) => set("destinationSlugs", v)}
                  placeholder="e.g. jolly-buoy-island"
                />
              </FormField>
              <FormField label="Related activities (slugs)">
                <TagListEditor
                  items={form.relatedActivitySlugs}
                  onChange={(v) => set("relatedActivitySlugs", v)}
                  placeholder="e.g. glass-bottom-boating"
                />
              </FormField>
            </div>
          )}

          {tab === "Gallery & Media" && (
            <div>
              <FormField label="Hero / background image" hint="Shown as the full-width banner at the top of the activity page.">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-black/5">
                    <Image src={form.heroImage} alt="" fill sizes="128px" className="object-cover" />
                  </div>
                  <input
                    className={inputClass}
                    value={form.heroImage}
                    onChange={(e) => set("heroImage", e.target.value)}
                  />
                </div>
              </FormField>
              <FormField label="Gallery images">
                <GalleryEditor
                  images={form.galleryImages}
                  onChange={(v) => set("galleryImages", v)}
                />
              </FormField>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-on-surface-variant">Status</p>
            {isNew ? (
              <Badge tone="warning">New — saved as Draft</Badge>
            ) : (
              <Badge tone={status === "PUBLISHED" ? "success" : "warning"}>
                {status === "PUBLISHED" ? "Published" : "Draft"}
              </Badge>
            )}
            <p className="mt-3 text-xs text-on-surface-variant">
              Toggle publish state from the Activities list. Changes here save straight to the
              database.
            </p>
          </Card>
          <Card className="overflow-hidden">
            <div className="relative aspect-video w-full bg-black/5">
              <Image src={form.heroImage} alt="" fill sizes="280px" className="object-cover" />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-on-surface">{form.title || "Untitled"}</p>
              <p className="text-xs text-on-surface-variant">{form.duration}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
