"use client";

import {
  FormField,
  MediaInput,
  SecondaryButton,
  SlugPicker,
  TagListEditor,
  type SlugOption,
} from "@/components/admin/AdminUI";
import {
  ContentEditorShell,
  ItemControls,
  SimpleFields,
  TextArea,
  TextInput,
  moveItem,
} from "@/components/admin/ContentEditorShell";
import {
  ACTIVITIES_GUIDE_DEFAULTS,
  type ActivitiesGuideContent,
  type ActivityGroup,
  type CoastalPanel,
  type GuideHeroSlide,
} from "@/lib/content/activities";

const TABS = ["Hero slider", "Conservation", "Activity groups", "Coastal", "Closing"] as const;
type Tab = (typeof TABS)[number];
const TAB_SECTION: Record<Tab, keyof ActivitiesGuideContent> = {
  "Hero slider": "hero",
  Conservation: "principles",
  "Activity groups": "groups",
  Coastal: "coastal",
  Closing: "cta",
};

const BLANK_SLIDE: GuideHeroSlide = {
  image: "",
  eyebrow: "",
  title: "",
  accent: "",
  description: "",
  href: "",
  cta: "",
};

/** Bordered card for one item in a repeatable list, with its heading and controls. */
function ItemCard({
  heading,
  controls,
  children,
}: {
  heading: string;
  controls: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-black/10 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase text-on-surface-variant">{heading}</span>
        {controls}
      </div>
      {children}
    </div>
  );
}

