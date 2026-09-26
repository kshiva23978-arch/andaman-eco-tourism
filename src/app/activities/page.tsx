import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedActivities } from "@/lib/data/activities-db";
import { getPageContent } from "@/lib/content/page-content-db";
import { groupAnchor, type CoastalPanel as CoastalPanelContent } from "@/lib/content/activities";
import type { Activity } from "@/lib/types";
import { RevealText, ScrollReveal } from "@/components/ui/ScrollReveal";
import { RevealSide } from "@/components/ui/RevealSide";
import { GridReveal } from "@/components/ui/GridReveal";
import { ActivitiesHero } from "@/components/activities/ActivitiesHero";
import { ActivityGuideSection } from "@/components/activities/ActivityGuideSection";

export const metadata: Metadata = {
  title: "Activities Guide",
  description:
    "Discover the natural wonders of the Andaman & Nicobar archipelago through responsible exploration and conservation practices.",
};

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

/** One activity block per entry, alternating image side and light/dark tone. */
function GuideSections({ activities }: { activities: Activity[] }) {
  return (
    <>
      {activities.map((activity, index) => (
        <ActivityGuideSection
          key={activity.slug}
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
          reverse={index % 2 === 1}
          tone={index % 2 === 1 ? "dark" : "light"}
        />
      ))}
    </>
  );
}

// Rendered per request from the database; the queries are cached.
export const dynamic = "force-dynamic";

export default async function ActivitiesGuidePage() {
  const [published, content] = await Promise.all([getPublishedActivities(), getPageContent("activities")]);
  const bySlug = new Map(published.map((a) => [a.slug, a]));
  const { hero, principles, coastal, cta } = content;

  // Admin-defined groups, then any published activity not in a group, so none go missing.
  const grouped = new Set(content.groups.flatMap((g) => g.slugs));
  const leftovers = published.filter((a) => !grouped.has(a.slug));
  const groups = [
    ...content.groups.map((g) => ({
      ...g,
      activities: g.slugs.map((s) => bySlug.get(s)).filter((a): a is Activity => Boolean(a)),
    })),
    ...(leftovers.length ? [{ ...content.otherGroup, slugs: [], activities: leftovers }] : []),
  ]
    .filter((g) => g.activities.length > 0)
    .map((g, i) => ({ ...g, anchor: groupAnchor(g.navLabel || g.title, i) }));

  return (
    <div className="editorial">
      {/* Hero */}
      {hero.slides.length > 0 ? <ActivitiesHero slides={hero.slides} /> : null}

      {/* Conservation Principles */}
      <section
        className="relative overflow-hidden bg-[var(--paper)] bg-repeat py-20"
        style={
          principles.background
            ? { backgroundImage: `url('${principles.background}')`, backgroundSize: "480px" }
            : undefined
        }
      >
        {/* Fade the pattern in from the hero's wave-divider color so the seam disappears */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--paper)] to-transparent"
        />
        <div className="relative mx-auto grid max-w-container-max grid-cols-1 gap-6 px-margin-mobile md:px-margin-desktop md:grid-cols-3">
          <RevealSide
            as="div"
            className="md:col-span-2 flex flex-col justify-center rounded-[24px] border border-[var(--line)] bg-white p-8 shadow-[0_20px_50px_-24px_rgba(15,43,30,0.25)] md:p-10"
            x={56}
          >
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--sand)] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--forest-mid)]">
              <span className="material-symbols-outlined text-[14px]">eco</span>
              {principles.chip}
            </span>
            <RevealText
              as="h2"
              className="mb-4 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight text-[var(--ink)] font-semibold"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {principles.title}
            </RevealText>
            <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">{principles.body}</p>
          </RevealSide>
          <RevealSide
            as="div"
            className="flex flex-col justify-center gap-4 rounded-[24px] p-8"
            x={56}
            style={{ background: "linear-gradient(160deg, var(--lagoon), var(--forest-mid))" }}
          >
            <span className="material-symbols-outlined text-4xl text-white">{principles.awarenessIcon}</span>
            <h3 className="text-[20px] font-semibold text-white" style={{ fontFamily: "var(--font-fraunces), serif" }}>
              {principles.awarenessTitle}
            </h3>
            <ul className="flex flex-col gap-2.5 text-[14px] text-white/90">
              {principles.awarenessItems.map((item) => (
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
      {groups.length > 1 ? (
        <div className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-container-max items-center gap-3 overflow-x-auto px-margin-mobile py-3 no-scrollbar md:px-margin-desktop">
            {groups.map((group) => (
              <a
                key={group.anchor}
                href={`#${group.anchor}`}
                className="flex-shrink-0 rounded-full bg-[var(--sand)] px-4 py-2 text-[13px] font-semibold text-[var(--forest-mid)] transition-colors hover:bg-[var(--lagoon)] hover:text-white"
              >
                {group.navLabel || group.title}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {groups.map((group) => (
        <div key={group.anchor}>
          <section id={group.anchor} className="bg-[var(--paper)] pt-16 scroll-mt-16">
            <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
              <SectionHead kicker={group.kicker}>{group.title}</SectionHead>
            </div>
          </section>
          <GuideSections activities={group.activities} />
        </div>
      ))}

      {/* Coastal Management */}
      <section className="bg-[var(--paper)] py-24">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <ScrollReveal as="div" className="mb-14 text-center" y={24}>
            <span className="mx-auto mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--sand)] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--forest-mid)]">
              <span className="material-symbols-outlined text-[14px]">beach_access</span>
              {coastal.chip}
            </span>
            <h2
              className="mb-3 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight font-semibold"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {coastal.title}
            </h2>
            <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)]">{coastal.body}</p>
          </ScrollReveal>
          <GridReveal
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
            columns={{ base: 1, sm: 1, lg: 3 }}
            y={48}
          >
            {coastal.panels.map((panel, i) => (
              <CoastalPanel key={`${panel.title}-${i}`} {...panel} />
            ))}
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
            {cta.title}
          </h2>
          <p className="mb-7 text-[15px] text-white/75">{cta.body}</p>
          {cta.buttonLabel && cta.buttonHref ? (
            <Link
              href={cta.buttonHref}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-7 py-3.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[var(--forest-deep)]"
            >
              {cta.buttonLabel}
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </Link>
          ) : null}
        </ScrollReveal>
      </section>
    </div>
  );
}

function CoastalPanel({ icon, title, rows }: CoastalPanelContent) {
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
