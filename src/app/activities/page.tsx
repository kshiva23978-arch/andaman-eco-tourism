import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlternatingFeatureSection, type WatermarkInput } from "@/components/ui/AlternatingFeatureSection";
import { getActivityBySlug } from "@/lib/data/activities";

export const metadata: Metadata = {
  title: "Activities Guide",
  description:
    "Discover the natural wonders of the Andaman & Nicobar archipelago through responsible exploration and scientific conservation practices.",
};

const HERO_IMAGE =
  "/images/bg/activity-bg.png";

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
      { src: "/images/illustrations/kayaking.png", position: "bottom-left", size: 300, opacity: 100 },
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
          <AlternatingFeatureSection
            key={slug}
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
        );
      })}
    </>
  );
}

export default function ActivitiesGuidePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[450px] md:h-[520px] w-full overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Andaman Islands"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-blue/50 to-transparent" />

        <div className="relative z-10 h-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-white text-[20px]">
              eco
            </span>
            <span className="font-label-md text-label-md text-white uppercase tracking-widest">
              Experiences That Connect You With Nature
            </span>
          </div>

          <h1 className="font-headline-xl text-3xl md:text-headline-xl text-white mb-4">
           Activities Guide

          </h1>

          <div className="h-1 w-16 bg-secondary rounded-full mb-6" />

          <p className="font-body-lg text-white/90 max-w-xl text-lg md:text-xl mb-8">
           Discover the natural wonders of the archipelago through responsible exploration and scientific conservation practices.
          </p>

          <Link
            href="#marine-activities"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-8 py-4 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90"
          >
            Explore Activities
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Wave divider */}
        <div className="absolute inset-x-0 bottom-0 z-10 leading-none">
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="h-[50px] w-full md:h-[90px]"
          >
            <path
              className="fill-surface"
              d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,100 L0,100 Z"
            />
          </svg>
        </div>
      </section>

      {/* Conservation Principles */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="md:col-span-2 bg-surface-container p-8 border border-outline-variant flex flex-col justify-center">
            <span className="text-secondary font-label-md uppercase mb-2 block">
              Core Mandate
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
              Conservation First
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              As a protected ecological zone, the Andaman & Nicobar
              Administration prioritizes environmental integrity. Every
              activity detailed in this guide is governed by strict
              environmental laws to ensure the longevity of our unique
              biodiversity. Visitors are expected to adhere to the &lsquo;Leave
              No Trace&rsquo; protocol in all terrestrial and marine
              environments.
            </p>
          </div>
          <div className="bg-secondary text-on-secondary p-8 border border-secondary flex flex-col items-start gap-4">
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
          </div>
        </div>
      </section>

      <SectionDivider id="marine-activities" label="Marine Activities" />
      <GuideSections entries={MARINE_ACTIVITIES} />

      <SectionDivider label="Terrestrial Activities" />
      <GuideSections entries={TERRESTRIAL_ACTIVITIES} />

      {/* Coastal Management */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Coastal Management
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto mt-4">
            Beaches like Radhanagar and Elephant Beach are fragile
            ecosystems. Proper coastal conduct ensures these shores remain
            pristine for generations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
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
        </div>
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
        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
          {label}
        </span>
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
