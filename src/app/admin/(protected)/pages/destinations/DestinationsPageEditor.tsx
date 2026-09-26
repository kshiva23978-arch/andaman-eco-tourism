"use client";

import { useState } from "react";
import { FormField, MediaInput, SecondaryButton, inputClass } from "@/components/admin/AdminUI";
import {
  ContentEditorShell,
  ItemControls,
  TextArea,
  TextInput,
  moveItem,
  COUNT_HINT,
} from "@/components/admin/ContentEditorShell";
import {
  DESTINATIONS_LIST_DEFAULTS,
  type BannerCard,
  type DestinationsListContent,
} from "@/lib/content/destinations";

const TABS = ["Banner", "Regions"] as const;
type Tab = (typeof TABS)[number];
const TAB_SECTION: Record<Tab, keyof DestinationsListContent> = { Banner: "banner", Regions: "regions" };

export function DestinationsPageEditor({
  initialContent,
  lastSaved,
  regionUsage,
}: {
  initialContent: DestinationsListContent;
  lastSaved: string | null;
  /** How many destinations use each region name (all statuses). */
  regionUsage: Record<string, number>;
}) {
  const [newRegion, setNewRegion] = useState("");

  return (
    <ContentEditorShell
      pageKey="destinations"
      title="Destinations page"
      intro="The banner and region filter on the destinations directory."
      viewHref="/destinations"
      tabs={TABS}
      tabSection={TAB_SECTION}
      defaults={DESTINATIONS_LIST_DEFAULTS}
      initialContent={initialContent}
      lastSaved={lastSaved}
    >
      {(tab, content, patch) => {
        const { banner, regions } = content;
        const setCard = (i: number, value: Partial<BannerCard>) =>
          patch("banner", { cards: banner.cards.map((c, idx) => (idx === i ? { ...c, ...value } : c)) });
        const addRegion = () => {
          const name = newRegion.trim();
          if (!name || regions.includes(name)) return;
          patch("regions", [...regions, name]);
          setNewRegion("");
        };
        // Destinations still pointing at a region that isn't in the list.
        const orphaned = Object.keys(regionUsage).filter((r) => !regions.includes(r));

        return (
          <>
            {tab === "Banner" && (
              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Title — line 1">
                    <TextInput value={banner.titleLine1} onChange={(v) => patch("banner", { titleLine1: v })} />
                  </FormField>
                  <FormField label="Title — line 2" hint="Shown in the accent color.">
                    <TextInput value={banner.titleLine2} onChange={(v) => patch("banner", { titleLine2: v })} />
                  </FormField>
                </div>
                <FormField label="Small label above the title">
                  <TextInput value={banner.eyebrow} onChange={(v) => patch("banner", { eyebrow: v })} />
                </FormField>
                <FormField label="Text">
                  <TextArea value={banner.body} onChange={(v) => patch("banner", { body: v })} />
                </FormField>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField label="Destinations counter" hint={COUNT_HINT}>
                    <TextInput
                      value={banner.destinationsLabel}
                      onChange={(v) => patch("banner", { destinationsLabel: v })}
                    />
                  </FormField>
                  <FormField label="Regions counter" hint={COUNT_HINT}>
                    <TextInput value={banner.regionsLabel} onChange={(v) => patch("banner", { regionsLabel: v })} />
                  </FormField>
                  <FormField label="Button text">
                    <TextInput value={banner.ctaLabel} onChange={(v) => patch("banner", { ctaLabel: v })} />
                  </FormField>
                </div>
                <FormField label="Background image">
                  <MediaInput
                    value={banner.backgroundImage}
                    onChange={(v) => patch("banner", { backgroundImage: v })}
                  />
                </FormField>
                <FormField
                  label="Floating photo cards"
                  hint="The three tilted photos on the right of the banner (hidden on phones). Clear a photo to hide that card."
                >
                  <div className="flex flex-col gap-3">
                    {banner.cards.map((card, i) => (
                      <div key={i} className="grid grid-cols-1 gap-3 rounded-lg border border-black/10 p-3 sm:grid-cols-[1fr_220px]">
                        <MediaInput value={card.image} onChange={(v) => setCard(i, { image: v })} />
                        <TextInput value={card.label} onChange={(v) => setCard(i, { label: v })} placeholder="Caption" />
                      </div>
                    ))}
                  </div>
                </FormField>
              </div>
            )}

            {tab === "Regions" && (
              <div>
                <p className="mb-4 text-sm text-on-surface-variant">
                  These regions appear in the directory&apos;s filter and in the Region dropdown when editing a
                  destination, in this order. Renaming a region here does <strong>not</strong> rename it on
                  destinations that already use it — update those destinations too.
                </p>
                <ul className="mb-3 flex flex-col gap-2">
                  {regions.map((region, i) => (
                    <li key={i} className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2">
                      <input
                        className={`${inputClass} flex-1`}
                        value={region}
                        onChange={(e) => patch("regions", regions.map((r, idx) => (idx === i ? e.target.value : r)))}
                        aria-label={`Region ${i + 1}`}
                      />
                      <span className="w-28 shrink-0 text-right text-xs text-on-surface-variant">
                        {regionUsage[region] ?? 0} destination{(regionUsage[region] ?? 0) === 1 ? "" : "s"}
                      </span>
                      <ItemControls
                        index={i}
                        count={regions.length}
                        label={region}
                        onMove={(dir) => patch("regions", moveItem(regions, i, dir))}
                        onRemove={
                          regionUsage[region]
                            ? undefined
                            : () => patch("regions", regions.filter((_, idx) => idx !== i))
                        }
                      />
                    </li>
                  ))}
                </ul>
                <p className="mb-3 text-xs text-on-surface-variant">
                  A region used by destinations can&apos;t be removed — move those destinations first.
                </p>
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRegion();
                      }
                    }}
                    placeholder="New region name…"
                  />
                  <SecondaryButton icon="add" onClick={addRegion}>
                    Add
                  </SecondaryButton>
                </div>
                {orphaned.length > 0 && (
                  <div className="mt-4 rounded-lg bg-[#fdecd2] px-3 py-2.5 text-sm text-[#8a5a00]">
                    <strong>Not in the list:</strong> {orphaned.join(", ")} — destinations using these won&apos;t
                    appear under any filter except &quot;All Regions&quot;.
                  </div>
                )}
              </div>
            )}
          </>
        );
      }}
    </ContentEditorShell>
  );
}
