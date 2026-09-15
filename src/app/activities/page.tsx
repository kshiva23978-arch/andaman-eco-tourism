import type { Metadata } from "next";
import { AlternatingFeatureSection, type WatermarkInput } from "@/components/ui/AlternatingFeatureSection";
import { getActivityBySlug } from "@/lib/data/activities";
import { DecorativeLeaf } from "@/components/ui/DecorativeLeaf";
import { RevealText, ScrollReveal } from "@/components/ui/ScrollReveal";
import { ActivitiesHero, type HeroSlide } from "@/components/activities/ActivitiesHero";

export const metadata: Metadata = {
  title: "Activities Guide",
  description:
    "Discover the natural wonders of the Andaman & Nicobar archipelago through responsible exploration and scientific conservation practices.",
};

const HERO_SLIDES: HeroSlide[] = [
  {
    image: "/images/activitiy-slider/scuba.png",
    eyebrow: "Marine · Scientific Diving",
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
];

interface GuideEntry {
  slug: string;
  bg: string;
  reverse: boolean;
  tone: "light" | "dark";
  watermark?: WatermarkInput;
}

const MARINE_ACTIVITIES: GuideEntry[] = [
  {
    slug: "scuba-snorkeling",
    bg: "bg-surface-container-lowest",
    reverse: false,
    tone: "light",
    watermark: [
      { src: "/images/illustrations/scuba-diver.png", position: "bottom-left", size: 200, opacity: 100 },
    ],
  },
  { slug: "sustainable-boating", bg: "bg-surface", reverse: true, tone: "light",
    watermark: [
      { src: "/images/illustrations/sustainable-boat.png", position: "bottom-right", size: 200, opacity: 100 },
    ],
   },
  { slug: "ocean-surfing", bg: "bg-surface-container-low", reverse: false, tone: "light",
    watermark: [
      { src: "/images/illustrations/surfing.png", position: "bottom-left", size: 200, opacity: 100 },
    ],
   },
  { slug: "glass-bottom-boating", bg: "bg-surface", reverse: true, tone: "light",
    watermark: [
      { src: "/images/illustrations/glass-bottom-1.png", position: "bottom-right", size: 200, opacity: 100 },
    ],
    
   },
];

const TERRESTRIAL_ACTIVITIES: GuideEntry[] = [
  { slug: "rainforest-trekking", bg: "bg-surface-container-low", reverse: false, tone: "light",
    watermark: [
      { src: "/images/illustrations/rainforest-walk.png", position: "bottom-left", size: 180, opacity: 100 },
    ],
   },
  { slug: "mangrove-walks", bg: "bg-surface", reverse: true, tone: "light",
    watermark: [
      { src: "/images/illustrations/mangrove.png", position: "bottom-right", size: 200, opacity: 100 },
    ],
    
   },
  { slug: "quiet-water-kayaking", bg: "bg-primary", reverse: false, tone: "dark",
    watermark: [
      { src: "/images/illustrations/kayaking-1.png", position: "bottom-left", size: 300, opacity: 100 },
    ],
   },
  { slug: "avian-observation", bg: "bg-surface", reverse: true, tone: "light",
    watermark: [
      { src: "/images/illustrations/bird.png", position: "top-right", size: 200, opacity: 100 },
    ],
   },
  { slug: "dark-sky-stargazing", bg: "bg-blue-950", reverse: false, tone: "dark",
    watermark: [
      { src: "/images/illustrations/telescope-2.png", position: "bottom-left", size: 200, opacity: 100 },
    ],
   },
];

function GuideSections({ entries }: { entries: GuideEntry[] }) {
  return (
    <>
      {entries.map(({ slug, bg, reverse, tone, watermark }) => {
        const activity = getActivityBySlug(slug);
        if (!activity) return null;
        return (
          <div key={slug} className="relative overflow-hidden">
            <DecorativeLeaf className="top-6 left-4 md:top-64 md:left-9" rotate={-25} size={110} opacity={0.22} />
          <AlternatingFeatureSection
            href={`/activities/${activity.slug}`}
            image={activity.heroImage}
            imageAlt={activity.title}
            icon={activity.icon}
            title={activity.title}
            body={activity.guideBody}
            bullets={activity.guideBullets?.map((text) => ({
              icon: "check_circle",
              text,
            }))}
            callout={activity.guideCallout}
            reverse={reverse}
            bgClassName={bg}
            tone={tone}
            watermark={watermark}
          />
            <DecorativeLeaf className="bottom-6 right-4 md:bottom-86 md:right-9" rotate={-25} size={110} opacity={0.22} />
          </div>
        );
      })}
    </>
  );
}

export default function ActivitiesGuidePage() {
  return (
    <>
      {/* Hero */}
      <ActivitiesHero slides={HERO_SLIDES} />

      {/* Conservation Principles */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <ScrollReveal className="md:col-span-2 bg-surface-container p-8 border border-outline-variant flex flex-col justify-center">
            <span className="text-secondary font-label-md uppercase mb-2 block">
              Core Mandate
            </span>
            <RevealText className="font-headline-lg text-headline-lg text-black tracking-tight mb-4">
              <span className="text-emerald-700">Conservation</span> First
            </RevealText>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              As a protected ecological zone, the Andaman & Nicobar
              Administration prioritizes environmental integrity. Every
              activity detailed in this guide is governed by strict
              environmental laws to ensure the longevity of our unique
              biodiversity. Visitors are expected to adhere to the &lsquo;Leave
              No Trace&rsquo; protocol in all terrestrial and marine
              environments.
            </p>
          </ScrollReveal>
          <ScrollReveal className="bg-secondary text-on-secondary p-8 border border-secondary flex flex-col items-start gap-4" delay={0.2}>
            <span className="material-symbols-outlined text-4xl">
              nature_people
            </span>
            <h3 className="font-headline-md text-headline-md">
              Impact Awareness
            </h3>
            <ul className="space-y-3 font-body-md text-body-md opacity-90">
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-sm pt-1">
                  check_circle
                </span>
                No single-use plastics
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-sm pt-1">
                  check_circle
                </span>
                Minimal noise pollution
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-sm pt-1">
                  check_circle
                </span>
                Respect wildlife distances
              </li>
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider id="marine-activities" label="Marine Activities" />
      <GuideSections entries={MARINE_ACTIVITIES} />

      <SectionDivider label="Terrestrial Activities" />
      <GuideSections entries={TERRESTRIAL_ACTIVITIES} />

      {/* Coastal Management */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24">
        <ScrollReveal className="text-center mb-12">
          <RevealText className="font-headline-lg text-headline-lg text-black tracking-tight">
            Coastal <span className="text-emerald-700">Management</span>
          </RevealText>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto mt-4">
            Beaches like Radhanagar and Elephant Beach are fragile
            ecosystems. Proper coastal conduct ensures these shores remain
            pristine for generations.
          </p>
        </ScrollReveal>
        <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-gutter" stagger={0.15}>
          <CoastalPanel
            title="Zone Regulations"
            color="bg-primary"
            rows={[
              "No camping on beach",
              "Restricted night entry",
              "Permit required for research",
            ]}
          />
          <CoastalPanel
            title="Waste Management"
            color="bg-secondary"
            rows={[
              "Carry back all non-biodegradables",
              "Public bins for organic waste",
              "Zero-litter enforcement",
            ]}
          />
          <CoastalPanel
            title="Safety & Wildlife"
            color="bg-tertiary"
            rows={[
              "Watch for nesting turtles",
              "Swim only in designated areas",
              "Adhere to lifeguard flags",
            ]}
          />
        </ScrollReveal>
      </section>
    </>
  );
}

function SectionDivider({ label, id }: { label: string; id?: string }) {
  return (
    <section
      id={id}
      className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12 scroll-mt-24"
    >
      <div className="border-b border-outline-variant pb-6">
        <RevealText
          as="span"
          className="block font-label-md text-label-md text-secondary uppercase tracking-widest"
          stagger={0.08}
        >
          {label}
        </RevealText>
      </div>
    </section>
  );
}

function CoastalPanel({
  title,
  color,
  rows,
}: {
  title: string;
  color: string;
  rows: string[];
}) {
  return (
    <div className="border border-outline-variant overflow-hidden">
      <div className={`${color} p-4`}>
        <h3 className="font-label-md text-label-md text-white">{title}</h3>
      </div>
      <div>
        {rows.map((row, index) => (
          <div
            key={row}
            className={`p-4 font-body-md text-body-md ${
              index % 2 === 0 ? "bg-surface" : "bg-surface-container-low"
            } ${index < rows.length - 1 ? "border-b border-outline-variant" : ""}`}
          >
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}
