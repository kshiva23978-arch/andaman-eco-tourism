/**
 * Editable content for the activities guide ("activities") and for the shared layout of
 * every single-activity page ("activity-page"). Defaults are the site's original copy.
 * Shared by the admin editors (client) and public pages (server).
 */

import { fromDefaults } from "./normalize";

export type GuideHeroSlide = {
  image: string;
  eyebrow: string;
  title: string;
  /** Second part of the title, shown in the accent color. */
  accent: string;
  description: string;
  href: string;
  cta: string;
};

export type ActivityGroup = {
  /** Label of this group's button in the sticky jump-to bar. */
  navLabel: string;
  kicker: string;
  title: string;
  slugs: string[];
};

export type CoastalPanel = { icon: string; title: string; rows: string[] };

export type ActivitiesGuideContent = {
  hero: { slides: GuideHeroSlide[] };
  principles: {
    chip: string;
    title: string;
    body: string;
    background: string;
    awarenessIcon: string;
    awarenessTitle: string;
    awarenessItems: string[];
  };
  groups: ActivityGroup[];
  /** Published activities in no group are listed last under this heading. */
  otherGroup: { navLabel: string; kicker: string; title: string };
  coastal: { chip: string; title: string; body: string; panels: CoastalPanel[] };
  cta: { title: string; body: string; buttonLabel: string; buttonHref: string };
};

export const ACTIVITIES_GUIDE_DEFAULTS: ActivitiesGuideContent = {
  hero: {
    slides: [
      {
        image: "/images/activitiy-slider/scuba.png",
        eyebrow: "Marine · Diving",
        title: "Dive Beneath the",
        accent: "Coral Gardens",
        description:
          "Descend with certified marine naturalists into reefs monitored for health — a strict no-touch policy keeps every dive a conservation act.",
        href: "/activities/scuba-snorkeling",
        cta: "Scuba & Snorkeling",
      },
      {
        image: "/images/activitiy-slider/trekking.png",
        eyebrow: "Terrestrial · Rainforest",
        title: "Walk the Ancient",
        accent: "Rainforest Trails",
        description:
          "Follow marked trails through primary evergreen forest with local guides who read the canopy, the tracks and the silence.",
        href: "/activities/rainforest-trekking",
        cta: "Rainforest Trekking",
      },
      {
        image: "/images/activitiy-slider/wildlife.png",
        eyebrow: "Terrestrial · Wildlife",
        title: "Meet the Islands'",
        accent: "Endemic Wildlife",
        description:
          "Dawn and dusk windows, no playback calls, respectful distances — observe birds and forest life the way researchers do.",
        href: "/activities/avian-observation",
        cta: "Avian Observation",
      },
      {
        image: "/images/activitiy-slider/omount-manipur.png",
        eyebrow: "Terrestrial · Summit Trek",
        title: "Climb Toward",
        accent: "Mount Manipur",
        description:
          "A guided ascent through cloud forest to the archipelago's high ridgelines, with panoramic views over the Andaman Sea.",
        href: "/destinations/mount-manipur-national-park",
        cta: "Explore the Park",
      },
      {
        image: "/images/activitiy-slider/light-house.png",
        eyebrow: "Marine · Coastal Voyages",
        title: "Sail the Quiet",
        accent: "Island Coastlines",
        description:
          "Low-wake, low-noise boat transits past lighthouses and mangrove channels — powered by local operators who know these waters.",
        href: "/activities/sustainable-boating",
        cta: "Sustainable Boating",
      },
    ],
  },
  principles: {
    chip: "Core Mandate",
    title: "Conservation First",
    body: "As a protected ecological zone, the Andaman & Nicobar Administration prioritizes environmental integrity. Every activity detailed in this guide is governed by strict environmental laws to ensure the longevity of our unique biodiversity. Visitors are expected to adhere to the ‘Leave No Trace’ protocol in all terrestrial and marine environments.",
    background: "/images/bg/bg-patter-act.jpg",
    awarenessIcon: "nature_people",
    awarenessTitle: "Impact Awareness",
    awarenessItems: ["No single-use plastics", "Minimal noise pollution", "Respect wildlife distances"],
  },
  groups: [
    {
      navLabel: "Marine Activities",
      kicker: "In the water",
      title: "Marine Activities",
      slugs: ["scuba-snorkeling", "sustainable-boating", "ocean-surfing", "glass-bottom-boating"],
    },
    {
      navLabel: "Terrestrial Activities",
      kicker: "On land",
      title: "Terrestrial Activities",
      slugs: [
        "rainforest-trekking",
        "mangrove-walks",
        "quiet-water-kayaking",
        "avian-observation",
        "dark-sky-stargazing",
      ],
    },
  ],
  otherGroup: { navLabel: "More Activities", kicker: "Also on offer", title: "More Activities" },
  coastal: {
    chip: "Shorelines",
    title: "Coastal Management",
    body: "Beaches like Radhanagar and Elephant Beach are fragile ecosystems. Proper coastal conduct ensures these shores remain pristine for generations.",
    panels: [
      {
        icon: "gavel",
        title: "Zone Regulations",
        rows: ["No camping on beach", "Restricted night entry", "Permit required for research"],
      },
      {
        icon: "recycling",
        title: "Waste Management",
        rows: ["Carry back all non-biodegradables", "Public bins for organic waste", "Zero-litter enforcement"],
      },
      {
        icon: "shield_with_heart",
        title: "Safety & Wildlife",
        rows: ["Watch for nesting turtles", "Swim only in designated areas", "Adhere to lifeguard flags"],
      },
    ],
  },
  cta: {
    title: "Ready to explore responsibly?",
    body: "Browse destinations paired with these activities and plan a trip that leaves the islands as you found them.",
    buttonLabel: "Browse Destinations",
    buttonHref: "/destinations",
  },
};

