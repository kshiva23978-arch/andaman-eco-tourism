"use client";

import {
  ContentEditorShell,
  SimpleFields,
  TITLE_HINT,
  type SimpleField,
} from "@/components/admin/ContentEditorShell";
import {
  DESTINATION_PAGE_DEFAULTS,
  type DestinationPageContent,
} from "@/lib/content/destinations";

type Section = keyof DestinationPageContent;
type Field = SimpleField;

/** Tabs in page order: which section each edits, and its fields. */
const TAB_FIELDS = {
  "Quick facts": {
    section: "facts",
    note: "The fact cards under the banner. The values come from each destination.",
    fields: [
      { key: "bestTimeLabel", label: "“Best time to visit” card label" },
      { key: "timingLabel", label: "“Timing” card label" },
      { key: "feeLabel", label: "“Entry fee” card label" },
      { key: "permitsLabel", label: "“Permits” card label" },
      { key: "rangeLabel", label: "“Range & division” card label" },
      { key: "hospitalLabel", label: "“Nearest hospital” card label" },
      { key: "background", label: "Background image", kind: "media", hint: "Shown faintly behind the cards." },
    ],
  },
  Location: {
    section: "location",
    note: "The map section. Its heading is the destination's name.",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "directionsLabel", label: "Directions button" },
      { key: "largerMapLabel", label: "Larger map button" },
      { key: "background", label: "Background pattern", kind: "media" },
    ],
  },
  Gallery: {
    section: "gallery",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: TITLE_HINT },
    ],
  },
  "Getting here": {
    section: "reach",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: TITLE_HINT },
      { key: "roadLabel", label: "“By road” step title" },
      { key: "shipLabel", label: "“By ship” step title" },
      { key: "background", label: "Background texture", kind: "media" },
    ],
  },
  "Fees & permits": {
    section: "fees",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: TITLE_HINT },
      { key: "feesLabel", label: "Fees box title" },
      { key: "permitsLabel", label: "Permits box title" },
    ],
  },
  "What to see": {
    section: "whatToSee",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: TITLE_HINT },
      { key: "background", label: "Background image", kind: "media", hint: "Darkened with a green tint." },
    ],
  },
  Activities: {
    section: "activities",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: TITLE_HINT },
    ],
  },
  Amenities: {
    section: "amenities",
    fields: [
      { key: "kicker", label: "Amenities — small label" },
      { key: "title", label: "Amenities — heading", hint: TITLE_HINT },
      { key: "stayKicker", label: "Accommodation — small label" },
      { key: "stayTitle", label: "Accommodation — heading" },
      { key: "background", label: "Background illustration", kind: "media" },
    ],
  },
  Conservation: {
    section: "conservation",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: TITLE_HINT },
    ],
  },
  "Nearby places": {
    section: "nearby",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: TITLE_HINT },
      { key: "badge", label: "Card badge" },
      { key: "background", label: "Background image", kind: "media" },
      {
        key: "fallbackImages",
        label: "Photos for nearby places without their own page",
        kind: "mediaList",
        hint: "Used in turn for nearby places that aren't destinations on this site.",
      },
    ],
  },
  Safety: {
    section: "safety",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: TITLE_HINT },
      { key: "emergencyLabel", label: "Emergency box title", hint: "e.g. Emergency: 112" },
    ],
  },
} satisfies Record<string, { section: Section; note?: string; fields: Field[] }>;

type Tab = keyof typeof TAB_FIELDS;
const TABS = Object.keys(TAB_FIELDS) as Tab[];
const TAB_SECTION = Object.fromEntries(TABS.map((t) => [t, TAB_FIELDS[t].section])) as Record<Tab, Section>;

export function DestinationPageEditor({
  initialContent,
  lastSaved,
  previewHref,
}: {
  initialContent: DestinationPageContent;
  lastSaved: string | null;
  previewHref: string;
}) {
  return (
    <ContentEditorShell
      pageKey="destination-page"
      title="Destination page layout"
      intro="Headings, labels and backgrounds shared by every single-destination page."
      viewHref={previewHref}
      tabs={TABS}
      tabSection={TAB_SECTION}
      defaults={DESTINATION_PAGE_DEFAULTS}
      initialContent={initialContent}
      lastSaved={lastSaved}
    >
      {(tab, content, patch) => {
        const config: { section: Section; note?: string; fields: Field[] } = TAB_FIELDS[tab];
        return (
          <div>
            {config.note && <p className="mb-4 text-sm text-on-surface-variant">{config.note}</p>}
            <SimpleFields
              fields={config.fields}
              values={content[config.section]}
              onChange={(key, value) =>
                patch(config.section, { [key]: value } as Partial<DestinationPageContent[Section]>)
              }
            />
          </div>
        );
      }}
    </ContentEditorShell>
  );
}
