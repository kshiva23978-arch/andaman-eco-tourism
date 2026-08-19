import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { DestinationCard } from "@/components/destinations/DestinationCard";
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
    <>
      {/* Hero */}
      <header className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={activity.heroImage}
            alt={activity.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full text-white">
          <div className="max-w-2xl">
            <span className="inline-block bg-secondary text-on-primary px-3 py-1 rounded text-label-md mb-6 uppercase tracking-wider">
              Official Activity Profile
            </span>
            <h1 className="font-headline-xl text-3xl md:text-headline-xl mb-4">
              {activity.title}
            </h1>
            <p className="font-body-lg text-body-lg text-surface-variant">
              {activity.tagline}
            </p>
          </div>
        </div>
      </header>

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Activities", href: "/activities" },
            { label: activity.title },
          ]}
        />
      </section>

      {/* Overview & Bento Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white border border-outline-variant p-8 rounded-xl shadow-sm">
              <h2 className="font-headline-lg text-headline-lg mb-6 border-b border-outline-variant pb-4">
                Activity Overview
              </h2>
              <div className="space-y-4 text-on-surface font-body-md text-body-md">
                {activity.overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-secondary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container">
                      timer
                    </span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md">Duration</h4>
                    <p className="text-caption">{activity.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-secondary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container">
                      military_tech
                    </span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md">Difficulty</h4>
                    <p className="text-caption">{activity.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-on-primary p-8 rounded-xl">
              <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined">eco</span>
                Mandatory Eco-Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activity.guidelines.map((guideline) => (
                  <div key={guideline.title} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary-fixed">
                        {guideline.icon}
                      </span>
                      <span className="font-label-md text-label-md uppercase">
                        {guideline.title}
                      </span>
                    </div>
                    <p className="text-caption opacity-90">{guideline.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-outline-variant p-6 rounded-xl">
              <h4 className="font-label-md text-label-md text-primary uppercase mb-4 tracking-widest">
                Equipment Provided
              </h4>
              <ul className="space-y-3">
                {activity.equipmentProvided.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-body-md font-body-md"
                  >
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant">
              <h4 className="font-label-md text-label-md text-primary uppercase mb-4 tracking-widest">
                Permit Requirements
              </h4>
              <p className="text-caption mb-4">{activity.permitNote}</p>
              <Button variant="primary" fullWidth type="button">
                Apply for Permit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Destinations */}
      {availableAt.length > 0 ? (
        <section className="bg-surface-container-low py-16">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-10 text-center">
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Available at these Destinations
              </h2>
              <p className="text-on-surface-variant font-body-md text-body-md">
                Documented sites where this activity is practiced under
                forest-department guidelines.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {availableAt.map((destination) => (
                <DestinationCard key={destination.slug} destination={destination} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Related Activities */}
      {related.length > 0 ? (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <h2 className="font-headline-lg text-headline-lg mb-10 text-primary">
            Explore More Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/activities/${item.slug}`}
                className="flex items-center gap-4 p-4 border border-outline-variant rounded-lg hover:bg-surface transition-colors group"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden shadow-sm">
                  <Image
                    src={item.heroImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <h5 className="font-label-md text-label-md group-hover:text-primary transition-colors">
                    {item.title}
                  </h5>
                  <p className="text-caption text-on-surface-variant">
                    {item.difficulty}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
