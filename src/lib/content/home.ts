/**
 * Editable home-page content: its shape, the defaults (the site's original copy, so an
 * unedited page looks exactly as before), and `normalizeHome`, which turns whatever is
 * stored or submitted into a complete, safe HomeContent. Shared by the admin editor
 * (client) and the public page (server), so it must not import server-only modules.
 */

import { icon, list, media, obj, slugs, text, url } from "./normalize";

export { withCount } from "./normalize";

export type Link = { label: string; href: string };
export type Heading = {
  /** Small pill label above the heading. */
  chip: string;
  /** Heading text; wrap words in *stars* to color them. */
  title: string;
};

export type HeroSlide = { name: string; video: string };
export type FeatureBlock = {
  icon: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  bullets: string[];
  /** Faint illustration behind the block; empty for none. */
  watermark: string;
};
export type GuidelineCard = { icon: string; title: string; body: string };

export type HomeContent = {
  hero: {
    /** Plays once in the full-screen intro before the hero appears. */
    introVideo: string;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    primaryCta: Link;
    secondaryCta: Link;
    /** Background videos the hero cycles through; the names are the chapter labels. */
    slides: HeroSlide[];
  };
  map: {
    title: string;
    body: string;
    /** `{count}` is replaced with the number of published destinations. */
    linkLabel: string;
    backgroundImage: string;
  };
  featuredDestinations: Heading & {
    linkLabel: string;
    slugs: string[];
  };
  sustainability: Heading & {
    blocks: FeatureBlock[];
  };
  featuredActivities: Heading & {
    linkLabel: string;
    backgroundImage: string;
    slugs: string[];
  };
  ecoGuidelines: Heading & {
    intro: string;
    cards: GuidelineCard[];
  };
};

export const HOME_DEFAULTS: HomeContent = {
  hero: {
    introVideo: "/videos/bg-banner.mp4",
    eyebrow: "Andaman & Nicobar Islands",
    titleLine1: "Discover Andaman",
    titleLine2: "& Nicobar Islands",
    subtitle:
      "A journey into pristine nature, vibrant culture, and sustainable adventures — guided by the people who protect these islands.",
    primaryCta: { label: "Explore Destinations", href: "/destinations" },
    secondaryCta: { label: "Plan Your Journey", href: "/activities" },
    slides: [
      { name: "Coral Gardens", video: "/videos/fish.mp4" },
      { name: "Sea Turtles", video: "/videos/bg-banner.mp4" },
      { name: "Shorebirds", video: "/videos/bird-fish.mp4" },
      { name: "Golden Hour", video: "/videos/sun-set.mp4" },
    ],
  },
  map: {
    title: "Discover the Islands",
    body: "Over 570 islands stretch across the Bay of Bengal — only a handful are open to visitors. Pick a marker to explore its beaches, reefs, forests and the communities that care for them.",
    linkLabel: "Browse all {count} destinations",
    backgroundImage: "/images/bg/water-bg-texture.jpg",
  },
  featuredDestinations: {
    chip: "Handpicked Escapes",
    title: "Explore Featured *Destinations*",
    linkLabel: "Browse All {count} Destinations",
    slugs: [
      "radhanagar-beach",
      "jolly-buoy-island",
      "limestone-caves-baratang",
      "cuthbert-bay-beach-wildlife-sanctuary",
      "saddle-peak-national-park",
      "elephanta-beach",
    ],
  },
  sustainability: {
    chip: "Our Commitment",
    title: "Why Travel *Sustainably* With Us",
    blocks: [
      {
        icon: "waves",
        title: "Marine Conservation First",
        body: "Every dive and snorkeling excursion follows a strict no-touch coral policy, led by trained marine naturalists who monitor reef health across dive sites.",
        image: "/images/illustrations/img-3.jpeg",
        imageAlt: "Coral reef and marine life in Andaman waters",
        bullets: [
          "No-touch coral policy enforced at every dive site",
          "Certified marine biologists lead reef excursions",
          "Plastic-free zones across all beaches",
        ],
        watermark: "/images/illustrations/glass-bottom.png",
      },
      {
        icon: "diversity_3",
        title: "Community-Powered Journeys",
        body: "Homestays, boat operators and trekking guides are drawn from local island communities — keeping tourism revenue where it belongs, and indigenous reserves strictly off-limits.",
        image: "/images/illustrations/img-9.jpeg",
        imageAlt: "Local guide leading travelers through the islands",
        bullets: [
          "Fair-wage local guides and boat operators",
          "Tribal reserves respected and never entered",
          "Homestay networks across island communities",
        ],
        watermark: "/images/illustrations/mangrove.png",
      },
    ],
  },
  featuredActivities: {
    chip: "{count} Curated Experiences",
    title: "Featured *Eco-Activities*",
    linkLabel: "Explore Activities Guide",
    backgroundImage: "/images/bg/cellular-jail.jpg",
    slugs: ["scuba-snorkeling", "rainforest-trekking", "mangrove-walks", "dark-sky-stargazing"],
  },
  ecoGuidelines: {
    chip: "Responsible Travel",
    title: "*Eco*-Guidelines",
    intro:
      "Traveling to a sensitive ecological zone requires a commitment to responsibility. Please adhere to these official guidelines to help preserve our natural heritage.",
    cards: [
      {
        icon: "delete_sweep",
        title: "Waste Management",
        body: "Carry back all non-biodegradable waste. Single-use plastics are strictly prohibited across the islands.",
      },
      {
        icon: "set_meal",
        title: "Marine Ethics",
        body: "Do not touch or stand on corals. Maintain a respectful distance from all marine life while diving or snorkeling.",
      },
      {
        icon: "photo_camera",
        title: "Wildlife Disturbance",
        body: "Feeding or disturbing wildlife is a punishable offense. Observe silence in forest zones.",
      },
      {
        icon: "history_edu",
        title: "Cultural Sensitivity",
        body: "Respect the privacy of local communities. Photography of indigenous tribes is strictly illegal.",
      },
    ],
  },
};

