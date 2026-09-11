"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EcoGuidelinesSection } from "@/components/ui/EcoGuidelinesSection";
import { AlternatingFeatureSection } from "@/components/ui/AlternatingFeatureSection";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { ActivityCard } from "@/components/activities/ActivityCard";
import {
  destinations,
  featuredDestinationSlugs,
  getDestinationsBySlugs,
} from "@/lib/data/destinations";
import {
  activities,
  featuredActivitySlugs,
  getActivitiesBySlugs,
} from "@/lib/data/activities";
import DestinationCarousel from "@/components/destinations/DestinationCarousel";
import { DecorativeLeaf } from "@/components/ui/DecorativeLeaf";
import { DragScrollRow } from "@/components/ui/DragScrollRow";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

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

const HERO_VIDEO = "/videos/bg-banner.mp4";

const MAP_HOTSPOTS: Array<{
  slug: string;
  label: string;
  x: number;
  y: number;
  dir: "tl" | "tr" | "bl" | "br" | "l" | "r" | "t" | "b";
}> = [
  { slug: "saddle-peak-national-park", label: "Saddle Peak", x: 49, y: 67, dir: "l" },
  { slug: "ross-and-smith-islands", label: "Ross & Smith", x: 64, y: 17, dir: "tr" },
  { slug: "limestone-caves-baratang", label: "Limestone Caves", x: 53, y: 53, dir: "l" },
  { slug: "cuthbert-bay-beach-wildlife-sanctuary", label: "Cuthbert Bay", x: 59, y: 36, dir: "tr" },
  { slug: "mud-volcanoes-of-shyamnagar", label: "Mud Volcanoes", x: 55, y: 53, dir: "tr" },
  { slug: "elephanta-beach", label: "Elephanta Beach", x: 61, y: 58, dir: "tr" },
  { slug: "radhanagar-beach", label: "Radhanagar Beach", x: 62, y: 61, dir: "r" },
  { slug: "mount-manipur-national-park", label: "Mount Manipur", x: 50, y: 68, dir: "r" },
  { slug: "jolly-buoy-island", label: "Jolly Buoy", x: 41, y: 76, dir: "bl" },
  { slug: "kalapathar-beach-little-andaman", label: "Kalapathar Beach Little Andaman", x: 40, y: 86, dir: "br" },
];

const LEADER_DIRS = {
  tl: { x: -1, y: -1 },
  tr: { x: 1, y: -1 },
  bl: { x: -1, y: 1 },
  br: { x: 1, y: 1 },
  l: { x: -1, y: 0 },
  r: { x: 1, y: 0 },
  t: { x: 0, y: -1 },
  b: { x: 0, y: 1 },
} as const;

const heroSlides = [
  { name: "Coral Gardens", video: "/videos/fish.mp4" },
  { name: "Sea Turtles", video: "/videos/bg-banner.mp4" },
  { name: "Shorebirds", video: "/videos/bird-fish.mp4" },
  { name: "Golden Hour", video: "/videos/sun-set.mp4" },
];

