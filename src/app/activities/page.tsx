import type { Metadata } from "next";
import Link from "next/link";
import { getActivityBySlug } from "@/lib/data/activities";
import { RevealText, ScrollReveal } from "@/components/ui/ScrollReveal";
import { RevealSide } from "@/components/ui/RevealSide";
import { GridReveal } from "@/components/ui/GridReveal";
import { ActivitiesHero, type HeroSlide } from "@/components/activities/ActivitiesHero";
import { ActivityGuideSection } from "@/components/activities/ActivityGuideSection";

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
  reverse: boolean;
  tone: "light" | "dark";
}

const MARINE_ACTIVITIES: GuideEntry[] = [
  { slug: "scuba-snorkeling", reverse: false, tone: "light" },
  { slug: "sustainable-boating", reverse: true, tone: "dark" },
  { slug: "ocean-surfing", reverse: false, tone: "light" },
  { slug: "glass-bottom-boating", reverse: true, tone: "dark" },
];

const TERRESTRIAL_ACTIVITIES: GuideEntry[] = [
  { slug: "rainforest-trekking", reverse: false, tone: "light" },
  { slug: "mangrove-walks", reverse: true, tone: "dark" },
  { slug: "quiet-water-kayaking", reverse: false, tone: "light" },
  { slug: "avian-observation", reverse: true, tone: "dark" },
  { slug: "dark-sky-stargazing", reverse: false, tone: "light" },
];

function SectionHead({
  kicker,
  children,
  tone = "light",
}: {
  kicker: string;
  children: string;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <div className="mb-2">
      <div
        className={`flex items-center gap-2.5 mb-2.5 font-semibold text-[13px] ${
          isDark ? "text-[var(--lagoon-light)]" : "text-[var(--lagoon)]"
        }`}
      >
        <span className={`h-px w-7 ${isDark ? "bg-[var(--lagoon-light)]" : "bg-[var(--lagoon)]"}`} />
        {kicker}
      </div>
      <h2
        className="text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.08] font-semibold"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        {children}
      </h2>
    </div>
  );
}

function GuideSections({ entries }: { entries: GuideEntry[] }) {
  return (
    <>
      {entries.map(({ slug, reverse, tone }) => {
        const activity = getActivityBySlug(slug);
        if (!activity) return null;
        return (
          <ActivityGuideSection
            key={slug}
            href={`/activities/${activity.slug}`}
            image={activity.heroImage}
            imageAlt={activity.title}
            icon={activity.icon}
            title={activity.title}
            duration={activity.duration}
            difficulty={activity.difficulty}
            body={activity.guideBody}
            bullets={activity.guideBullets}
            callout={activity.guideCallout}
            reverse={reverse}
            tone={tone}
          />
        );
      })}
    </>
  );
}

