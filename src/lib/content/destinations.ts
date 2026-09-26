/**
 * Editable content for the destinations directory ("destinations") and for the shared
 * layout of every single-destination page ("destination-page"). Defaults are the
 * site's original copy. Shared by the admin editors (client) and public pages (server).
 */

import { fromDefaults } from "./normalize";

export type BannerCard = { image: string; label: string };

export type DestinationsListContent = {
  banner: {
    eyebrow: string;
    titleLine1: string;
    /** Second line is shown in the accent color. */
    titleLine2: string;
    body: string;
    /** `{count}` = number of published destinations. */
    destinationsLabel: string;
    /** `{count}` = number of regions. */
    regionsLabel: string;
    ctaLabel: string;
    backgroundImage: string;
    /** The three floating photo cards (their positions are part of the design). */
    cards: BannerCard[];
  };
  /** Region names, used by the filter, the region count and the destination editor. */
  regions: string[];
};

export const DESTINATIONS_LIST_DEFAULTS: DestinationsListContent = {
  banner: {
    eyebrow: "Andaman & Nicobar Islands",
    titleLine1: "Destinations",
    titleLine2: "Directory",
    body: "Every officially documented beach, reef, sanctuary and forest trail across the archipelago — explore them all, region by region.",
    destinationsLabel: "{count} destinations",
    regionsLabel: "{count} regions",
    ctaLabel: "Start exploring",
    backgroundImage: "/images/bg/beach.jpg",
    cards: [
      { image: "/images/destinations/radhanagar.png", label: "Radhanagar Beach" },
      { image: "/images/destinations/turtle.jpg", label: "Cuthbert Bay" },
      { image: "/images/destinations/coral-fish.jpg", label: "Jolly Buoy" },
    ],
  },
  regions: [
    "South Andaman",
    "Diglipur",
    "Mayabunder",
    "Middle Andaman",
    "Baratang",
    "Little Andaman",
    "Swaraj Dweep",
  ],
};

export function normalizeDestinationsList(input: unknown): DestinationsListContent {
  const out = fromDefaults(DESTINATIONS_LIST_DEFAULTS, input);
  // Exactly three cards: the layout has three fixed slots.
  const cards = DESTINATIONS_LIST_DEFAULTS.banner.cards.map((d, i) => out.banner.cards[i] ?? d);
  const regions = [...new Set(out.regions.map((r) => r.slice(0, 60)))];
  return { ...out, banner: { ...out.banner, cards }, regions };
}

/** Section heading: small label + main heading. `{title}` = the destination's name. */
export type SectionHeading = { kicker: string; title: string };

export type DestinationPageContent = {
  facts: {
    background: string;
    bestTimeLabel: string;
    timingLabel: string;
    feeLabel: string;
    permitsLabel: string;
    rangeLabel: string;
    hospitalLabel: string;
  };
  location: {
    kicker: string;
    background: string;
    directionsLabel: string;
    largerMapLabel: string;
  };
  gallery: SectionHeading;
  reach: SectionHeading & { roadLabel: string; shipLabel: string; background: string };
  fees: SectionHeading & { feesLabel: string; permitsLabel: string };
  whatToSee: SectionHeading & { background: string };
  activities: SectionHeading;
  amenities: SectionHeading & { stayKicker: string; stayTitle: string; background: string };
  conservation: SectionHeading;
  nearby: SectionHeading & {
    badge: string;
    background: string;
    /** Photos for nearby places that aren't destinations themselves (used in turn). */
    fallbackImages: string[];
  };
  safety: SectionHeading & { emergencyLabel: string };
};

export const DESTINATION_PAGE_DEFAULTS: DestinationPageContent = {
  facts: {
    background: "/images/bg/destination-head-bg.png",
    bestTimeLabel: "Best Time to Visit",
    timingLabel: "Timing",
    feeLabel: "Entry Fee",
    permitsLabel: "Permits",
    rangeLabel: "Range & Division",
    hospitalLabel: "Nearest Hospital",
  },
  location: {
    kicker: "Discover",
    background: "/images/bg/footprint-bg.jpg",
    directionsLabel: "Get Directions",
    largerMapLabel: "View Larger Map",
  },
  gallery: { kicker: "Gallery", title: "{title} in frame" },
  reach: {
    kicker: "Getting here",
    title: "How to reach {title}",
    roadLabel: "By Road",
    shipLabel: "By Ship / Boat",
    background: "/images/bg/bg-texture.jpg",
  },
  fees: {
    kicker: "Practical",
    title: "Entry fees & permits",
    feesLabel: "Fees",
    permitsLabel: "Permits",
  },
  whatToSee: {
    kicker: "Highlights",
    title: "What to see",
    background: "/images/bg/12953515_Scene-12.jpg",
  },
  activities: { kicker: "On site", title: "Activities" },
  amenities: {
    kicker: "On-site amenities",
    title: "What's there — and what isn't",
    stayKicker: "Accommodation",
    stayTitle: "Where to stay",
    background: "/images/bg/bg-deer.png",
  },
  conservation: { kicker: "Tread lightly", title: "Conservation & eco-practices" },
  nearby: {
    kicker: "While you're here",
    title: "Nearby places",
    badge: "Nearby",
    background: "/images/bg/bg-nearby.jpg",
    fallbackImages: [
      "/images/bg/forest-bg.jpg",
      "/images/bg/view-bg.jpg",
      "/images/bg/beach.jpg",
      "/images/bg/starfish-sea.jpg",
      "/images/bg/canvas-b.jpg",
    ],
  },
  safety: {
    kicker: "Before you go",
    title: "Safety & travel tips",
    emergencyLabel: "Emergency: 112",
  },
};

export function normalizeDestinationPage(input: unknown): DestinationPageContent {
  const out = fromDefaults(DESTINATION_PAGE_DEFAULTS, input);
  if (out.nearby.fallbackImages.length === 0) {
    out.nearby.fallbackImages = DESTINATION_PAGE_DEFAULTS.nearby.fallbackImages;
  }
  return out;
}
