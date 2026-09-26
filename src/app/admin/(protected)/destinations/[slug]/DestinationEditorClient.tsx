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
  GalleryEditor,
  ImageField,
  FormField,
  StatusSwitch,
  inputClass,
  type ContentStatus,
} from "@/components/admin/AdminUI";
import {
  saveDestinationAction,
  setDestinationStatusAction,
  type DestinationInput,
} from "../actions";

const TABS = ["Overview", "Access & Fees", "Facilities", "Eco & Safety", "Gallery & Media"] as const;
type Tab = (typeof TABS)[number];

const BLANK: DestinationInput = {
  slug: "",
  title: "",
  subtitle: "",
  region: "",
  rangeDivision: "",
  overview: "",
  accessRoad: "",
  accessShip: "",
  bestTime: "",
  timing: "",
  permits: "",
  fees: "",
  activities: [],
  facility: [],
  accommodation: "",
  hospital: "",
  nearbyPlaces: [],
  conservationNotes: "",
  ecoGuidelines: [],
  safetyTips: [],
  whatToSee: [],
  image: "/images/alternate/alternate-image-destinations.jpg",
  heroImagePosition: "",
  galleryImages: [],
  galleryTitles: [],
};

export function DestinationEditorClient({
  initialData,
  originalSlug,
  status,
  regions,
}: {
  initialData: DestinationInput | null;
  originalSlug: string | null;
  status: "PUBLISHED" | "DRAFT" | null;
  /** Region names managed under Pages & Sections → Destinations page. */
  regions: string[];
}) {
  const router = useRouter();
  const isNew = !originalSlug;
  const [form, setForm] = useState<DestinationInput>(
    initialData ?? { ...BLANK, region: regions[0] ?? "" },
  );
  // A region since removed from the list stays selectable, so it isn't silently changed.
  const regionOptions =
    !form.region || regions.includes(form.region) ? regions : [form.region, ...regions];
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
        await setDestinationStatusAction(originalSlug, next);
        router.refresh();
      } catch (err) {
        setCurrentStatus(previous);
        setError(err instanceof Error ? err.message : "Couldn't change the status.");
      }
    });
  }

  function set<K extends keyof DestinationInput>(key: K, value: DestinationInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await saveDestinationAction(originalSlug, form);
        setSavedAt(new Date().toLocaleTimeString());
        if (isNew) {
          router.push(`/admin/destinations/${result.slug}`);
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
        href="/admin/destinations"
        className="mb-4 flex items-center gap-1 text-sm font-semibold text-secondary hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Destinations
      </Link>

      <PageHeader
        title={isNew ? "Add destination" : form.title || "Untitled destination"}
        description={
          isNew
            ? "Fill in every tab below, then publish when ready."
            : `/${form.slug} · ${form.region}`
        }
        actions={
          <>
            <SecondaryButton icon="visibility">Preview on site</SecondaryButton>
            <PrimaryButton icon="save" onClick={save}>
              {pending ? "Saving…" : isNew ? "Create destination" : "Save changes"}
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
                    placeholder="e.g. radhanagar-beach"
                  />
                </FormField>
                <FormField label="Region">
                  <select
                    className={inputClass}
                    value={form.region}
                    onChange={(e) => set("region", e.target.value)}
                  >
                    {regionOptions.map((r) => (
                      <option key={r} value={r}>
                        {regions.includes(r) ? r : `${r} (not in region list)`}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Range division">
                  <input
                    className={inputClass}
                    value={form.rangeDivision}
                    onChange={(e) => set("rangeDivision", e.target.value)}
                    placeholder="e.g. Wildlife Range, South Andaman"
                  />
                </FormField>
              </div>
              <FormField label="Subtitle" hint="Short one-line description shown on cards.">
                <input
                  className={inputClass}
                  value={form.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                />
              </FormField>
              <FormField label="Overview">
                <textarea
                  className={`${inputClass} min-h-[140px] resize-y`}
                  value={form.overview}
                  onChange={(e) => set("overview", e.target.value)}
                />
              </FormField>
              <FormField label="What to see" hint="Bulleted highlights shown on the destination page.">
                <TagListEditor
                  items={form.whatToSee}
                  onChange={(v) => set("whatToSee", v)}
                  placeholder="e.g. Bioluminescent plankton at night"
                />
              </FormField>
            </div>
          )}

          {tab === "Access & Fees" && (
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Access by road">
                  <input
                    className={inputClass}
                    value={form.accessRoad}
                    onChange={(e) => set("accessRoad", e.target.value)}
                  />
                </FormField>
                <FormField label="Access by ship/ferry">
                  <input
                    className={inputClass}
                    value={form.accessShip}
                    onChange={(e) => set("accessShip", e.target.value)}
                  />
                </FormField>
                <FormField label="Best time to visit">
                  <input
                    className={inputClass}
                    value={form.bestTime}
                    onChange={(e) => set("bestTime", e.target.value)}
                  />
                </FormField>
                <FormField label="Visiting hours">
                  <input
                    className={inputClass}
                    value={form.timing}
                    onChange={(e) => set("timing", e.target.value)}
                  />
                </FormField>
              </div>
              <FormField label="Permits required">
                <textarea
                  className={`${inputClass} min-h-[80px] resize-y`}
                  value={form.permits}
                  onChange={(e) => set("permits", e.target.value)}
                />
              </FormField>
              <FormField label="Entry fees">
                <textarea
                  className={`${inputClass} min-h-[80px] resize-y`}
                  value={form.fees}
                  onChange={(e) => set("fees", e.target.value)}
                />
              </FormField>
              <FormField label="Activities available here">
                <TagListEditor items={form.activities} onChange={(v) => set("activities", v)} />
              </FormField>
            </div>
          )}

          {tab === "Facilities" && (
            <div>
              <FormField label="On-site facilities">
                <TagListEditor items={form.facility} onChange={(v) => set("facility", v)} />
              </FormField>
              <FormField label="Accommodation">
                <textarea
                  className={`${inputClass} min-h-[80px] resize-y`}
                  value={form.accommodation}
                  onChange={(e) => set("accommodation", e.target.value)}
                />
              </FormField>
              <FormField label="Nearest hospital">
                <input
                  className={inputClass}
                  value={form.hospital}
                  onChange={(e) => set("hospital", e.target.value)}
                />
              </FormField>
              <FormField label="Nearby places">
                <TagListEditor items={form.nearbyPlaces} onChange={(v) => set("nearbyPlaces", v)} />
              </FormField>
            </div>
          )}

          {tab === "Eco & Safety" && (
            <div>
              <FormField label="Conservation notes">
                <textarea
                  className={`${inputClass} min-h-[100px] resize-y`}
                  value={form.conservationNotes}
                  onChange={(e) => set("conservationNotes", e.target.value)}
                />
              </FormField>
              <FormField label="Eco guidelines">
                <TagListEditor
                  items={form.ecoGuidelines}
                  onChange={(v) => set("ecoGuidelines", v)}
                  placeholder="e.g. No single-use plastics beyond this point"
                />
              </FormField>
              <FormField label="Safety tips">
                <TagListEditor
                  items={form.safetyTips}
                  onChange={(v) => set("safetyTips", v)}
                  placeholder="e.g. Strong currents past the reef line"
                />
              </FormField>
            </div>
          )}

          {tab === "Gallery & Media" && (
            <div>
              <FormField label="Hero / background image" hint="Shown as the full-width banner at the top of the destination page.">
                <ImageField value={form.image} onChange={(v) => set("image", v)} />
              </FormField>
              <FormField label="Hero image position" hint="CSS object-position — only needed if the default crop looks off.">
                <input
                  className={inputClass}
                  value={form.heroImagePosition ?? ""}
                  onChange={(e) => set("heroImagePosition", e.target.value)}
                  placeholder="e.g. center 30%"
                />
              </FormField>
              <FormField label="Gallery images" hint="Photos shown in the destination's gallery. Give each a title — it's shown as the caption on the site.">
                <GalleryEditor
                  images={form.galleryImages ?? []}
                  titles={form.galleryTitles ?? []}
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
                  Create the destination first, then publish it from here.
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
            <div className="relative aspect-video w-full bg-black/5">
              <Image src={form.image} alt="" fill sizes="280px" className="object-cover" />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-on-surface">{form.title || "Untitled"}</p>
              <p className="text-xs text-on-surface-variant">{form.subtitle}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