export default function ActivitiesGuidePage() {
  return (
    <div className="editorial">
      {/* Hero */}
      <ActivitiesHero slides={HERO_SLIDES} />

      {/* Conservation Principles */}
      <section className="relative overflow-hidden bg-[var(--forest-deep)] py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(250,249,244,0.14)_1px,transparent_1px)] [background-size:14px_14px]"
        />
        <div className="relative mx-auto grid max-w-container-max grid-cols-1 gap-6 px-margin-mobile md:px-margin-desktop md:grid-cols-3">
          <RevealSide
            as="div"
            className="md:col-span-2 flex flex-col justify-center rounded-[24px] bg-white/[0.06] border border-white/[0.12] p-8 md:p-10"
            x={56}
          >
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--lagoon-light)]">
              <span className="material-symbols-outlined text-[14px]">eco</span>
              Core Mandate
            </span>
            <RevealText
              as="h2"
              className="mb-4 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight text-[var(--sand)] font-semibold"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Conservation First
            </RevealText>
            <p className="text-[15px] leading-relaxed text-white/90">
              As a protected ecological zone, the Andaman &amp; Nicobar
              Administration prioritizes environmental integrity. Every
              activity detailed in this guide is governed by strict
              environmental laws to ensure the longevity of our unique
              biodiversity. Visitors are expected to adhere to the &lsquo;Leave
              No Trace&rsquo; protocol in all terrestrial and marine
              environments.
            </p>
          </RevealSide>
          <RevealSide
            as="div"
            className="flex flex-col justify-center gap-4 rounded-[24px] p-8"
            x={56}
            style={{ background: "linear-gradient(160deg, var(--lagoon), var(--forest-mid))" }}
          >
            <span className="material-symbols-outlined text-4xl text-white">
              nature_people
            </span>
            <h3 className="text-[20px] font-semibold text-white" style={{ fontFamily: "var(--font-fraunces), serif" }}>
              Impact Awareness
            </h3>
            <ul className="flex flex-col gap-2.5 text-[14px] text-white/90">
              {["No single-use plastics", "Minimal noise pollution", "Respect wildlife distances"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] pt-0.5 flex-shrink-0">
                    check_circle
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </RevealSide>
        </div>
      </section>

      {/* Jump-to nav */}
      <div className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-container-max items-center gap-3 overflow-x-auto px-margin-mobile py-3 no-scrollbar md:px-margin-desktop">
          <a
            href="#marine-activities"
            className="flex-shrink-0 rounded-full bg-[var(--sand)] px-4 py-2 text-[13px] font-semibold text-[var(--forest-mid)] transition-colors hover:bg-[var(--lagoon)] hover:text-white"
          >
            Marine Activities
          </a>
          <a
            href="#terrestrial-activities"
            className="flex-shrink-0 rounded-full bg-[var(--sand)] px-4 py-2 text-[13px] font-semibold text-[var(--forest-mid)] transition-colors hover:bg-[var(--lagoon)] hover:text-white"
          >
            Terrestrial Activities
          </a>
        </div>
      </div>

      <section id="marine-activities" className="bg-[var(--paper)] pt-16 scroll-mt-16">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="In the water">Marine Activities</SectionHead>
        </div>
      </section>
      <GuideSections entries={MARINE_ACTIVITIES} />

      <section id="terrestrial-activities" className="bg-[var(--paper)] pt-16 scroll-mt-16">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="On land">Terrestrial Activities</SectionHead>
        </div>
      </section>
      <GuideSections entries={TERRESTRIAL_ACTIVITIES} />

      {/* Coastal Management */}
      <section className="bg-[var(--paper)] py-24">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <ScrollReveal as="div" className="mb-14 text-center" y={24}>
            <span className="mx-auto mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--sand)] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--forest-mid)]">
              <span className="material-symbols-outlined text-[14px]">beach_access</span>
              Shorelines
            </span>
            <h2
              className="mb-3 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight font-semibold"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Coastal Management
            </h2>
            <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
              Beaches like Radhanagar and Elephant Beach are fragile
              ecosystems. Proper coastal conduct ensures these shores remain
              pristine for generations.
            </p>
          </ScrollReveal>
          <GridReveal
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
            columns={{ base: 1, sm: 1, lg: 3 }}
            y={48}
          >
            <CoastalPanel
              icon="gavel"
              title="Zone Regulations"
              rows={[
                "No camping on beach",
                "Restricted night entry",
                "Permit required for research",
              ]}
            />
            <CoastalPanel
              icon="recycling"
              title="Waste Management"
              rows={[
                "Carry back all non-biodegradables",
                "Public bins for organic waste",
                "Zero-litter enforcement",
              ]}
            />
            <CoastalPanel
              icon="shield_with_heart"
              title="Safety & Wildlife"
              rows={[
                "Watch for nesting turtles",
                "Swim only in designated areas",
                "Adhere to lifeguard flags",
              ]}
            />
          </GridReveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-[var(--forest-deep)] py-20 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(250,249,244,0.14)_1px,transparent_1px)] [background-size:14px_14px]"
        />
        <ScrollReveal as="div" className="relative mx-auto max-w-2xl px-margin-mobile md:px-margin-desktop" y={28}>
          <h2
            className="mb-4 text-[clamp(1.75rem,3.4vw,2.25rem)] leading-tight text-[var(--sand)] font-semibold"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Ready to explore responsibly?
          </h2>
          <p className="mb-7 text-[15px] text-white/75">
            Browse destinations paired with these activities and plan a trip that leaves the islands as you found them.
          </p>
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-7 py-3.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[var(--forest-deep)]"
          >
            Browse Destinations
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}

function CoastalPanel({
  icon,
  title,
  rows,
}: {
  icon: string;
  title: string;
  rows: string[];
}) {
  return (
    <div className="group rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--lagoon)]/40 hover:shadow-[0_20px_40px_-16px_rgba(15,43,30,0.25)]">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--sand)] text-[var(--forest-mid)] transition-colors duration-300 group-hover:bg-[var(--forest-mid)] group-hover:text-[var(--sand)]">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </span>
      <h3
        className="mb-4 text-[18px] font-semibold text-[var(--ink)]"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {rows.map((row) => (
          <li key={row} className="flex items-start gap-2 text-[14px] leading-snug text-[var(--ink-soft)]">
            <span className="material-symbols-outlined text-[15px] pt-0.5 flex-shrink-0" style={{ color: "var(--lagoon)" }}>
              check
            </span>
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}
