import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { destinations, getDestinationBySlug } from "@/lib/data/destinations";
import { findNearbyDestination } from "@/lib/format";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationGallery } from "@/components/destinations/DestinationGallery";
import { DestinationHero } from "@/components/destinations/DestinationHero";
import { DestinationMapSection } from "@/components/destinations/DestinationMapSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { RevealSide } from "@/components/ui/RevealSide";
import { GridReveal } from "@/components/ui/GridReveal";

// Used for "nearby place" mentions that aren't in the destinations dataset
// (so there's no real photo for them) — cycled per card for visual variety.
const NEARBY_FALLBACK_IMAGES = [
  "/images/bg/forest-bg.jpg",
  "/images/bg/view-bg.jpg",
  "/images/bg/beach.jpg",
  "/images/bg/starfish-sea.jpg",
  "/images/bg/canvas-b.jpg",
];

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) return {};
  return {
    title: destination.title,
    description: destination.overview,
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
    <div className="mb-10">
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

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const nearby = destination.nearbyPlaces.map((text) => ({
    text,
    match: findNearbyDestination(text, destination.slug),
  }));

  return (
    <div className="editorial">
      {/* Hero */}
      <DestinationHero
        title={destination.title}
        image={destination.image}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Destinations", href: "/destinations" },
          { label: destination.region, href: "/destinations" },
          { label: destination.title },
        ]}
      />

      {/* Quick Facts */}
      <section id="destination-overview" className="bg-[var(--paper)] pt-14 pb-6">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <GridReveal
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            columns={{ base: 1, sm: 2, lg: 3 }}
            y={64}
            duration={0.9}
            each={0.1}
            start="top 95%"
          >
            {[
              { label: "Best Time to Visit", value: destination.bestTime, icon: "calendar_month" },
              { label: "Timing", value: destination.timing, icon: "schedule" },
              { label: "Entry Fee", value: destination.fees, icon: "payments" },
              { label: "Permits", value: destination.permits, icon: "badge" },
              { label: "Range & Division", value: destination.rangeDivision || "—", icon: "forest" },
            ].map((fact) => (
              <div
                key={fact.label}
                className="group rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--lagoon)]/40 hover:shadow-[0_20px_40px_-16px_rgba(15,43,30,0.25)]"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--sand)] text-[var(--forest-mid)] transition-colors duration-300 group-hover:bg-[var(--forest-mid)] group-hover:text-[var(--sand)]">
                  <span className="material-symbols-outlined text-[20px]">{fact.icon}</span>
                </span>
                <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--lagoon)]">
                  {fact.label}
                </div>
                <p className="text-[15px] leading-snug whitespace-pre-line text-[var(--ink)]">{fact.value}</p>
              </div>
            ))}
            <div className="group rounded-2xl border border-[var(--coral)]/25 bg-[var(--sand)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-16px_rgba(232,115,74,0.3)]">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--coral)] transition-colors duration-300 group-hover:bg-[var(--coral)] group-hover:text-white">
                <span className="material-symbols-outlined text-[20px]">emergency</span>
              </span>
              <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--coral)]">
                Nearest Hospital
              </div>
              <p className="text-[15px] leading-snug text-[var(--ink)]">{destination.hospital}</p>
            </div>
          </GridReveal>
        </div>
      </section>

      {/* Location */}
      <DestinationMapSection title={destination.title} overview={destination.overview} />

      {/* Gallery */}
      <section className="bg-[var(--paper)]">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
          <SectionHead kicker="Gallery">{destination.title} in frame</SectionHead>
          <DestinationGallery
            images={destination.galleryImages ?? [destination.image]}
            title={destination.title}
          />
        </div>
      </section>

      {/* How To Get There */}
      <section className="bg-[var(--forest-deep)] text-[var(--sand)] py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="Getting here" tone="dark">
            How to reach {destination.title}
          </SectionHead>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <RevealSide as="div" className="lg:col-span-8 flex flex-col" x={56}>
              <div className="flex gap-6 py-6 border-b border-white/[0.12]">
                <div className="flex-shrink-0 w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-[var(--lagoon-light)] text-[15px]" style={{ fontFamily: "var(--font-fraunces), serif" }}>
                  1
                </div>
                <div>
                  <h4 className="text-[17px] mb-1.5 text-[var(--sand)]" style={{ fontFamily: "var(--font-fraunces), serif" }}>
                    By Road
                  </h4>
                  <p className="text-[14.5px] text-white/[0.78] leading-relaxed text-justify">
                    {destination.accessibility.road}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 py-6">
                <div className="flex-shrink-0 w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-[var(--lagoon-light)] text-[15px]" style={{ fontFamily: "var(--font-fraunces), serif" }}>
                  2
                </div>
                <div>
                  <h4 className="text-[17px] mb-1.5 text-[var(--sand)]" style={{ fontFamily: "var(--font-fraunces), serif" }}>
                    By Ship / Boat
                  </h4>
                  <p className="text-[14.5px] text-white/[0.78] leading-relaxed text-justify">
                    {destination.accessibility.ship}
                  </p>
                </div>
              </div>
            </RevealSide>
            <div className="lg:col-span-4">
              <div className="bg-white/[0.06] border border-white/[0.16] rounded-[10px] p-8">
                <div className="flex gap-2.5 items-start mb-4">
                  <span className="material-symbols-outlined text-[18px] text-[var(--lagoon-light)] mt-0.5">
                    location_on
                  </span>
                  <div>
                    <h4 className="text-[19px] mb-1 text-[var(--sand)]" style={{ fontFamily: "var(--font-fraunces), serif" }}>
                      {destination.title}
                    </h4>
                    <div className="text-[13.5px] text-white/[0.68]">
                      {destination.subtitle} · {destination.rangeDivision}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry Fees & Permits */}
      <section className="bg-[var(--paper)] py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="Practical">Entry fees &amp; permits</SectionHead>
          <RevealSide as="div" className="grid grid-cols-1 md:grid-cols-2 gap-5" x={56}>
            <div className="bg-[var(--sand)] rounded-[10px] p-7">
              <h4 className="text-[12.5px] uppercase tracking-[0.06em] text-[var(--forest-mid)] font-bold mb-3">
                Fees
              </h4>
              <p className="text-[14.5px] text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">
                {destination.fees}
              </p>
            </div>
            <div className="bg-[var(--sand)] rounded-[10px] p-7">
              <h4 className="text-[12.5px] uppercase tracking-[0.06em] text-[var(--forest-mid)] font-bold mb-3">
                Permits
              </h4>
              <p className="text-[14.5px] text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">
                {destination.permits}
              </p>
            </div>
          </RevealSide>
        </div>
      </section>

      {/* What To See */}
      <section
        className="py-20 text-[var(--sand)]"
        style={{ background: "linear-gradient(160deg, var(--forest-deep), #163e2b)" }}
      >
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="Highlights" tone="dark">
            What to see
          </SectionHead>
          <RevealSide as="div" className="flex flex-wrap gap-3" x={36}>
            {destination.whatToSee.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2.5 bg-white/[0.08] border border-white/[0.22] px-5 py-3.5 rounded-full text-[14.5px] transition-colors hover:bg-white/[0.16] hover:border-white/40"
              >
                <span className="material-symbols-outlined text-[15px] text-[var(--lagoon-light)]">eco</span>
                {item}
              </span>
            ))}
          </RevealSide>
        </div>
      </section>

      {/* Activities */}
      <section className="bg-[var(--paper)] py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="On site">Activities</SectionHead>
          <RevealSide as="div" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" x={48}>
            {destination.activities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3.5 px-5 py-4 border border-[var(--line)] rounded-[10px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--lagoon)]"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--sand)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[15px] text-[var(--forest-mid)]">check</span>
                </span>
                <span className="text-[14.5px] font-medium text-[var(--ink)]">{item}</span>
              </div>
            ))}
          </RevealSide>
        </div>
      </section>

      {/* Amenities & Accommodation */}
      <section className="bg-[var(--forest-deep)] text-[var(--sand)] py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-14">
          <div>
            <SectionHead kicker="On-site amenities" tone="dark">
              What&apos;s there — and what isn&apos;t
            </SectionHead>
            <RevealSide as="div" className="flex flex-col gap-3" x={48}>
              {destination.facility.map((item) => (
                <div key={item} className="flex gap-3 items-start px-5 py-4 bg-white/[0.06] rounded-xl">
                  <span className="material-symbols-outlined text-[18px] text-[var(--lagoon-light)] mt-0.5 flex-shrink-0">
                    check_circle
                  </span>
                  <span className="text-[14.5px] text-white/90 leading-relaxed">{item}</span>
                </div>
              ))}
            </RevealSide>
          </div>
          <div>
            <SectionHead kicker="Accommodation" tone="dark">
              Where to stay
            </SectionHead>
            <RevealSide as="div" x={48}>
              <div className="bg-white/[0.08] border border-white/[0.18] rounded-[10px] p-7">
                <p className="text-[14.5px] text-white/85 leading-relaxed whitespace-pre-line">
                  {destination.accommodation}
                </p>
              </div>
            </RevealSide>
          </div>
        </div>
      </section>

      {/* Conservation & Eco-Practices */}
      <section className="bg-[var(--paper)] py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="Tread lightly">Conservation &amp; eco-practices</SectionHead>
          <ScrollReveal as="div" y={16}>
            <p className="max-w-[64ch] text-[15.5px] text-[var(--ink-soft)] leading-relaxed mb-11 text-justify">
              {destination.conservationNotes}
            </p>
          </ScrollReveal>
          <RevealSide as="div" className="grid grid-cols-1 sm:grid-cols-2 gap-4" x={48}>
            {destination.ecoGuidelines.map((item) => (
              <div
                key={item}
                className="flex gap-3.5 items-start px-6 py-5 bg-[var(--sand)] rounded-[10px]"
              >
                <span className="material-symbols-outlined text-[18px] text-[var(--forest-mid)] mt-0.5">
                  eco
                </span>
                <span className="text-[14.5px] text-[var(--ink)] leading-snug">{item}</span>
              </div>
            ))}
          </RevealSide>
        </div>
      </section>

      {/* Nearby Places */}
      {nearby.length > 0 ? (
        <section
          className="py-20 text-[var(--sand)]"
          style={{ background: "linear-gradient(160deg, var(--forest-deep), #0a2118)" }}
        >
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <SectionHead kicker="While you're here" tone="dark">
              Nearby places
            </SectionHead>
            <RevealSide
              as="div"
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar"
              x={56}
            >
              {nearby.map(({ text, match }, index) => {
                const wrapperClass = "w-[68vw] max-w-[280px] shrink-0 snap-center sm:w-[280px]";

                if (match) {
                  return (
                    <div key={text} className={wrapperClass}>
                      <DestinationCard destination={match} />
                    </div>
                  );
                }

                const label = text.split(/[:(]/)[0].trim();
                const fallbackImage =
                  NEARBY_FALLBACK_IMAGES[index % NEARBY_FALLBACK_IMAGES.length];

                return (
                  <div key={text} className={wrapperClass}>
                    <div className="group relative flex flex-col overflow-hidden rounded-3xl shadow-lg">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={fallbackImage}
                          alt={label}
                          fill
                          className="object-cover"
                          sizes="280px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/[0.35] to-black/10" />
                        <div className="absolute inset-0 flex flex-col justify-end p-4">
                          <span className="mb-3 w-fit rounded-full glass-panel-soft px-4 py-1.5 font-label-md text-[11px] uppercase tracking-widest text-white">
                            Nearby
                          </span>
                          <h3 className="mb-3 font-headline-md text-lg leading-snug text-white drop-shadow-sm line-clamp-2">
                            {label}
                          </h3>
                          <div className="-mx-4 -mb-4 rounded-b-3xl glass-panel px-4 py-3">
                            <p className="font-label-md text-[12px] text-white/80">{text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </RevealSide>
          </div>
        </section>
      ) : null}

      {/* Safety & Travel Tips */}
      <section className="bg-[var(--paper)] py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHead kicker="Before you go">Safety &amp; travel tips</SectionHead>
          <RevealSide as="div" className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4" x={56}>
            <div
              className="rounded-[10px] p-8 border row-span-2"
              style={{
                background: "linear-gradient(135deg, #fdeee7, #fbe1d4)",
                borderColor: "rgba(232,115,74,0.35)",
              }}
            >
              <div className="flex items-center gap-2.5 text-[var(--coral)] font-bold text-[16px] mb-3">
                <span className="material-symbols-outlined text-[20px]">emergency</span>
                Emergency: 112
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: "#6b3822" }}>
                {destination.hospital}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destination.safetyTips.map((tip) => (
                <div
                  key={tip}
                  className="flex gap-3 items-start px-5 py-5 border border-[var(--line)] rounded-xl"
                >
                  <span className="material-symbols-outlined text-[18px] text-[var(--lagoon)] mt-0.5 flex-shrink-0">
                    verified_user
                  </span>
                  <span className="text-[14px] text-[var(--ink-soft)] leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </RevealSide>
        </div>
      </section>
    </div>
  );
}