const ICON = /^[a-z0-9_]+$/;

export function normalizeActivitiesGuide(input: unknown): ActivitiesGuideContent {
  const out = fromDefaults(ACTIVITIES_GUIDE_DEFAULTS, input);
  const d = ACTIVITIES_GUIDE_DEFAULTS;
  return {
    ...out,
    // A slide needs an image and a link to be usable.
    hero: { slides: out.hero.slides.filter((s) => s.image && s.href && s.title) },
    principles: {
      ...out.principles,
      awarenessIcon: ICON.test(out.principles.awarenessIcon) ? out.principles.awarenessIcon : d.principles.awarenessIcon,
    },
    groups: out.groups.filter((g) => g.title).slice(0, 8),
    coastal: {
      ...out.coastal,
      panels: out.coastal.panels
        .filter((p) => p.title)
        .map((p) => ({ ...p, icon: ICON.test(p.icon) ? p.icon : "eco" })),
    },
  };
}

/** "Marine Activities" -> "marine-activities", for the jump-to anchors. */
export function groupAnchor(label: string, index: number): string {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || `group-${index + 1}`;
}

/* ------------------------------------------------------ single activity page */

export type ActivityPageContent = {
  overview: {
    badge: string;
    background: string;
    durationLabel: string;
    difficultyLabel: string;
    equipmentTitle: string;
    permitTitle: string;
    /** The permit button is hidden when its link is empty. */
    permitButtonLabel: string;
    permitButtonHref: string;
  };
  guidelines: { kicker: string; title: string };
  gallery: { kicker: string; title: string };
  destinations: { chip: string; title: string; body: string; background: string };
  related: { kicker: string; title: string };
};

export const ACTIVITY_PAGE_DEFAULTS: ActivityPageContent = {
  overview: {
    badge: "Official Activity Profile",
    background: "/images/bg/bg-patter-act.jpg",
    durationLabel: "Duration",
    difficultyLabel: "Difficulty",
    equipmentTitle: "Equipment Provided",
    permitTitle: "Permit Requirements",
    permitButtonLabel: "Apply for Permit",
    permitButtonHref: "",
  },
  guidelines: { kicker: "Non-negotiable", title: "Mandatory Eco-Guidelines" },
  gallery: { kicker: "Gallery", title: "{title} in frame" },
  destinations: {
    chip: "Where to go",
    title: "Available at these Destinations",
    body: "Documented sites where this activity is practiced under forest-department guidelines.",
    background: "/images/bg/leaf-bg.jpg",
  },
  related: { kicker: "Keep exploring", title: "Explore More Activities" },
};

export function normalizeActivityPage(input: unknown): ActivityPageContent {
  return fromDefaults(ACTIVITY_PAGE_DEFAULTS, input);
}
