import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationGallery } from "@/components/destinations/DestinationGallery";
import { DestinationHero } from "@/components/destinations/DestinationHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { RevealSide } from "@/components/ui/RevealSide";
import { GridReveal } from "@/components/ui/GridReveal";
import {
  activities,
  getActivitiesBySlugs,
  getActivityBySlug,
} from "@/lib/data/activities";
import { getDestinationsBySlugs } from "@/lib/data/destinations";

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) return {};
  return {
    title: activity.title,
    description: activity.tagline,
  };
}

function SectionHead({
  kicker,
  children,
  tone = "light",
}: {
  kicker: string;
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <div className="mb-8">
      <div
        className={`flex items-center gap-2.5 mb-2.5 font-semibold text-[13px] ${
          isDark ? "text-[var(--lagoon-light)]" : "text-[var(--lagoon)]"
        }`}
      >
        <span className={`h-px w-7 ${isDark ? "bg-[var(--lagoon-light)]" : "bg-[var(--lagoon)]"}`} />
        {kicker}
      </div>
      <h2
        className={`text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.08] font-semibold ${
          isDark ? "text-[var(--sand)]" : "text-[var(--ink)]"
        }`}
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        {children}
      </h2>
    </div>
  );
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const availableAt = getDestinationsBySlugs(activity.destinationSlugs);
  const related = getActivitiesBySlugs(activity.relatedActivitySlugs);

  return (
    <div className="editorial">
      {/* Hero */}
      <DestinationHero
        title={activity.title}
        image={activity.heroImage}
        scrollTargetId="activity-overview"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Activities", href: "/activities" },
          { label: activity.title },
        ]}
      />

      {/* Overview */}
      <section id="activity-overview" className="bg-[var(--paper)] py-16 md:py-20">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <ScrollReveal as="div" y={28}>
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--sand)] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--forest-mid)]">
                  Official Activity Profile
                </span>
                <p className="mb-6 max-w-2xl text-[16px] leading-relaxed text-[var(--ink-soft)]">
                  {activity.tagline}
                </p>
              </ScrollReveal>

              <GridReveal
                className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
                columns={{ base: 1, sm: 2, lg: 2 }}
                y={32}
              >
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sand)] text-[var(--forest-mid)]">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </span>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lagoon)]">
                    Duration
                  </div>
                  <p className="mt-1 text-[15px] text-[var(--ink)]">{activity.duration}</p>
                </div>
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sand)] text-[var(--forest-mid)]">
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  </span>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lagoon)]">
                    Difficulty
                  </div>
                  <p className="mt-1 text-[15px] text-[var(--ink)]">{activity.difficulty}</p>
                </div>
              </GridReveal>

              <ScrollReveal as="div" className="flex flex-col gap-4" y={20}>
                {activity.overview.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                    {paragraph}
                  </p>
                ))}
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <RevealSide as="div" className="flex flex-col gap-5" x={48}>
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6">
                  <h4 className="mb-4 text-[12.5px] font-bold uppercase tracking-[0.08em] text-[var(--forest-mid)]">
                    Equipment Provided
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {activity.equipmentProvided.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[14px] text-[var(--ink)]">
                        <span
                          className="material-symbols-outlined mt-0.5 text-[16px] flex-shrink-0"
                          style={{ color: "var(--lagoon)" }}
                        >
                          check_circle
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-[var(--sand)] p-6">
                  <h4 className="mb-3 text-[12.5px] font-bold uppercase tracking-[0.08em] text-[var(--forest-mid)]">
                    Permit Requirements
                  </h4>
                  <p className="mb-5 text-[14px] leading-relaxed text-[var(--ink-soft)]">
                    {activity.permitNote}
                  </p>
                  <button
                    type="button"
                    className="w-full rounded-full bg-[var(--forest-deep)] px-5 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-[var(--forest-mid)]"
                  >
                    Apply for Permit
                  </button>
                </div>
              </RevealSide>
            </div>
          </div>
        </div>
      </section>

      {/* Mandatory Eco-Guidelines */}
      <section className="relative overflow-hidden bg-[var(--forest-deep)] py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(250,249,244,0.14)_1px,transparent_1px)] [background-size:14px_14px]"
        />
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="Non-negotiable" tone="dark">
            Mandatory Eco-Guidelines
          </SectionHead>
          <RevealSide as="div" className="grid grid-cols-1 gap-4 md:grid-cols-2" x={48}>
            {activity.guidelines.map((guideline) => (
              <div
                key={guideline.title}
                className="rounded-2xl border border-white/[0.12] bg-white/[0.06] p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[var(--lagoon-light)]">
                    <span className="material-symbols-outlined text-[18px]">{guideline.icon}</span>
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--sand)]">
                    {guideline.title}
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-white/85">{guideline.body}</p>
              </div>
            ))}
          </RevealSide>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-[var(--paper)] py-16">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="Gallery">{activity.title} in frame</SectionHead>
          <DestinationGallery
            images={activity.galleryImages ?? [activity.heroImage]}
            title={activity.title}
          />
        </div>
      </section>

      {/* Available Destinations */}
      {availableAt.length > 0 ? (
        <section className="bg-[var(--sand)] py-20">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <ScrollReveal as="div" className="mb-10 text-center" y={24}>
              <span className="mx-auto mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--forest-mid)]">
                <span className="material-symbols-outlined text-[14px]">map</span>
                Where to go
              </span>
              <h2
                className="mb-3 text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-[var(--ink)]"
                style={{ fontFamily: "var(--font-fraunces), serif" }}
              >
                Available at these Destinations
              </h2>
              <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
                Documented sites where this activity is practiced under forest-department guidelines.
              </p>
            </ScrollReveal>
            <GridReveal
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
              columns={{ base: 1, sm: 2, lg: 3 }}
              y={48}
            >
              {availableAt.map((destination) => (
                <DestinationCard key={destination.slug} destination={destination} />
              ))}
            </GridReveal>
          </div>
        </section>
      ) : null}

      {/* Related Activities */}
      {related.length > 0 ? (
        <section className="bg-[var(--paper)] py-20">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <SectionHead kicker="Keep exploring">Explore More Activities</SectionHead>
            <RevealSide as="div" className="grid grid-cols-1 gap-4 md:grid-cols-3" x={48}>
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/activities/${item.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-[var(--line)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--lagoon)]/40 hover:shadow-[0_20px_40px_-16px_rgba(15,43,30,0.25)]"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={item.heroImage}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <h5
                      className="text-[16px] font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--forest-mid)]"
                      style={{ fontFamily: "var(--font-fraunces), serif" }}
                    >
                      {item.title}
                    </h5>
                    <p className="text-[13px] text-[var(--ink-soft)]">{item.difficulty}</p>
                  </div>
                </Link>
              ))}
            </RevealSide>
          </div>
        </section>
      ) : null}
    </div>
  );
}
