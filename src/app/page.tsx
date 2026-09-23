"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EcoGuidelinesSection } from "@/components/ui/EcoGuidelinesSection";
import { AlternatingFeatureSection } from "@/components/ui/AlternatingFeatureSection";
import { ActivityCard } from "@/components/activities/ActivityCard";
import DestinationCarousel from "@/components/destinations/DestinationCarousel";
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
import { DecorativeLeaf } from "@/components/ui/DecorativeLeaf";
import { DragScrollRow } from "@/components/ui/DragScrollRow";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { RevealText, ScrollReveal } from "@/components/ui/ScrollReveal";
import { RevealSide } from "@/components/ui/RevealSide";
import { CinematicIntro, HERO_TITLE_LINES } from "@/components/ui/CinematicIntro";

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

const heroSlides = [
  { name: "Coral Gardens", video: "/videos/fish.mp4" },
  { name: "Sea Turtles", video: "/videos/bg-banner.mp4" },
  { name: "Shorebirds", video: "/videos/bird-fish.mp4" },
  { name: "Golden Hour", video: "/videos/sun-set.mp4" },
];

// Leaflet touches `window` on import, so it can only render on the client.
const AndamanLeafletMap = dynamic(
  () => import("@/components/ui/AndamanLeafletMap").then((mod) => mod.AndamanLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] w-full items-center justify-center rounded-[24px] bg-surface-container-low text-on-surface-variant">
        Loading map…
      </div>
    ),
  }
);

