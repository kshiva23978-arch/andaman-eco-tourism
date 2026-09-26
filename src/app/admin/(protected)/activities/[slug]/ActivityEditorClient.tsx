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
  Tabs,
  TagListEditor,
  CardListEditor,
  GalleryEditor,
  BackgroundEditor,
  DEFAULT_BACKGROUND,
  backgroundStyle,
  overlayStyle,
  FormField,
  StatusSwitch,
  SlugPicker,
  inputClass,
  type ContentStatus,
  type SlugOption,
} from "@/components/admin/AdminUI";
import { saveActivityAction, setActivityStatusAction, type ActivityInput } from "../actions";

const TABS = ["Overview", "Guidelines", "Equipment & Permits", "Related Content", "Gallery & Media"] as const;
type Tab = (typeof TABS)[number];

const BLANK: ActivityInput = {
  slug: "",
  title: "",
  tagline: "",
  icon: "hiking",
  heroBackground: { ...DEFAULT_BACKGROUND, overlay: { ...DEFAULT_BACKGROUND.overlay, enabled: false } },
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
  galleryTitles: [],
};

export function ActivityEditorClient({
  initialData,
  originalSlug,
  status,
  options,
}: {
  initialData: ActivityInput | null;
  originalSlug: string | null;
  status: "PUBLISHED" | "DRAFT" | null;
  options: { destinations: SlugOption[]; activities: SlugOption[] };
}) {
  const router = useRouter();
  const isNew = !originalSlug;
  const [form, setForm] = useState<ActivityInput>(initialData ?? BLANK);
  const [tab, setTab] = useState<Tab>("Overview");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState<ContentStatus>(status ?? "DRAFT");
  const [statusPending, startStatusTransition] = useTransition();

  function changeStatus(next: ContentStatus) {
    if (!originalSlug) return;
    const previous = currentStatus;
    setError(null);
    setCurrentStatus(next);
    startStatusTransition(async () => {
      try {
        await setActivityStatusAction(originalSlug, next);
        router.refresh();
      } catch (err) {
        setCurrentStatus(previous);
        setError(err instanceof Error ? err.message : "Couldn't change the status.");
      }
    });
  }

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
              <FormField
                label="Available at destinations"
                hint="Shown as destination cards on the activity page, in this order."
              >
                <SlugPicker
                  value={form.destinationSlugs}
                  onChange={(v) => set("destinationSlugs", v)}
                  options={options.destinations}
                  placeholder="Search destinations…"
                />
              </FormField>
              <FormField
                label="Related activities"
                hint={'Shown under "Explore More Activities" on the activity page, in this order.'}
              >
                <SlugPicker
                  value={form.relatedActivitySlugs}
                  onChange={(v) => set("relatedActivitySlugs", v)}
                  options={options.activities}
                  exclude={[form.slug]}
                  placeholder="Search activities…"
                />
              </FormField>
            </div>
          )}

          {tab === "Gallery & Media" && (
            <div>
              <FormField
                label="Hero background"
                hint="The full-width banner at the top of the activity page: a photo, a flat color, or plain. Add a color overlay to tint it."
              >
                <BackgroundEditor
                  value={form.heroBackground}
                  onChange={(v) => set("heroBackground", v)}
                  allowPlain
                />
              </FormField>
              <FormField label="Gallery images" hint="Give each image a title — it's shown as the caption on the site.">
                <GalleryEditor
                  images={form.galleryImages}
                  titles={form.galleryTitles}
                  onChange={(images, titles) =>
                    setForm((f) => ({ ...f, galleryImages: images, galleryTitles: titles }))
                  }
                />
              </FormField>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-on-surface-variant">Status</p>
            {isNew ? (
              <>
                <Badge tone="warning">New — saved as Draft</Badge>
                <p className="mt-3 text-xs text-on-surface-variant">
                  Create the activity first, then publish it from here.
                </p>
              </>
            ) : (
              <>
                <StatusSwitch
                  status={currentStatus}
                  onChange={changeStatus}
                  disabled={statusPending}
                />
                <p className="mt-3 text-xs text-on-surface-variant">
                  {currentStatus === "PUBLISHED"
                    ? "Live on the public site. Switch to Draft to hide it."
                    : "Hidden from the public site until published."}
                </p>
              </>
            )}
          </Card>
          <Card className="overflow-hidden">
            <div
              className="relative flex aspect-video w-full items-end bg-black/5 p-3"
              style={backgroundStyle(form.heroBackground)}
            >
              <div className="absolute inset-0" style={overlayStyle(form.heroBackground)} />
              <span
                className={`relative text-sm font-semibold ${
                  form.heroBackground.type === "plain" ? "text-on-surface" : "text-white"
                }`}
              >
                {form.title || "Untitled"}
              </span>
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
