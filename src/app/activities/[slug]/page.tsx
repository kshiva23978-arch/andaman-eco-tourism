import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationGallery } from "@/components/destinations/DestinationGallery";
import { DestinationHero } from "@/components/destinations/DestinationHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { RevealSide } from "@/components/ui/RevealSide";
import { GridReveal } from "@/components/ui/GridReveal";
import { getPublishedActivities, pickBySlugs } from "@/lib/data/activities-db";
import { getPublishedDestinations } from "@/lib/data/destinations-db";
import { getPageContent } from "@/lib/content/page-content-db";
import { withTitle } from "@/lib/content/normalize";

// Rendered per request from the database; the queries are cached in the *-db modules.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = (await getPublishedActivities()).find((a) => a.slug === slug);
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
  const [activities, destinations, page] = await Promise.all([
    getPublishedActivities(),
    getPublishedDestinations(),
    getPageContent("activity-page"),
  ]);
  const activity = activities.find((a) => a.slug === slug);

  if (!activity) {
    notFound();
  }

  const availableAt = pickBySlugs(destinations, activity.destinationSlugs);
  const related = pickBySlugs(activities, activity.relatedActivitySlugs);
  const gallery = activity.galleryImages ?? [activity.heroImage];

  return (
    <div className="editorial">
      {/* Hero */}
      <DestinationHero
        title={activity.title}
        image={activity.heroImage}
        background={activity.heroBackground}
        scrollTargetId="activity-overview"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Activities", href: "/activities" },
          { label: activity.title },
        ]}
      />

      {/* Overview */}
      <section id="activity-overview" className="relative overflow-hidden bg-[var(--paper)] py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
          style={{
            backgroundImage: page.overview.background ? `url('${page.overview.background}')` : undefined,
            backgroundSize: "480px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          }}
        />
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <ScrollReveal as="div" y={28}>
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--sand)] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--forest-mid)]">
                  {page.overview.badge}
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
                    {page.overview.durationLabel}
                  </div>
                  <p className="mt-1 text-[15px] text-[var(--ink)]">{activity.duration}</p>
                </div>
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sand)] text-[var(--forest-mid)]">
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  </span>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lagoon)]">
                    {page.overview.difficultyLabel}
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
                    {page.overview.equipmentTitle}
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
                    {page.overview.permitTitle}
                  </h4>
                  <p className="mb-5 text-[14px] leading-relaxed text-[var(--ink-soft)]">
                    {activity.permitNote}
                  </p>
                  {page.overview.permitButtonLabel && page.overview.permitButtonHref ? (
                    <a
                      href={page.overview.permitButtonHref}
                      {...(/^https?:\/\//i.test(page.overview.permitButtonHref)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="block w-full rounded-full bg-[var(--forest-deep)] px-5 py-3 text-center text-[13.5px] font-semibold text-white transition-colors hover:bg-[var(--forest-mid)]"
                    >
                      {page.overview.permitButtonLabel}
                    </a>
                  ) : null}
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
          <SectionHead kicker={page.guidelines.kicker} tone="dark">
            {withTitle(page.guidelines.title, activity.title)}
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
        <ScrollReveal as="div" y={24}>
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <SectionHead kicker={page.gallery.kicker}>{withTitle(page.gallery.title, activity.title)}</SectionHead>
          </div>
          <DestinationGallery
            images={gallery}
            captions={activity.galleryImages ? activity.galleryTitles : undefined}
            title={activity.title}
          />
        </ScrollReveal>
      </section>

      {/* Available Destinations */}
      {availableAt.length > 0 ? (
        <section className="relative overflow-hidden bg-[var(--sand)] py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-repeat opacity-25"
            style={
              page.destinations.background
                ? { backgroundImage: `url('${page.destinations.background}')`, backgroundSize: "420px" }
                : undefined
            }
          />
          <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <ScrollReveal as="div" className="mb-10 text-center" y={24}>
              <span className="mx-auto mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--forest-mid)]">
                <span className="material-symbols-outlined text-[14px]">map</span>
                {page.destinations.chip}
              </span>
              <h2
                className="mb-3 text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-[var(--ink)]"
                style={{ fontFamily: "var(--font-fraunces), serif" }}
              >
                {withTitle(page.destinations.title, activity.title)}
              </h2>
              <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
                {page.destinations.body}
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
            <SectionHead kicker={page.related.kicker}>{withTitle(page.related.title, activity.title)}</SectionHead>
            <GridReveal
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              columns={{ base: 1, sm: 2, lg: 3 }}
              y={48}
            >
              {related.map((item) => (
                <ActivityCard key={item.slug} activity={item} />
              ))}
            </GridReveal>
          </div>
        </section>
      ) : null}
    </div>
  );
}
