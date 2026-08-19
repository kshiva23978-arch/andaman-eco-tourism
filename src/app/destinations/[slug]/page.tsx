import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Chip } from "@/components/ui/Chip";
import { InfoStat } from "@/components/ui/InfoStat";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { destinations, getDestinationBySlug } from "@/lib/data/destinations";
import { firstClause, findNearbyDestination } from "@/lib/format";

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
    <ul
      className={`grid grid-cols-1 ${
        columns === 2 ? "md:grid-cols-2" : ""
      } gap-4`}
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 bg-white p-4 border border-outline-variant rounded-lg"
        >
          <span className="material-symbols-outlined text-secondary bg-secondary-container/30 p-1.5 rounded-full h-fit text-[20px]">
            {icon}
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {item}
          </p>
        </li>
      ))}
    </ul>
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
      <section className="relative h-[520px] md:h-[600px] w-full overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end pb-16 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto w-full">
            <Chip variant="glass" className="mb-4">
              {destination.region}
            </Chip>
            <h1 className="font-headline-xl text-white mb-4 text-4xl md:text-[56px] md:leading-[1.05]">
              {destination.title}
            </h1>
            <p className="font-body-lg text-white/90 max-w-2xl text-lg md:text-[22px]">
              {destination.overview}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Destinations", href: "/destinations" },
            { label: destination.region, href: "/destinations" },
            { label: destination.title },
          ]}
        />
      </section>

      {/* Key Info Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <InfoStat label="Best Time to Visit" value={firstClause(destination.bestTime, 64)} color="secondary" />
          <InfoStat label="Timing" value={firstClause(destination.timing, 64)} />
          <InfoStat label="Entry Fee" value={firstClause(destination.fees, 64)} />
          <InfoStat label="Permits" value={firstClause(destination.permits, 64)} />
          <InfoStat label="Range & Division" value={destination.rangeDivision || "—"} />
          <InfoStat label="Nearest Hospital" value={firstClause(destination.hospital, 64)} color="error" />
        </div>
      </section>

      {/* How To Get There */}
      <section className="bg-surface-container-low py-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHeading icon="directions_boat">How To Get There</SectionHeading>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-headline-md mb-2">By Road</h4>
                  <p className="font-body-md text-on-surface-variant">
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
                  <p className="font-body-md text-on-surface-variant">
                    {destination.accessibility.ship}
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-lg">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry Fees & Permits */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <SectionHeading icon="payments">Entry Fees &amp; Permits</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="p-6 border border-outline-variant rounded-lg bg-surface-container-lowest">
            <h4 className="font-label-md text-primary uppercase mb-3 tracking-widest">
              Fees
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
              {destination.fees}
            </p>
          </div>
          <div className="p-6 border border-outline-variant rounded-lg bg-surface-container-lowest">
            <h4 className="font-label-md text-primary uppercase mb-3 tracking-widest">
              Permits
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
              {destination.permits}
            </p>
          </div>
        </div>
      </section>

      {/* What To See */}
      <section className="bg-surface-container py-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <SectionHeading icon="visibility">What To See</SectionHeading>
          <div className="flex flex-wrap gap-4">
            {destination.whatToSee.map((item) => (
              <span
                key={item}
                className="px-6 py-2.5 rounded-full bg-white border border-outline-variant text-primary font-label-md"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <SectionHeading icon="explore">Activities</SectionHeading>
        <BulletGrid items={destination.activities} icon="task_alt" />
      </section>

      {/* Amenities & Accommodation */}
      <section className="bg-surface-container-low py-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          <div>
            <SectionHeading icon="info">On-Site Amenities</SectionHeading>
            <BulletGrid items={destination.facility} icon="check_circle" columns={1} />
          </div>
          <div>
            <SectionHeading icon="hotel">Accommodation</SectionHeading>
            <div className="p-6 border border-outline-variant rounded-lg bg-white">
              <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
                {destination.accommodation}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation & Eco-Practices */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <SectionHeading icon="shield_with_heart" iconColor="text-secondary">
          Conservation &amp; Eco-Practices
        </SectionHeading>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-3xl">
          {destination.conservationNotes}
        </p>
        <BulletGrid items={destination.ecoGuidelines} icon="eco" />
      </section>

      {/* Nearby Places */}
      {nearby.length > 0 ? (
        <section className="bg-surface-container-low py-16">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <SectionHeading icon="near_me">Nearby Places</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
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
                    <p className="font-body-md text-on-surface-variant">{text}</p>
                  </>
                );
                return match ? (
                  <Link
                    key={text}
                    href={`/destinations/${match.slug}`}
                    className="group border border-outline-variant bg-white overflow-hidden rounded-lg p-6 hover:border-primary transition-colors"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={text}
                    className="border border-outline-variant bg-white overflow-hidden rounded-lg p-6"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Safety & Travel Tips */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <SectionHeading icon="priority_high" iconColor="text-error">
          Safety &amp; Travel Tips
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-error-container text-on-error-container border border-error/20 rounded-lg flex gap-4">
            <span className="material-symbols-outlined">call</span>
            <div>
              <p className="font-label-md font-bold mb-1">Emergency: 112</p>
              <p className="font-body-md opacity-90">{destination.hospital}</p>
            </div>
          </div>
          {destination.safetyTips.map((tip) => (
            <div
              key={tip}
              className="p-6 bg-surface-container-lowest border border-outline-variant rounded-lg flex gap-4"
            >
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <p className="font-body-md text-on-surface-variant">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
