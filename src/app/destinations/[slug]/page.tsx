import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { InfoStat } from "@/components/ui/InfoStat";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { destinations, getDestinationBySlug } from "@/lib/data/destinations";
import { findNearbyDestination } from "@/lib/format";
import { DestinationGallery } from "@/components/destinations/DestinationGallery";
import { DestinationHero } from "@/components/destinations/DestinationHero";
import { DestinationMapSection } from "@/components/destinations/DestinationMapSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GridReveal } from "@/components/ui/GridReveal";

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

function BulletGrid({
  items,
  icon,
  columns = 2,
}: {
  items: string[];
  icon: string;
  columns?: 1 | 2;
}) {
  return (
    <ScrollReveal
      as="ul"
      className={`grid grid-cols-1 ${columns === 2 ? "md:grid-cols-2" : ""
        } gap-4`}
      y={20}
      stagger={0.08}
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 bg-white cursor-pointer p-4 border border-outline-variant rounded-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <span className="material-symbols-outlined text-secondary bg-secondary-container/30 p-1.5 rounded-full h-fit text-[20px]">
            {icon}
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant text-justify">
            {item}
          </p>
        </li>
      ))}
    </ScrollReveal>
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
    <>
      {/* Hero */}
      <DestinationHero
        title={destination.title}
        region={destination.region}
        overview={destination.overview}
        image={destination.image}
      />

      <section className="bg-surface-container-high ">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 ">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Destinations", href: "/destinations" },
            { label: destination.region, href: "/destinations" },
            { label: destination.title },
          ]}
        />
        </div>
      </section>

      {/* Key Info Grid */}
      <section id="destination-overview" className="relative overflow-hidden py-8">
        <div
          className="pointer-events-none absolute inset-0 z-0  bg-fixed bg-cover bg-center opacity-[0.06]"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <GridReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter" columns={{ base: 1, sm: 2, lg: 3 }}>
          <InfoStat label="Best Time to Visit" value={destination.bestTime} color="secondary" />
          <InfoStat label="Timing" value={destination.timing} />
          <InfoStat label="Entry Fee" value={destination.fees} />
          <InfoStat label="Permits" value={destination.permits} />
          <InfoStat label="Range & Division" value={destination.rangeDivision || "—"} />
          <InfoStat label="Nearest Hospital" value={destination.hospital} color="error" />
        </GridReveal>
        </div>
      </section>
  {/* Location */}
      <DestinationMapSection title={destination.title} overview={destination.overview} />

      <section className="bg-white ">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
                  <SectionHeading icon="album">{destination.title} Gallery</SectionHeading>

        <DestinationGallery
          images={destination.galleryImages ?? [destination.image]}
          title={destination.title}
        />
        </div>
      </section>

      {/* How To Get There */}
      <section className="bg-surface-container-low py-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHeading icon="directions_boat">How To Get There</SectionHeading>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <ScrollReveal as="div" className="lg:col-span-8 space-y-8" y={24} stagger={0.15}>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-headline-md mb-2">By Road</h4>
                  <p className="font-body-md text-on-surface-variant text-justify">
                    {destination.accessibility.road}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-headline-md mb-2">By Ship / Boat</h4>
                  <p className="font-body-md text-on-surface-variant text-justify">
                    {destination.accessibility.ship}
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="lg:col-span-4">
              <ScrollReveal
                as="div"
                className="bg-surface-container-lowest p-6 border border-outline-variant rounded-lg"
                y={30}
                start="top 90%"
              >
                <span className="material-symbols-outlined text-primary text-[32px] block mb-4">
                  location_on
                </span>
                <h4 className="font-headline-md mb-1">{destination.title}</h4>
                <p className="text-on-surface-variant font-caption text-caption">
                  {destination.subtitle}
                </p>
                <p className="text-on-surface-variant font-caption text-caption mt-1">
                  {destination.rangeDivision}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

    
      {/* Entry Fees & Permits */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <SectionHeading icon="payments">Entry Fees &amp; Permits</SectionHeading>
        <ScrollReveal as="div" className="grid grid-cols-1 md:grid-cols-2 gap-gutter" y={24} stagger={0.12}>
          <div className="p-6 border border-outline-variant rounded-lg bg-surface-container-lowest transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
            <h4 className="font-label-md text-primary uppercase mb-3 tracking-widest">
              Fees
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line text-justify">
              {destination.fees}
            </p>
          </div>
          <div className="p-6 border border-outline-variant rounded-lg bg-surface-container-lowest transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
            <h4 className="font-label-md text-primary uppercase mb-3 tracking-widest">
              Permits
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line text-justify">
              {destination.permits}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* What To See */}
      <section className="relative overflow-hidden py-16">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/bg/forest2-bg.jpg')]  bg-cover bg-center opacity-[0.5]"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHeading icon="visibility" >What To See</SectionHeading>
          <ScrollReveal as="div" className="flex flex-wrap gap-4" y={16} stagger={0.05}>
            {destination.whatToSee.map((item) => (
              <span
                key={item}
                className="px-6 py-2.5 rounded-full bg-white border border-outline-variant text-primary font-label-md transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-sm"
              >
                {item}
              </span>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Activities */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <SectionHeading icon="explore">Activities</SectionHeading>
        <BulletGrid items={destination.activities} icon="task_alt" />
      </section>

      {/* Amenities & Accommodation */}
      <section className="relative overflow-hidden py-16">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/bg/canvas-b.jpg')]  bg-cover bg-center opacity-[0.16]"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          <div>
            <SectionHeading icon="info">On-Site Amenities</SectionHeading>
            <BulletGrid items={destination.facility} icon="check_circle" columns={1} />
          </div>
          <div>
            <SectionHeading icon="hotel">Accommodation</SectionHeading>
            <ScrollReveal as="div" className="p-6 border border-outline-variant rounded-lg bg-white" y={20}>
              <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line text-justify">
                {destination.accommodation}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Conservation & Eco-Practices */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <SectionHeading icon="shield_with_heart" iconColor="text-secondary">
          Conservation &amp; Eco-Practices
        </SectionHeading>
        <ScrollReveal as="div" y={16}>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-3xl text-justify">
            {destination.conservationNotes}
          </p>
        </ScrollReveal>
        <BulletGrid items={destination.ecoGuidelines} icon="eco" />
      </section>

      {/* Nearby Places */}
      {nearby.length > 0 ? (
        <section className="relative overflow-hidden bg-surface-container-low py-16">
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/bg/green-orizon.png')]  bg-cover bg-center opacity-[0.6]"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <SectionHeading icon="near_me">Nearby Places</SectionHeading>
            <ScrollReveal as="div" className="grid grid-cols-1 md:grid-cols-3 gap-gutter" y={24} stagger={0.1}>
              {nearby.map(({ text, match }) => {
                const content = (
                  <>
                    <h3 className="font-headline-md mb-2 flex justify-between items-center">
                      {match ? match.title : text.split(/[:(]/)[0].trim()}
                      {match ? (
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                          chevron_right
                        </span>
                      ) : null}
                    </h3>
                    <p className="font-body-md text-on-surface-variant text-justify">{text}</p>
                  </>
                );
                return match ? (
                  <Link
                    key={text}
                    href={`/destinations/${match.slug}`}
                    className="group cursor-pointer border border-outline-variant bg-white overflow-hidden rounded-lg p-6 hover:border-primary transition-colors"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={text}
                    className="cursor-pointer border border-outline-variant bg-white overflow-hidden rounded-lg p-6"
                  >
                    {content}
                  </div>
                );
              })}
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      {/* Safety & Travel Tips */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <SectionHeading icon="priority_high" iconColor="text-error">
          Safety &amp; Travel Tips
        </SectionHeading>
        <ScrollReveal as="div" className="grid grid-cols-1 md:grid-cols-2 gap-4" y={20} stagger={0.08}>
          <div className="p-6 bg-error-container text-on-error-container border border-error/20 rounded-lg flex gap-4">
            <span className="material-symbols-outlined">call</span>
            <div>
              <p className="font-label-md font-bold mb-1">Emergency: 112</p>
              <p className="font-body-md opacity-90 text-justify">{destination.hospital}</p>
            </div>
          </div>
          {destination.safetyTips.map((tip) => (
            <div
              key={tip}
              className="p-6 bg-surface-container-lowest border border-outline-variant rounded-lg flex gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <p className="font-body-md text-on-surface-variant text-justify">{tip}</p>
            </div>
          ))}
        </ScrollReveal>
      </section>
    </>
  );
}
