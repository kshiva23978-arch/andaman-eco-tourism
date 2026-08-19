import type { Metadata } from "next";
import Image from "next/image";
import { AlternatingFeatureSection } from "@/components/ui/AlternatingFeatureSection";
import { getActivityBySlug } from "@/lib/data/activities";

export const metadata: Metadata = {
  title: "Activities Guide",
  description:
    "Discover the natural wonders of the Andaman & Nicobar archipelago through responsible exploration and scientific conservation practices.",
};

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA_HC49PveLb3FAk7v_Si0NlK9rEoU7L76rB7GtakvKBqzw_5Q7jLWKBt33y1-TV2_kjU8LeMsxVUMvTOeAX85v1aOhW5tpU5KU-PN3tuJ2CPAlQIYdcmczPmbWNMB0QlucDKYMSrM4e6DHW-0FW7LCHl0etkIUJVhX1dvLlcfZL8lWZQ8LnrAQK7bquwFQfouImGnzs4QzGrM2B_t0kcSluwbjw6Qsnd36WlV6pT3GgWzeD2qTHLg8B6QJRtn1_5oSQ4sFTKz7xsmp";

interface GuideEntry {
  slug: string;
  bg: string;
  reverse: boolean;
  tone: "light" | "dark";
}

const MARINE_ACTIVITIES: GuideEntry[] = [
  { slug: "scuba-snorkeling", bg: "bg-surface-container-lowest", reverse: false, tone: "light" },
  { slug: "sustainable-boating", bg: "bg-surface", reverse: true, tone: "light" },
  { slug: "ocean-surfing", bg: "bg-surface-container-low", reverse: false, tone: "light" },
  { slug: "glass-bottom-boating", bg: "bg-surface", reverse: true, tone: "light" },
];

const TERRESTRIAL_ACTIVITIES: GuideEntry[] = [
  { slug: "rainforest-trekking", bg: "bg-surface-container-low", reverse: false, tone: "light" },
  { slug: "mangrove-walks", bg: "bg-surface", reverse: true, tone: "light" },
  { slug: "quiet-water-kayaking", bg: "bg-primary", reverse: false, tone: "dark" },
  { slug: "avian-observation", bg: "bg-surface", reverse: true, tone: "light" },
  { slug: "dark-sky-stargazing", bg: "bg-tertiary", reverse: false, tone: "dark" },
];

function GuideSections({ entries }: { entries: GuideEntry[] }) {
  return (
    <>
      {entries.map(({ slug, bg, reverse, tone }) => {
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
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 mb-8">
        <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
          <Image
            src={HERO_IMAGE}
            alt="Andaman Islands"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-8 md:p-12">
            <h1 className="font-headline-xl text-3xl md:text-headline-xl text-white mb-4">
              Activities Guide
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-2xl">
              Discover the natural wonders of the archipelago through
              responsible exploration and scientific conservation practices.
            </p>
          </div>
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

      <SectionDivider label="Marine Activities" />
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

function SectionDivider({ label }: { label: string }) {
  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
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
