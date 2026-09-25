"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { regions } from "@/lib/data/destinations";
import {
  Card,
  PageHeader,
  Badge,
  PrimaryButton,
  SecondaryButton,
  Tabs,
  TagListEditor,
  GalleryEditor,
  FormField,
  inputClass,
} from "@/components/admin/AdminUI";
import { saveDestinationAction, type DestinationInput } from "../actions";

const TABS = ["Overview", "Access & Fees", "Facilities", "Eco & Safety", "Gallery & Media"] as const;
type Tab = (typeof TABS)[number];

const BLANK: DestinationInput = {
  slug: "",
  title: "",
  subtitle: "",
  region: "South Andaman",
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
};

export function DestinationEditorClient({
  initialData,
  originalSlug,
  status,
}: {
  initialData: DestinationInput | null;
  originalSlug: string | null;
  status: "PUBLISHED" | "DRAFT" | null;
}) {
  const router = useRouter();
  const isNew = !originalSlug;
  const [form, setForm] = useState<DestinationInput>(initialData ?? BLANK);
  const [tab, setTab] = useState<Tab>("Overview");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
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
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-black/5">
                    <Image src={form.image} alt="" fill sizes="128px" className="object-cover" />
                  </div>
                  <input
                    className={inputClass}
                    value={form.image}
                    onChange={(e) => set("image", e.target.value)}
                  />
                </div>
              </FormField>
              <FormField label="Hero image position" hint="CSS object-position — only needed if the default crop looks off.">
                <input
                  className={inputClass}
                  value={form.heroImagePosition ?? ""}
                  onChange={(e) => set("heroImagePosition", e.target.value)}
                  placeholder="e.g. center 30%"
                />
              </FormField>
              <FormField label="Gallery images" hint="Additional photos shown in the destination's gallery strip.">
                <GalleryEditor
                  images={form.galleryImages ?? []}
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
              Toggle publish state from the Destinations list. Changes here save straight to the
              database.
            </p>
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