export default function Home() {
  const featuredDestinations = getDestinationsBySlugs(featuredDestinationSlugs);
  const featuredActivities = getActivitiesBySlugs(featuredActivitySlugs);
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroReady, setHeroReady] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const slideVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeDestination = heroSlides[activeSlide];
  const heroBackgroundVideo = activeDestination?.video ?? HERO_VIDEO;
  const isDefaultHeroVideo = !activeDestination?.video;

  // Fallback: if the intro never signals (e.g. it errors), still show the hero copy.
  useEffect(() => {
    const timeout = setTimeout(() => setHeroReady(true), 20000);
    return () => clearTimeout(timeout);
  }, []);

  // The slide video waits (paused at 0:00) behind the intro, then starts from the first frame on reveal.
  useEffect(() => {
    if (!heroReady) return;
    const video = slideVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [heroReady]);

  const heroReveal = heroReady ? "animate-hero-fade-up" : "opacity-0";

  const handleVideoEnded = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  const handleSlideSelect = (index: number) => {
    setActiveSlide(index);
  };

  return (
    <>
      {/* Cinematic opener — plays once, then dissolves into the hero */}
      <CinematicIntro onReveal={() => setHeroReady(true)} />

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
            ref={slideVideoRef}
            key={heroBackgroundVideo}
            src={heroBackgroundVideo}
            autoPlay={heroReady}
            preload="auto"
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
              {/* Content — col-8 */}
              <div className="md:col-span-8">
                {/* Children reveal individually: the h1 is handed off from the intro (FLIP),
                    the rest fade up once it lands. */}
                <div className="max-w-2xl text-white">
                  <div className={`mb-5 flex items-center gap-3 text-white/70 ${heroReveal}`}>
                    <span className="h-px w-10 bg-white/50" />
                    <span className="font-label-md text-[11px] uppercase tracking-[0.3em]">
                      Andaman &amp; Nicobar Islands
                    </span>
                  </div>
                  {/* Structure/typography mirrors CinematicIntro's title so the hand-off lands exactly. */}
                  <h1
                    data-hero-title
                    className={`hero-title mb-5 w-fit text-[2.1rem] leading-[1.05] sm:text-4xl md:text-7xl ${
                      heroReady ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {HERO_TITLE_LINES.map((line) => (
                      <span key={line} className="block whitespace-nowrap">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className={`mb-8 max-w-lg text-base text-white/85 md:text-lg md:text-body-lg ${heroReveal}`}>
                    A journey into pristine nature, vibrant culture, and sustainable
                    adventures — guided by the people who protect these islands.
                  </p>
                  <div className={`flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6 ${heroReveal}`}>
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
                <div className="mt-14 flex items-end border-t border-white/[0.15] pt-5">
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

            </div>
          </div>
        </div>

        {/* Wave divider — matches the section that follows (map on mobile, destinations on desktop) */}
        <svg
          aria-hidden="true"
          viewBox="0 860 1920 220"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[64px] w-full text-surface-container-low md:h-[110px]"
        >
          <rect x="0" y="1075" width="1920" height="10" fill="currentColor" />
          <path
            fill="currentColor"
            d="M1920,1080C1600.8333333333333,1104.1666666666667,296.1666666666667,1096,0,1080C-296.1666666666667,1064,94.83333333333334,999,143,984C191.16666666666666,969,239.66666666666666,984.1666666666666,289,990C338.3333333333333,995.8333333333334,389.8333333333333,1016.6666666666666,439,1019C488.1666666666667,1021.3333333333334,534.5,1002.8333333333334,584,1004C633.5,1005.1666666666666,686,1034.8333333333333,736,1026C786,1017.1666666666666,834.8333333333334,960.3333333333334,884,951C933.1666666666666,941.6666666666666,982,981.8333333333334,1031,970C1080,958.1666666666666,1129.1666666666667,876,1178,880C1226.8333333333333,884,1274.3333333333333,990,1324,994C1373.6666666666667,998,1426.8333333333333,923.1666666666666,1476,904C1525.1666666666667,884.8333333333334,1570.3333333333333,884.5,1619,879C1667.6666666666667,873.5,1718.6666666666667,861.6666666666666,1768,871C1817.3333333333333,880.3333333333334,1889.6666666666667,900.1666666666666,1915,935C1940.3333333333333,969.8333333333334,2239.1666666666665,1055.8333333333333,1920,1080C1600.8333333333333,1104.1666666666667,296.1666666666667,1096,0,1080"
          />
        </svg>

        <button
          type="button"
          onClick={() =>
            window.scrollTo({ top: heroSectionRef.current?.offsetHeight ?? 800, behavior: "smooth" })
          }
          aria-label="Scroll to explore"
          className="absolute inset-x-0 bottom-3 z-10 flex animate-float items-center justify-center gap-2 text-on-surface/60 md:bottom-4"
        >
          <span className="font-caption text-caption tracking-widest uppercase">Scroll</span>
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </section>

      {/* Island map — watercolour paper, copy left / map right */}
      <section className="relative overflow-hidden bg-surface-container-low py-14 md:py-20">
        {/* Illustrated sea background, kept faint so the map and copy stay legible */}
        <Image
          src="/images/bg/water-bg-texture.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="pointer-events-none object-cover opacity-20"
        />
        {/* Blend the top edge into the hero's wave divider */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-surface-container-low to-transparent"
        />

        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Stacked until lg — a 4/12 column at md is too narrow for the larger heading. */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
            <ScrollReveal className="lg:col-span-5">
              <span className="mb-5 block h-1 w-10 rounded-full bg-primary" />
              <h2 className="hero-title text-4xl leading-[1.1] text-primary sm:text-5xl lg:text-6xl">
                Discover the Islands
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg lg:max-w-md xl:text-xl">
                Over 570 islands stretch across the Bay of Bengal — only a handful are open to
                visitors. Pick a marker to explore its beaches, reefs, forests and the communities
                that care for them.
              </p>
              <Link
                href="/destinations"
                className="group mt-7 inline-flex items-center gap-2 font-label-md text-base font-semibold tracking-wide text-primary hover:underline sm:text-lg"
              >
                Browse all {destinations.length} destinations
                <span className="material-symbols-outlined text-[22px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </ScrollReveal>

            <RevealSide as="div" className="lg:col-span-7" x={-80}>
              <AndamanLeafletMap heightClass="h-[440px] sm:h-[520px] md:h-[600px] lg:h-[680px]" />
            </RevealSide>
          </div>
        </div>

        <Link
          href="/destinations"
          aria-label="Open the full destinations explorer"
          className="absolute bottom-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-white/80 text-primary shadow-md backdrop-blur transition-colors hover:bg-primary hover:text-white md:bottom-8 md:right-8"
        >
          <span className="material-symbols-outlined text-[20px]">open_in_full</span>
        </Link>
      </section>

   

      {/* Featured Destinations */}
      <section className="relative overflow-hidden py-12 md:py-20 bg-surface-container-low">
        <DecorativeLeaf className="top-8 right-6 md:top-12 md:right-16" rotate={65} size={130} opacity={0.16} />
        <ScrollReveal
          as="div"
          className="max-w-container-8xl mx-auto px-margin-mobile md:px-margin-desktop"
          y={64}
          start="top 88%"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <Chip variant="primary" icon="landscape" className="mb-3">
                Handpicked Escapes
              </Chip>
              <RevealText className="font-headline-lg text-2xl md:text-headline-xl text-black tracking-tight">
                Explore Featured <span className="text-emerald-700">Destinations</span>
              </RevealText>
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
        </ScrollReveal>
        <DecorativeLeaf className="bottom-6 left-4 md:bottom-10 md:left-8" rotate={-25} size={110} opacity={0.22} delay={5} />
      </section>

      {/* Why sustainable travel */}
      <section className="relative overflow-hidden bg-surface py-4 md:py-8">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <ScrollReveal className="mx-auto mb-2 max-w-2xl text-center">
            <Chip variant="secondary" icon="volunteer_activism" className="mb-3">
              Our Commitment
            </Chip>
            <RevealText className="font-headline-lg text-2xl md:text-headline-xl text-black tracking-tight">
              Why Travel <span className="text-emerald-700">Sustainably</span> With Us
            </RevealText>
          </ScrollReveal>
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
        <ParallaxBackground src="/images/bg/cellular-jail.jpg" />
        <DecorativeLeaf className="bottom-8 right-4 md:bottom-14 md:right-14" rotate={195} flip size={150} opacity={0.2} delay={3} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" />

        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <ScrollReveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
            <div className="max-w-2xl text-center md:text-left w-full">
              <Chip variant="glass" icon="hiking" className="mb-4">
                {activities.length} Curated Experiences
              </Chip>
              <RevealText className="font-headline-lg text-2xl md:text-headline-xl text-white tracking-tight mb-4">
                Featured <span className="text-emerald-100">Eco-Activities</span>
              </RevealText>
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
          </ScrollReveal>
        </div>

        {/* Full-bleed cinematic coverflow — cards arc toward the viewer and drift off both edges */}
        <DragScrollRow
          className="relative flex flex-row items-center gap-3 overflow-x-auto px-[13vw] no-scrollbar md:gap-6 md:px-[8vw] md:py-14"
          loopCount={featuredActivities.length}
          revealOnScroll
          coverflow
          settleToCenter
          autoplayInterval={4000}
        >
          {[...featuredActivities, ...featuredActivities, ...featuredActivities].map(
            (activity, index) => (
              <ActivityCard key={`${activity.slug}-${index}`} activity={activity} variant="cinematic" />
            )
          )}
        </DragScrollRow>
      </section>

      {/* Eco-Guidelines */}
      <EcoGuidelinesSection guidelines={ECO_GUIDELINES} />

   
    </>
  );
}
