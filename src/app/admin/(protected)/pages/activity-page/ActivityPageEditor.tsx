"use client";

import {
  ContentEditorShell,
  SimpleFields,
  type SimpleField,
} from "@/components/admin/ContentEditorShell";
import { ACTIVITY_PAGE_DEFAULTS, type ActivityPageContent } from "@/lib/content/activities";

type Section = keyof ActivityPageContent;

const NAME_HINT = "{title} is replaced with each activity's name.";

/** Tabs in page order: which section each edits, and its fields. */
const TAB_FIELDS = {
  Overview: {
    section: "overview",
    note: "The intro and sidebar under the banner. The values come from each activity.",
    fields: [
      { key: "badge", label: "Badge above the tagline" },
      { key: "durationLabel", label: "“Duration” card label" },
      { key: "difficultyLabel", label: "“Difficulty” card label" },
      { key: "equipmentTitle", label: "Equipment box title" },
      { key: "permitTitle", label: "Permit box title" },
      { key: "permitButtonLabel", label: "Permit button text" },
      {
        key: "permitButtonHref",
        label: "Permit button link",
        kind: "link",
        hint: "Where the button goes, e.g. the online permit portal. Leave empty to hide the button.",
      },
      { key: "background", label: "Background pattern", kind: "media" },
    ],
  },
  Guidelines: {
    section: "guidelines",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: NAME_HINT },
    ],
  },
  Gallery: {
    section: "gallery",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: NAME_HINT },
    ],
  },
  "Available at": {
    section: "destinations",
    note: "The destination cards; which destinations appear is set on each activity.",
    fields: [
      { key: "chip", label: "Small label" },
      { key: "title", label: "Heading", hint: NAME_HINT },
      { key: "body", label: "Text", kind: "textarea" },
      { key: "background", label: "Background pattern", kind: "media" },
    ],
  },
  "More activities": {
    section: "related",
    note: "The related-activity cards; which ones appear is set on each activity.",
    fields: [
      { key: "kicker", label: "Small label" },
      { key: "title", label: "Heading", hint: NAME_HINT },
    ],
  },
} satisfies Record<string, { section: Section; note?: string; fields: SimpleField[] }>;

type Tab = keyof typeof TAB_FIELDS;
const TABS = Object.keys(TAB_FIELDS) as Tab[];
const TAB_SECTION = Object.fromEntries(TABS.map((t) => [t, TAB_FIELDS[t].section])) as Record<Tab, Section>;

export function ActivityPageEditor({
  initialContent,
  lastSaved,
  previewHref,
}: {
  initialContent: ActivityPageContent;
  lastSaved: string | null;
  previewHref: string;
}) {
  return (
    <ContentEditorShell
      pageKey="activity-page"
      title="Activity page layout"
      intro="Headings, labels, the permit button and backgrounds shared by every single-activity page."
      viewHref={previewHref}
      tabs={TABS}
      tabSection={TAB_SECTION}
      defaults={ACTIVITY_PAGE_DEFAULTS}
      initialContent={initialContent}
      lastSaved={lastSaved}
    >
      {(tab, content, patch) => {
        const config: { section: Section; note?: string; fields: SimpleField[] } = TAB_FIELDS[tab];
        return (
          <div>
            {config.note && <p className="mb-4 text-sm text-on-surface-variant">{config.note}</p>}
            <SimpleFields
              fields={config.fields}
              values={content[config.section]}
              onChange={(key, value) =>
                patch(config.section, { [key]: value } as Partial<ActivityPageContent[Section]>)
              }
            />
          </div>
        );
      }}
    </ContentEditorShell>
  );
}
