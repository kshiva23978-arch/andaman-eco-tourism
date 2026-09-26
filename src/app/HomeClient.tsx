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
import type { DestinationPin } from "@/lib/data/destination-pins";
import type { Activity, Destination } from "@/lib/types";
import { DecorativeLeaf } from "@/components/ui/DecorativeLeaf";
import { DragScrollRow } from "@/components/ui/DragScrollRow";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { RevealText, ScrollReveal } from "@/components/ui/ScrollReveal";
import { RevealSide } from "@/components/ui/RevealSide";
import { CinematicIntro } from "@/components/ui/CinematicIntro";
import { AccentText } from "@/components/ui/AccentText";
import { withCount, type HomeContent } from "@/lib/content/home";

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

export function HomeClient({
  content,
  featuredDestinations,
  featuredActivities,
  destinationCount,
  activityCount,
  mapPins,
}: {
  content: HomeContent;
  featuredDestinations: Destination[];
  featuredActivities: Activity[];
  destinationCount: number;
  activityCount: number;
  mapPins: DestinationPin[];
}) {
  const { hero, map, featuredDestinations: fd, sustainability, featuredActivities: fa, ecoGuidelines } =
    content;
  const heroSlides = hero.slides;
  const heroTitleLines = [hero.titleLine1, hero.titleLine2].filter(Boolean);
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroReady, setHeroReady] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const slideVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeDestination = heroSlides[activeSlide];
  const heroBackgroundVideo = activeDestination?.video ?? hero.introVideo;

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
    setActiveSlide((current) => (current + 1) % Math.max(1, heroSlides.length));
  };

  const handleSlideSelect = (index: number) => {
    setActiveSlide(index);
  };

  return (
    <>
      {/* Cinematic opener — plays once, then dissolves into the hero */}
      <CinematicIntro
        onReveal={() => setHeroReady(true)}
        titleLines={heroTitleLines}
        video={hero.introVideo}
      />

      {/* Hero */}
      <section
        ref={heroSectionRef}
        className="relative h-[90vh] min-h-[640px] w-full overflow-hidden bg-black"
      >
        <div className="absolute inset-0 z-0">
          <video
            ref={slideVideoRef}
            key={heroBackgroundVideo}
            src={heroBackgroundVideo}
            autoPlay={heroReady}
            preload={heroReady ? "auto" : "metadata"}
            muted
            playsInline
            onEnded={handleVideoEnded}
            className="animate-kenburns absolute inset-0 h-full w-full object-cover"
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
                      {hero.eyebrow}
                    </span>
                  </div>
                  {/* Structure/typography mirrors CinematicIntro's title so the hand-off lands exactly. */}
                  <h1
                    data-hero-title
                    className={`hero-title mb-5 w-fit text-[2.1rem] leading-[1.05] sm:text-4xl md:text-7xl ${
                      heroReady ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {heroTitleLines.map((line, i) => (
                      <span key={i} className="block whitespace-nowrap">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className={`mb-8 max-w-lg text-base text-justify text-white/85 md:text-lg md:text-body-lg ${heroReveal}`}>
                    {hero.subtitle}
                  </p>
                  <div className={`flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6 ${heroReveal}`}>
                    <Button href={hero.primaryCta.href} variant="white" size="lg">
                      {hero.primaryCta.label}
                    </Button>
                    <Link
                      href={hero.secondaryCta.href}
                      className="group inline-flex items-center gap-2 font-label-md text-label-md text-white"
                    >
                      {hero.secondaryCta.label}
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
                        key={`${slide.name}-${index}`}
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
        {map.backgroundImage ? (
          <Image
            src={map.backgroundImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-20"
          />
        ) : null}
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
                {map.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-justify text-on-surface-variant sm:text-lg lg:max-w-md xl:text-xl">
                {map.body}
              </p>
              <Link
                href="/destinations"
                className="group mt-7 inline-flex items-center gap-2 font-label-md text-base font-semibold tracking-wide text-primary hover:underline sm:text-lg"
              >
                {withCount(map.linkLabel, destinationCount)}
                <span className="material-symbols-outlined text-[22px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </ScrollReveal>

            <RevealSide as="div" className="lg:col-span-7" x={-80}>
              <AndamanLeafletMap
                pins={mapPins}
                heightClass="h-[440px] sm:h-[520px] md:h-[600px] lg:h-[680px]"
              />
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
                {withCount(fd.chip, destinationCount)}
              </Chip>
              <RevealText className="font-headline-lg text-2xl md:text-headline-xl text-black tracking-tight">
                <AccentText text={fd.title} accentClassName="text-emerald-700" />
              </RevealText>
            </div>
            <Link
              href="/destinations"
              className="group flex items-center gap-2 text-primary font-label-md text-label-md hover:underline transition-all"
            >
              {withCount(fd.linkLabel, destinationCount)}
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
              {sustainability.chip}
            </Chip>
            <RevealText className="font-headline-lg text-2xl md:text-headline-xl text-black tracking-tight">
              <AccentText text={sustainability.title} accentClassName="text-emerald-700" />
            </RevealText>
          </ScrollReveal>
        </div>
      </section>

      {/* Blocks alternate image side and background, starting image-right on the light surface. */}
      {sustainability.blocks.map((block, index) => (
        <AlternatingFeatureSection
          key={`${block.title}-${index}`}
          icon={block.icon}
          title={block.title}
          image={block.image}
          imageAlt={block.imageAlt || block.title}
          body={block.body}
          bullets={block.bullets.map((text) => ({ icon: "check_circle", text }))}
          reverse={index % 2 === 1}
          bgClassName={index % 2 === 1 ? "bg-surface-container-low" : "bg-surface"}
          watermark={block.watermark || undefined}
        />
      ))}

      {/* Featured Activities */}
      <section className="relative overflow-hidden py-20 md:py-24">
        {fa.backgroundImage ? <ParallaxBackground src={fa.backgroundImage} /> : null}
        <DecorativeLeaf className="bottom-8 right-4 md:bottom-14 md:right-14" rotate={195} flip size={150} opacity={0.2} delay={3} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" />

        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <ScrollReveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
            <div className="max-w-2xl text-center md:text-left w-full">
              <Chip variant="glass" icon="hiking" className="mb-4">
                {withCount(fa.chip, activityCount)}
              </Chip>
              <RevealText className="font-headline-lg text-2xl md:text-headline-xl text-white tracking-tight mb-4">
                <AccentText text={fa.title} accentClassName="text-emerald-100" />
              </RevealText>
            </div>
            <Link
              href="/activities"
              className="flex items-center gap-2 text-white font-label-md text-label-md group mx-auto md:mx-0"
            >
              {withCount(fa.linkLabel, activityCount)}
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
      <EcoGuidelinesSection
        chip={ecoGuidelines.chip}
        title={ecoGuidelines.title}
        intro={ecoGuidelines.intro}
        guidelines={ecoGuidelines.cards}
      />

   
    </>
  );
}
