import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IconFeatureCard } from "@/components/ui/IconFeatureCard";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { ActivityCard } from "@/components/activities/ActivityCard";
import {
  featuredDestinationSlugs,
  getDestinationsBySlugs,
} from "@/lib/data/destinations";
import { featuredActivitySlugs, getActivitiesBySlugs } from "@/lib/data/activities";

const ECO_GUIDELINES = [
  {
    icon: "delete_sweep",
    title: "Waste Management",
    body: "Carry back all non-biodegradable waste. Single-use plastics are strictly prohibited across the islands.",
  },
  {
    icon: "set_meal",
    title: "Marine Ethics",
    body: "Do not touch or stand on corals. Maintain a respectful distance from all marine life while diving or snorkeling.",
  },
  {
    icon: "photo_camera",
    title: "Wildlife Disturbance",
    body: "Feeding or disturbing wildlife is a punishable offense. Observe silence in forest zones.",
  },
  {
    icon: "history_edu",
    title: "Cultural Sensitivity",
    body: "Respect the privacy of local communities. Photography of indigenous tribes is strictly illegal.",
  },
];

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDrKID6eEyprXJNAg1Hvwt_ex0TGweOGnFgTDrwirMGe2DlU9S3MQ5oVz3_KXo0u3aTgxia7t8RK24115W9shT69Zdn_fVpEXSJCdSeUeKZY6uEEZINZpGPZRy8oI-0IogfOi1GMb6wxfOdt7K-NTACI1hcOGB2EoDSf3h9vEHW6CoO_c36qAVZVz_l5_VqHisEiMcFvVhHuOOVg-jHqDFFpO22zvnH_P1ChRcRkJQv5-2dpdbJ3S20Sx95b_KW94HWtvywvPBtr8Dg";

export default function Home() {
  const featuredDestinations = getDestinationsBySlugs(featuredDestinationSlugs);
  const featuredActivities = getActivitiesBySlugs(featuredActivitySlugs);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[500px] md:h-[819px] flex items-center overflow-hidden py-20 md:py-0">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt="Andaman Archipelago"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/40 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-white">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <h1 className="font-headline-xl text-3xl md:text-headline-xl mb-6 leading-tight">
              Discover Andaman &amp; Nicobar Islands
            </h1>
            <p className="font-body-lg text-lg md:text-body-lg mb-8 opacity-90 max-w-2xl">
              A journey into pristine nature, vibrant culture, and sustainable
              adventures
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Button href="/destinations" variant="white" size="lg">
                Explore Destinations
              </Button>
              <Button href="/activities" variant="outline-white" size="lg">
                Plan Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-12 md:py-20 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight">
              Explore Featured Destinations
            </h2>
            <Link
              href="/destinations"
              className="group flex items-center gap-2 text-primary font-label-md text-label-md hover:underline transition-all"
            >
              Browse All
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="flex flex-row overflow-x-auto gap-gutter pb-6 no-scrollbar snap-x snap-mandatory">
            {featuredDestinations.map((destination) => (
              <DestinationCard
                key={destination.slug}
                destination={destination}
                variant="carousel"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
            <div className="max-w-2xl text-center md:text-left w-full">
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary mb-4">
                Featured Eco-Activities
              </h2>
            </div>
            <Link
              href="/activities"
              className="flex items-center gap-2 text-primary font-label-md text-label-md group mx-auto md:mx-0"
            >
              Explore Activities Guide
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="flex flex-row overflow-x-auto gap-gutter pb-6 no-scrollbar snap-x snap-mandatory">
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity.slug} activity={activity} />
            ))}
          </div>
        </div>
      </section>

      {/* Eco-Guidelines */}
      <section className="py-20 md:py-24 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            <div className="md:w-1/3 text-center md:text-left">
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary mb-6">
                Eco-Guidelines
              </h2>
              <p className="text-on-surface-variant font-body-md text-body-md mb-8">
                Traveling to a sensitive ecological zone requires a
                commitment to responsibility. Please adhere to these official
                guidelines to help preserve our natural heritage.
              </p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {ECO_GUIDELINES.map((guideline) => (
                <IconFeatureCard key={guideline.title} {...guideline} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