function AndamanMapPanel({ heightClass }: { heightClass: string }) {
  return (
    <div className="relative w-full">
      <div className="absolute -inset-4 rounded-[28px] bg-white/10 blur-2xl" />
      <div className="relative overflow-hidden backdrop-blur-sm shadow-2xl-md ">
        <div className={`relative w-full ${heightClass}`}>
          <img
            src="/images/map/andaman-map-2.png"
            alt="Andaman and Nicobar Islands map"
            className="h-full w-full object-contain"
          />

          {MAP_HOTSPOTS.map(({ slug, label, x, y, dir }) => {
            const { x: dx, y: dy } = LEADER_DIRS[dir];
            const leaderLength = 26;
            const mag = Math.sqrt(dx * dx + dy * dy) || 1;
            const endX = (dx / mag) * leaderLength;
            const endY = (dy / mag) * leaderLength;

            return (
              <Link
                key={slug}
                href={`/destinations/${slug}`}
                aria-label={`Open ${label} destination`}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-lg transition-transform group-hover:scale-125" />
                <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
                  <defs>
                    <marker
                      id={`arrow-${slug}`}
                      markerWidth="6"
                      markerHeight="6"
                      refX="5"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L6,3 L0,6 z" className="fill-white/80" />
                    </marker>
                  </defs>
                  <line
                    x1={endX}
                    y1={endY}
                    x2="0"
                    y2="0"
                    className="stroke-white/80"
                    strokeWidth="1.5"
                    markerEnd={`url(#arrow-${slug})`}
                  />
                </svg>
                <span
                  className="absolute whitespace-nowrap rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-gray-900 shadow-md transition-transform group-hover:scale-105"
                  style={{
                    left: `${endX}px`,
                    top: `${endY}px`,
                    transform: `translate(${dx < 0 ? "-100%" : dx > 0 ? "0%" : "-50%"}, ${dy < 0 ? "-100%" : dy > 0 ? "0%" : "-50%"})`,
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const featuredDestinations = getDestinationsBySlugs(featuredDestinationSlugs);
  const featuredActivities = getActivitiesBySlugs(featuredActivitySlugs);
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroReady, setHeroReady] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const activeDestination = heroSlides[activeSlide];
  const heroBackgroundVideo = activeDestination?.video ?? HERO_VIDEO;
  const isDefaultHeroVideo = !activeDestination?.video;

  useEffect(() => {
    const timeout = setTimeout(() => setHeroReady(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const handleVideoEnded = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  const handleSlideSelect = (index: number) => {
    setActiveSlide(index);
  };

  return (
    <>
      {/* Hero */}
      <section
        ref={heroSectionRef}
        className="relative h-[90vh] min-h-[640px] w-full overflow-hidden bg-black"
      >
        <div className="absolute inset-0 z-0">
          <video
            key={`${HERO_VIDEO}-default`}
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className={`animate-kenburns absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              isDefaultHeroVideo ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Default Andaman background video"
          />
          <video
            key={heroBackgroundVideo}
            src={heroBackgroundVideo}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            className={`animate-kenburns absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              isDefaultHeroVideo ? "opacity-0" : "opacity-100"
            }`}
            aria-label={`${activeDestination?.name ?? "Andaman Archipelago"} background video`}
          />
          {/* Cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 flex h-full w-full items-center">
          <div className="w-full max-w-container-fluid mx-auto px-margin-mobile pb-12 md:px-margin-desktop md:pb-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
              {/* Left content — col-8 */}
              <div className="md:col-span-8">
                <div
                  className={`max-w-2xl text-white ${
                    heroReady ? "animate-hero-fade-up" : "opacity-0"
                  }`}
                >
                  <div className="mb-5 flex items-center gap-3 text-white/70">
                    <span className="h-px w-10 bg-white/50" />
                    <span className="font-label-md text-[11px] uppercase tracking-[0.3em]">
                      Andaman &amp; Nicobar Islands
                    </span>
                  </div>
                  <h1 className="hero-title mb-5 text-4xl leading-[1.05] md:text-7xl">
                    Discover Andaman & Nicobar Islands
                  </h1>
                  <p className="mb-8 max-w-lg text-base text-white/85 md:text-lg md:text-body-lg">
                    A journey into pristine nature, vibrant culture, and sustainable
                    adventures — guided by the people who protect these islands.
                  </p>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
                    <Button href="/destinations" variant="white" size="lg">
                      Explore Destinations
                    </Button>
                    <Link
                      href="/activities"
                      className="group inline-flex items-center gap-2 font-label-md text-label-md text-white"
                    >
                      Plan Your Journey
                      <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Chapter indicator */}
                <div className="mt-14 flex items-end border-t border-white/15 pt-5">
                  <div className="flex gap-6 md:gap-10">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={slide.name}
                        type="button"
                        onClick={() => handleSlideSelect(index)}
                        aria-label={`Show ${slide.name}`}
                        aria-pressed={index === activeSlide}
                        className="group flex flex-col items-start gap-2 text-left"
                      >
                        <span
                          className={`font-caption text-caption tracking-wide transition-colors ${
                            index === activeSlide ? "text-white" : "text-white/40 group-hover:text-white/70"
                          }`}
                        >
                          0{index + 1} <span className="hidden sm:inline">{slide.name}</span>
                        </span>
                        <span className="relative h-[2px] w-10 overflow-hidden rounded-full bg-white/20 md:w-14">
                          <span
                            className={`absolute inset-y-0 left-0 bg-white transition-all duration-500 ${
                              index === activeSlide ? "w-full" : "w-0"
                            }`}
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map panel — col-4 */}
              <div className="hidden md:col-span-4 md:block">
                <AndamanMapPanel heightClass="h-[480px] md:h-[560px] lg:h-[620px]" />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            window.scrollTo({ top: heroSectionRef.current?.offsetHeight ?? 800, behavior: "smooth" })
          }
          aria-label="Scroll to explore"
          className="absolute inset-x-0 bottom-6 z-10 flex animate-float items-center justify-center gap-2 text-white/70"
        >
          <span className="font-caption text-caption tracking-widest uppercase">Scroll</span>
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </section>

      {/* Map — mobile only, shown after hero */}
      <section className="relative bg-cyan-300 px-margin-mobile py-10 md:hidden ">
        <AndamanMapPanel heightClass="h-[420px]" />
      </section>

   

      {/* Featured Destinations */}
      <section className="relative overflow-hidden py-12 md:py-20 bg-surface-container-low">
        <DecorativeLeaf className="top-8 right-6 md:top-12 md:right-16" rotate={65} size={130} opacity={0.16} />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <Chip variant="primary" icon="landscape" className="mb-3">
                Handpicked Escapes
              </Chip>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight">
                Explore Featured Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="group flex items-center gap-2 text-primary font-label-md text-label-md hover:underline transition-all"
            >
              Browse All {destinations.length} Destinations
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="w-full">
            <DestinationCarousel featuredDestinations={featuredDestinations} />
          </div>
        </div>
        <DecorativeLeaf className="bottom-6 left-4 md:bottom-10 md:left-8" rotate={-25} size={110} opacity={0.22} />
      </section>

      {/* Why sustainable travel */}
      <section className="relative overflow-hidden bg-surface py-4 md:py-8">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto mb-2 max-w-2xl text-center">
            <Chip variant="secondary" icon="volunteer_activism" className="mb-3">
              Our Commitment
            </Chip>
            <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight">
              Why Travel Sustainably With Us
            </h2>
          </div>
        </div>
      </section>

      <AlternatingFeatureSection
        icon="waves"
        title="Marine Conservation First"
        image="/images/illustrations/img-3.jpeg"
        imageAlt="Coral reef and marine life in Andaman waters"
        body="Every dive and snorkeling excursion follows a strict no-touch coral policy, led by trained marine naturalists who monitor reef health across dive sites."
        bullets={[
          { icon: "check_circle", text: "No-touch coral policy enforced at every dive site" },
          { icon: "check_circle", text: "Certified marine biologists lead reef excursions" },
          { icon: "check_circle", text: "Plastic-free zones across all beaches" },
        ]}
        bgClassName="bg-surface"
        watermark="/images/illustrations/glass-bottom.png"
      />

      <AlternatingFeatureSection
        icon="diversity_3"
        title="Community-Powered Journeys"
        image="/images/illustrations/img-9.jpeg"
        imageAlt="Local guide leading travelers through the islands"
        body="Homestays, boat operators and trekking guides are drawn from local island communities — keeping tourism revenue where it belongs, and indigenous reserves strictly off-limits."
        bullets={[
          { icon: "check_circle", text: "Fair-wage local guides and boat operators" },
          { icon: "check_circle", text: "Tribal reserves respected and never entered" },
          { icon: "check_circle", text: "Homestay networks across island communities" },
        ]}
        reverse
        bgClassName="bg-surface-container-low"
        watermark="/images/illustrations/mangrove.png"
      />

      {/* Featured Activities */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <ParallaxBackground src="/images/bg/forest-bg.jpg" />
        <DecorativeLeaf className="bottom-8 right-4 md:bottom-14 md:right-14" rotate={195} flip size={150} opacity={0.2} />
        <div className="absolute inset-0 bg-primary/50" />

        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
            <div className="max-w-2xl text-center md:text-left w-full">
              <Chip variant="glass" icon="hiking" className="mb-4">
                {activities.length} Curated Experiences
              </Chip>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-white mb-4">
                Featured Eco-Activities
              </h2>
            </div>
            <Link
              href="/activities"
              className="flex items-center gap-2 text-white font-label-md text-label-md group mx-auto md:mx-0"
            >
              Explore Activities Guide
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
          <DragScrollRow
            className="flex flex-row overflow-x-auto gap-gutter pb-6 no-scrollbar snap-x snap-mandatory"
            loopCount={featuredActivities.length}
            revealOnScroll
          >
            {[...featuredActivities, ...featuredActivities, ...featuredActivities].map(
              (activity, index) => (
                <ActivityCard key={`${activity.slug}-${index}`} activity={activity} />
              )
            )}
          </DragScrollRow>
        </div>
      </section>

      {/* Eco-Guidelines */}
      <EcoGuidelinesSection guidelines={ECO_GUIDELINES} />

   
    </>
  );
}