/* ------------------------------------------------------------ normalizing */

function link(v: unknown, fallback: Link): Link {
  const o = obj(v);
  return { label: text(o.label, fallback.label, 80), href: url(o.href, fallback.href) || fallback.href };
}

/** Turns stored/submitted data into a complete HomeContent, filling gaps from defaults. */
export function normalizeHome(input: unknown): HomeContent {
  const d = HOME_DEFAULTS;
  const i = obj(input);

  const hero = obj(i.hero);
  const map = obj(i.map);
  const fd = obj(i.featuredDestinations);
  const sus = obj(i.sustainability);
  const fa = obj(i.featuredActivities);
  const eco = obj(i.ecoGuidelines);

  return {
    hero: {
      introVideo: media(hero.introVideo, d.hero.introVideo),
      eyebrow: text(hero.eyebrow, d.hero.eyebrow, 80),
      titleLine1: text(hero.titleLine1, d.hero.titleLine1, 40),
      titleLine2: text(hero.titleLine2, d.hero.titleLine2, 40),
      subtitle: text(hero.subtitle, d.hero.subtitle, 400),
      primaryCta: link(hero.primaryCta, d.hero.primaryCta),
      secondaryCta: link(hero.secondaryCta, d.hero.secondaryCta),
      slides: list(hero.slides, d.hero.slides, (s) => {
        const o = obj(s);
        return { name: text(o.name, "", 40), video: media(o.video, "") };
      }, 8).filter((s) => s.video),
    },
    map: {
      title: text(map.title, d.map.title, 120),
      body: text(map.body, d.map.body, 600),
      linkLabel: text(map.linkLabel, d.map.linkLabel, 80),
      backgroundImage: media(map.backgroundImage, d.map.backgroundImage),
    },
    featuredDestinations: {
      chip: text(fd.chip, d.featuredDestinations.chip, 60),
      title: text(fd.title, d.featuredDestinations.title, 120),
      linkLabel: text(fd.linkLabel, d.featuredDestinations.linkLabel, 80),
      slugs: slugs(fd.slugs, d.featuredDestinations.slugs),
    },
    sustainability: {
      chip: text(sus.chip, d.sustainability.chip, 60),
      title: text(sus.title, d.sustainability.title, 120),
      blocks: list(sus.blocks, d.sustainability.blocks, (b): FeatureBlock => {
        const o = obj(b);
        return {
          icon: icon(o.icon, "eco"),
          title: text(o.title, "", 120),
          body: text(o.body, "", 800),
          image: media(o.image, ""),
          imageAlt: text(o.imageAlt, "", 160),
          bullets: list(o.bullets, [], (x) => text(x, "", 200), 10).filter(Boolean),
          watermark: media(o.watermark, ""),
        };
      }, 6).filter((b) => b.title && b.image),
    },
    featuredActivities: {
      chip: text(fa.chip, d.featuredActivities.chip, 60),
      title: text(fa.title, d.featuredActivities.title, 120),
      linkLabel: text(fa.linkLabel, d.featuredActivities.linkLabel, 80),
      backgroundImage: media(fa.backgroundImage, d.featuredActivities.backgroundImage),
      slugs: slugs(fa.slugs, d.featuredActivities.slugs),
    },
    ecoGuidelines: {
      chip: text(eco.chip, d.ecoGuidelines.chip, 60),
      title: text(eco.title, d.ecoGuidelines.title, 120),
      intro: text(eco.intro, d.ecoGuidelines.intro, 600),
      cards: list(eco.cards, d.ecoGuidelines.cards, (c) => {
        const o = obj(c);
        return { icon: icon(o.icon, "eco"), title: text(o.title, "", 120), body: text(o.body, "", 400) };
      }, 12).filter((c) => c.title),
    },
  };
}