export function ActivitiesGuideEditor({
  initialContent,
  lastSaved,
  activityOptions,
}: {
  initialContent: ActivitiesGuideContent;
  lastSaved: string | null;
  activityOptions: SlugOption[];
}) {
  return (
    <ContentEditorShell
      pageKey="activities"
      title="Activities guide page"
      intro="The hero slider, activity groups and supporting sections on /activities."
      viewHref="/activities"
      tabs={TABS}
      tabSection={TAB_SECTION}
      defaults={ACTIVITIES_GUIDE_DEFAULTS}
      initialContent={initialContent}
      lastSaved={lastSaved}
    >
      {(tab, content, patch) => {
        const { hero, principles, groups, otherGroup, coastal, cta } = content;

        const setSlide = (i: number, value: Partial<GuideHeroSlide>) =>
          patch("hero", { slides: hero.slides.map((s, idx) => (idx === i ? { ...s, ...value } : s)) });
        const setGroup = (i: number, value: Partial<ActivityGroup>) =>
          patch("groups", groups.map((g, idx) => (idx === i ? { ...g, ...value } : g)));
        const setPanel = (i: number, value: Partial<CoastalPanel>) =>
          patch("coastal", { panels: coastal.panels.map((p, idx) => (idx === i ? { ...p, ...value } : p)) });

        const grouped = new Set(groups.flatMap((g) => g.slugs));
        const ungrouped = activityOptions.filter((a) => a.status === "PUBLISHED" && !grouped.has(a.slug));

        return (
          <>
            {tab === "Hero slider" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-on-surface-variant">
                  Full-width slides at the top of the page. A slide needs an image, a title and a link to show.
                </p>
                {hero.slides.map((slide, i) => (
                  <ItemCard
                    key={i}
                    heading={`Slide ${i + 1}`}
                    controls={
                      <ItemControls
                        index={i}
                        count={hero.slides.length}
                        label={slide.accent || `slide ${i + 1}`}
                        onMove={(dir) => patch("hero", { slides: moveItem(hero.slides, i, dir) })}
                        onRemove={() => patch("hero", { slides: hero.slides.filter((_, idx) => idx !== i) })}
                      />
                    }
                  >
                    <FormField label="Image">
                      <MediaInput value={slide.image} onChange={(v) => setSlide(i, { image: v })} />
                    </FormField>
                    <FormField label="Small label" hint="e.g. Marine · Diving">
                      <TextInput value={slide.eyebrow} onChange={(v) => setSlide(i, { eyebrow: v })} />
                    </FormField>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Title">
                        <TextInput value={slide.title} onChange={(v) => setSlide(i, { title: v })} />
                      </FormField>
                      <FormField label="Title — colored part">
                        <TextInput value={slide.accent} onChange={(v) => setSlide(i, { accent: v })} />
                      </FormField>
                    </div>
                    <FormField label="Text">
                      <TextArea value={slide.description} onChange={(v) => setSlide(i, { description: v })} />
                    </FormField>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Button text">
                        <TextInput value={slide.cta} onChange={(v) => setSlide(i, { cta: v })} />
                      </FormField>
                      <FormField label="Button link" hint="e.g. /activities/scuba-snorkeling">
                        <TextInput value={slide.href} onChange={(v) => setSlide(i, { href: v })} />
                      </FormField>
                    </div>
                  </ItemCard>
                ))}
                <div>
                  <SecondaryButton icon="add" onClick={() => patch("hero", { slides: [...hero.slides, BLANK_SLIDE] })}>
                    Add slide
                  </SecondaryButton>
                </div>
              </div>
            )}

            {tab === "Conservation" && (
              <div>
                <SimpleFields
                  fields={[
                    { key: "chip", label: "Small label" },
                    { key: "title", label: "Heading" },
                    { key: "body", label: "Text", kind: "textarea" },
                    { key: "awarenessTitle", label: "Green box — heading" },
                    { key: "awarenessIcon", label: "Green box — icon", hint: "Material Symbols name." },
                    { key: "background", label: "Background pattern", kind: "media" },
                  ]}
                  values={principles}
                  onChange={(key, value) => patch("principles", { [key]: value })}
                />
                <FormField label="Green box — checklist">
                  <TagListEditor
                    items={principles.awarenessItems}
                    onChange={(v) => patch("principles", { awarenessItems: v })}
                  />
                </FormField>
              </div>
            )}

            {tab === "Activity groups" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-on-surface-variant">
                  Each group gets a heading, a button in the jump-to bar and its activities in order. Blocks
                  alternate automatically. Draft activities are skipped on the site.
                </p>
                {groups.map((group, i) => (
                  <ItemCard
                    key={i}
                    heading={`Group ${i + 1}`}
                    controls={
                      <ItemControls
                        index={i}
                        count={groups.length}
                        label={group.title || `group ${i + 1}`}
                        onMove={(dir) => patch("groups", moveItem(groups, i, dir))}
                        onRemove={() => patch("groups", groups.filter((_, idx) => idx !== i))}
                      />
                    }
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <FormField label="Small label">
                        <TextInput value={group.kicker} onChange={(v) => setGroup(i, { kicker: v })} />
                      </FormField>
                      <FormField label="Heading">
                        <TextInput value={group.title} onChange={(v) => setGroup(i, { title: v })} />
                      </FormField>
                      <FormField label="Jump-to button">
                        <TextInput value={group.navLabel} onChange={(v) => setGroup(i, { navLabel: v })} />
                      </FormField>
                    </div>
                    <FormField label="Activities">
                      <SlugPicker
                        value={group.slugs}
                        onChange={(v) => setGroup(i, { slugs: v })}
                        options={activityOptions}
                        placeholder="Search activities…"
                      />
                    </FormField>
                  </ItemCard>
                ))}
                <div>
                  <SecondaryButton
                    icon="add"
                    onClick={() => patch("groups", [...groups, { navLabel: "", kicker: "", title: "", slugs: [] }])}
                  >
                    Add group
                  </SecondaryButton>
                </div>

                <ItemCard heading="Activities not in any group" controls={null}>
                  <p className="mb-3 text-sm text-on-surface-variant">
                    {ungrouped.length === 0
                      ? "Every published activity is in a group."
                      : `Shown last, under this heading: ${ungrouped.map((a) => a.title).join(", ")}.`}
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField label="Small label">
                      <TextInput value={otherGroup.kicker} onChange={(v) => patch("otherGroup", { kicker: v })} />
                    </FormField>
                    <FormField label="Heading">
                      <TextInput value={otherGroup.title} onChange={(v) => patch("otherGroup", { title: v })} />
                    </FormField>
                    <FormField label="Jump-to button">
                      <TextInput value={otherGroup.navLabel} onChange={(v) => patch("otherGroup", { navLabel: v })} />
                    </FormField>
                  </div>
                </ItemCard>
              </div>
            )}

            {tab === "Coastal" && (
              <div>
                <SimpleFields
                  fields={[
                    { key: "chip", label: "Small label" },
                    { key: "title", label: "Heading" },
                    { key: "body", label: "Text", kind: "textarea" },
                  ]}
                  values={coastal}
                  onChange={(key, value) => patch("coastal", { [key]: value })}
                />
                <FormField label="Panels">
                  <div className="flex flex-col gap-4">
                    {coastal.panels.map((panel, i) => (
                      <ItemCard
                        key={i}
                        heading={`Panel ${i + 1}`}
                        controls={
                          <ItemControls
                            index={i}
                            count={coastal.panels.length}
                            label={panel.title || `panel ${i + 1}`}
                            onMove={(dir) => patch("coastal", { panels: moveItem(coastal.panels, i, dir) })}
                            onRemove={() =>
                              patch("coastal", { panels: coastal.panels.filter((_, idx) => idx !== i) })
                            }
                          />
                        }
                      >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_200px]">
                          <FormField label="Title">
                            <TextInput value={panel.title} onChange={(v) => setPanel(i, { title: v })} />
                          </FormField>
                          <FormField label="Icon" hint="Material Symbols name.">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary-container text-secondary">
                                {panel.icon || "eco"}
                              </span>
                              <TextInput value={panel.icon} onChange={(v) => setPanel(i, { icon: v })} />
                            </div>
                          </FormField>
                        </div>
                        <FormField label="Checklist">
                          <TagListEditor items={panel.rows} onChange={(v) => setPanel(i, { rows: v })} />
                        </FormField>
                      </ItemCard>
                    ))}
                    <div>
                      <SecondaryButton
                        icon="add"
                        onClick={() =>
                          patch("coastal", { panels: [...coastal.panels, { icon: "eco", title: "", rows: [] }] })
                        }
                      >
                        Add panel
                      </SecondaryButton>
                    </div>
                  </div>
                </FormField>
              </div>
            )}

            {tab === "Closing" && (
              <SimpleFields
                fields={[
                  { key: "title", label: "Heading" },
                  { key: "body", label: "Text", kind: "textarea" },
                  { key: "buttonLabel", label: "Button text" },
                  { key: "buttonHref", label: "Button link", kind: "link", hint: "Leave empty to hide the button." },
                ]}
                values={cta}
                onChange={(key, value) => patch("cta", { [key]: value })}
              />
            )}
          </>
        );
      }}
    </ContentEditorShell>
  );
}
