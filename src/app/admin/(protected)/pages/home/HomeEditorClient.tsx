"use client";

import Link from "next/link";
import {
  SecondaryButton,
  FormField,
  TagListEditor,
  CardListEditor,
  SlugPicker,
  MediaInput,
  type SlugOption,
} from "@/components/admin/AdminUI";
import {
  ContentEditorShell,
  ItemControls,
  TextArea,
  TextInput,
  moveItem,
  ACCENT_HINT,
  COUNT_HINT,
} from "@/components/admin/ContentEditorShell";
import { HOME_DEFAULTS, type FeatureBlock, type HeroSlide, type HomeContent } from "@/lib/content/home";

const TABS = [
  "Hero",
  "Island map",
  "Featured destinations",
  "Why sustainable",
  "Featured activities",
  "Eco-guidelines",
] as const;
type Tab = (typeof TABS)[number];

const TAB_SECTION: Record<Tab, keyof HomeContent> = {
  Hero: "hero",
  "Island map": "map",
  "Featured destinations": "featuredDestinations",
  "Why sustainable": "sustainability",
  "Featured activities": "featuredActivities",
  "Eco-guidelines": "ecoGuidelines",
};

export function HomeEditorClient({
  initialContent,
  lastSaved,
  options,
}: {
  initialContent: HomeContent;
  lastSaved: string | null;
  options: { destinations: SlugOption[]; activities: SlugOption[] };
}) {
  return (
    <ContentEditorShell
      pageKey="home"
      title="Home page"
      intro="Everything on the public home page."
      viewHref="/"
      tabs={TABS}
      tabSection={TAB_SECTION}
      defaults={HOME_DEFAULTS}
      initialContent={initialContent}
      lastSaved={lastSaved}
    >
      {(tab, content, patch) => {
        const { hero, map, featuredDestinations: fd, sustainability: sus, featuredActivities: fa, ecoGuidelines: eco } =
          content;
        const setSlide = (i: number, value: Partial<HeroSlide>) =>
          patch("hero", { slides: hero.slides.map((s, idx) => (idx === i ? { ...s, ...value } : s)) });
        const setBlock = (i: number, value: Partial<FeatureBlock>) =>
          patch("sustainability", { blocks: sus.blocks.map((b, idx) => (idx === i ? { ...b, ...value } : b)) });

        return (
          <>
            {tab === "Hero" && (
              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Title — line 1" hint="Keep each line short; they don't wrap.">
                    <TextInput value={hero.titleLine1} onChange={(v) => patch("hero", { titleLine1: v })} />
                  </FormField>
                  <FormField label="Title — line 2">
                    <TextInput value={hero.titleLine2} onChange={(v) => patch("hero", { titleLine2: v })} />
                  </FormField>
                </div>
                <FormField label="Small label above the title">
                  <TextInput value={hero.eyebrow} onChange={(v) => patch("hero", { eyebrow: v })} />
                </FormField>
                <FormField label="Subtitle">
                  <TextArea value={hero.subtitle} onChange={(v) => patch("hero", { subtitle: v })} />
                </FormField>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Main button — text">
                    <TextInput
                      value={hero.primaryCta.label}
                      onChange={(v) => patch("hero", { primaryCta: { ...hero.primaryCta, label: v } })}
                    />
                  </FormField>
                  <FormField label="Main button — link" hint="A page path like /destinations, or a full https:// URL.">
                    <TextInput
                      value={hero.primaryCta.href}
                      onChange={(v) => patch("hero", { primaryCta: { ...hero.primaryCta, href: v } })}
                    />
                  </FormField>
                  <FormField label="Second link — text">
                    <TextInput
                      value={hero.secondaryCta.label}
                      onChange={(v) => patch("hero", { secondaryCta: { ...hero.secondaryCta, label: v } })}
                    />
                  </FormField>
                  <FormField label="Second link — link">
                    <TextInput
                      value={hero.secondaryCta.href}
                      onChange={(v) => patch("hero", { secondaryCta: { ...hero.secondaryCta, href: v } })}
                    />
                  </FormField>
                </div>
                <FormField label="Opening video" hint="Plays full-screen once per visit, before the hero appears.">
                  <MediaInput kind="video" value={hero.introVideo} onChange={(v) => patch("hero", { introVideo: v })} />
                </FormField>
                <FormField
                  label="Background videos"
                  hint="The hero plays these in order. The names appear as numbered chapters under the buttons."
                >
                  <div className="flex flex-col gap-3">
                    {hero.slides.map((slide, i) => (
                      <div key={i} className="rounded-lg border border-black/10 p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase text-on-surface-variant">Chapter {i + 1}</span>
                          <ItemControls
                            index={i}
                            count={hero.slides.length}
                            label={slide.name || `chapter ${i + 1}`}
                            onMove={(dir) => patch("hero", { slides: moveItem(hero.slides, i, dir) })}
                            onRemove={() => patch("hero", { slides: hero.slides.filter((_, idx) => idx !== i) })}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[200px_1fr]">
                          <TextInput value={slide.name} onChange={(v) => setSlide(i, { name: v })} placeholder="Chapter name" />
                          <MediaInput kind="video" value={slide.video} onChange={(v) => setSlide(i, { video: v })} />
                        </div>
                      </div>
                    ))}
                    <div>
                      <SecondaryButton
                        icon="add"
                        onClick={() => patch("hero", { slides: [...hero.slides, { name: "", video: "" }] })}
                      >
                        Add video
                      </SecondaryButton>
                    </div>
                  </div>
                </FormField>
              </div>
            )}
    
            {tab === "Island map" && (
              <div>
                <FormField label="Heading">
                  <TextInput value={map.title} onChange={(v) => patch("map", { title: v })} />
                </FormField>
                <FormField label="Text beside the map">
                  <TextArea value={map.body} onChange={(v) => patch("map", { body: v })} />
                </FormField>
                <FormField label="Link text" hint={COUNT_HINT}>
                  <TextInput value={map.linkLabel} onChange={(v) => patch("map", { linkLabel: v })} />
                </FormField>
                <FormField label="Background image" hint="Shown faintly behind the section. Leave empty for none.">
                  <MediaInput value={map.backgroundImage} onChange={(v) => patch("map", { backgroundImage: v })} />
                </FormField>
                <p className="mt-2 rounded-lg bg-black/[0.03] px-3 py-2.5 text-sm text-on-surface-variant">
                  The pins themselves are managed in{" "}
                  <Link href="/admin/pages/map" className="font-semibold text-secondary hover:underline">
                    Map pins
                  </Link>
                  .
                </p>
              </div>
            )}
    
            {tab === "Featured destinations" && (
              <div>
                <FormField label="Small label">
                  <TextInput value={fd.chip} onChange={(v) => patch("featuredDestinations", { chip: v })} />
                </FormField>
                <FormField label="Heading" hint={ACCENT_HINT}>
                  <TextInput value={fd.title} onChange={(v) => patch("featuredDestinations", { title: v })} />
                </FormField>
                <FormField label="Link text" hint={COUNT_HINT}>
                  <TextInput value={fd.linkLabel} onChange={(v) => patch("featuredDestinations", { linkLabel: v })} />
                </FormField>
                <FormField label="Destinations in the carousel" hint="In this order. Drafts are skipped on the site.">
                  <SlugPicker
                    value={fd.slugs}
                    onChange={(v) => patch("featuredDestinations", { slugs: v })}
                    options={options.destinations}
                    placeholder="Search destinations…"
                  />
                </FormField>
              </div>
            )}
    
            {tab === "Why sustainable" && (
              <div>
                <FormField label="Small label">
                  <TextInput value={sus.chip} onChange={(v) => patch("sustainability", { chip: v })} />
                </FormField>
                <FormField label="Heading" hint={ACCENT_HINT}>
                  <TextInput value={sus.title} onChange={(v) => patch("sustainability", { title: v })} />
                </FormField>
                <FormField
                  label="Feature blocks"
                  hint="Blocks alternate automatically: image on the right, then on the left, and so on. A block needs a title and an image to show."
                >
                  <div className="flex flex-col gap-4">
                    {sus.blocks.map((block, i) => (
                      <div key={i} className="rounded-lg border border-black/10 p-4">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase text-on-surface-variant">Block {i + 1}</span>
                          <ItemControls
                            index={i}
                            count={sus.blocks.length}
                            label={block.title || `block ${i + 1}`}
                            onMove={(dir) => patch("sustainability", { blocks: moveItem(sus.blocks, i, dir) })}
                            onRemove={() =>
                              patch("sustainability", { blocks: sus.blocks.filter((_, idx) => idx !== i) })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_180px]">
                          <FormField label="Title">
                            <TextInput value={block.title} onChange={(v) => setBlock(i, { title: v })} />
                          </FormField>
                          <FormField label="Icon" hint="Material Symbols name.">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary-container text-secondary">
                                {block.icon || "eco"}
                              </span>
                              <TextInput value={block.icon} onChange={(v) => setBlock(i, { icon: v })} />
                            </div>
                          </FormField>
                        </div>
                        <FormField label="Text">
                          <TextArea value={block.body} onChange={(v) => setBlock(i, { body: v })} />
                        </FormField>
                        <FormField label="Checklist points">
                          <TagListEditor
                            items={block.bullets}
                            onChange={(v) => setBlock(i, { bullets: v })}
                            placeholder="Add a point…"
                          />
                        </FormField>
                        <FormField label="Image">
                          <MediaInput value={block.image} onChange={(v) => setBlock(i, { image: v })} />
                        </FormField>
                        <FormField label="Image description" hint="For screen readers and search engines.">
                          <TextInput value={block.imageAlt} onChange={(v) => setBlock(i, { imageAlt: v })} />
                        </FormField>
                        <FormField label="Background illustration" hint="Faint drawing behind the block. Leave empty for none.">
                          <MediaInput value={block.watermark} onChange={(v) => setBlock(i, { watermark: v })} />
                        </FormField>
                      </div>
                    ))}
                    <div>
                      <SecondaryButton
                        icon="add"
                        onClick={() =>
                          patch("sustainability", {
                            blocks: [
                              ...sus.blocks,
                              { icon: "eco", title: "", body: "", image: "", imageAlt: "", bullets: [], watermark: "" },
                            ],
                          })
                        }
                      >
                        Add block
                      </SecondaryButton>
                    </div>
                  </div>
                </FormField>
              </div>
            )}
    
            {tab === "Featured activities" && (
              <div>
                <FormField label="Small label" hint={COUNT_HINT}>
                  <TextInput value={fa.chip} onChange={(v) => patch("featuredActivities", { chip: v })} />
                </FormField>
                <FormField label="Heading" hint={ACCENT_HINT}>
                  <TextInput value={fa.title} onChange={(v) => patch("featuredActivities", { title: v })} />
                </FormField>
                <FormField label="Link text">
                  <TextInput value={fa.linkLabel} onChange={(v) => patch("featuredActivities", { linkLabel: v })} />
                </FormField>
                <FormField label="Background image" hint="Darkened behind the cards so the white text stays readable.">
                  <MediaInput value={fa.backgroundImage} onChange={(v) => patch("featuredActivities", { backgroundImage: v })} />
                </FormField>
                <FormField label="Activities in the carousel" hint="In this order. Drafts are skipped on the site.">
                  <SlugPicker
                    value={fa.slugs}
                    onChange={(v) => patch("featuredActivities", { slugs: v })}
                    options={options.activities}
                    placeholder="Search activities…"
                  />
                </FormField>
              </div>
            )}
    
            {tab === "Eco-guidelines" && (
              <div>
                <FormField label="Small label">
                  <TextInput value={eco.chip} onChange={(v) => patch("ecoGuidelines", { chip: v })} />
                </FormField>
                <FormField label="Heading" hint={ACCENT_HINT}>
                  <TextInput value={eco.title} onChange={(v) => patch("ecoGuidelines", { title: v })} />
                </FormField>
                <FormField label="Intro text">
                  <TextArea value={eco.intro} onChange={(v) => patch("ecoGuidelines", { intro: v })} />
                </FormField>
                <FormField label="Guideline cards" hint="Icon names come from Material Symbols.">
                  <CardListEditor items={eco.cards} onChange={(v) => patch("ecoGuidelines", { cards: v })} />
                </FormField>
              </div>
            )}
    
          </>
        );
      }}
    </ContentEditorShell>
  );
}
