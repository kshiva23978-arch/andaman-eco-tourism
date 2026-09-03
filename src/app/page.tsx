"use client";

import { useEffect, useRef, useState } from "react";
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
import DestinationCarousel from "@/components/destinations/DestinationCarousel";
import { FlyingBird } from "@/components/ui/FlyingBird";
import { ScrollFrameSequence } from "@/components/ui/ScrollFrameSequence";
import { DecorativeLeaf } from "@/components/ui/DecorativeLeaf";

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
  { slug: "saddle-peak-national-park", label: "Saddle Peak", x: 50, y: 67, dir: "l" },
  { slug: "ross-and-smith-islands", label: "Ross & Smith", x: 69, y: 17, dir: "tr" },
  { slug: "limestone-caves-baratang", label: "Limestone Caves", x: 54, y: 53, dir: "l" },
  { slug: "cuthbert-bay-beach-wildlife-sanctuary", label: "Cuthbert Bay", x: 62, y: 36, dir: "tr" },
  { slug: "mud-volcanoes-of-shyamnagar", label: "Mud Volcanoes", x: 56, y: 53, dir: "tr" },
  { slug: "elephanta-beach", label: "Elephanta Beach", x: 61, y: 58, dir: "tr" },
  { slug: "radhanagar-beach", label: "Radhanagar Beach", x: 63, y: 61, dir: "r" },
  { slug: "mount-manipur-national-park", label: "Mount Manipur", x: 50, y: 68, dir: "r" },
  { slug: "jolly-buoy-island", label: "Jolly Buoy", x: 41, y: 76, dir: "bl" },
  { slug: "kalapathar-beach-little-andaman", label: "Kalapathar Beach Little Andaman", x: 40, y: 85, dir: "br" },
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

const destinations = [
  {
    name: "Fish video", 
    image: "/images/destinations/coral-fish.jpg",
    video: "/videos/fish.mp4",
  },
  {
    name: "Turtle video",
    image: "/images/destinations/turtle.jpg",
    video: "/videos/bg-banner.mp4",
  },
  {
    name: "Bird video",
    image: "/images/destinations/crab-bird.jpg",
    video: "/videos/bird-fish.mp4",

  },
  {
    name: "Sunset video",
    image: "/images/destinations/sunset.jpg",
    video: "/videos/sun-set.mp4",
  },

];

export default function Home() {
  const featuredDestinations = getDestinationsBySlugs(featuredDestinationSlugs);
  const featuredActivities = getActivitiesBySlugs(featuredActivitySlugs);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const destinationRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragState = useRef({ isDown: false, isDragging: false, startX: 0, scrollLeft: 0 });
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const activeDestination = destinations[activeSlide];
  const heroBackgroundVideo = activeDestination?.video ?? HERO_VIDEO;
  const isDefaultHeroVideo = !activeDestination?.video;

  useEffect(() => {
    const card = destinationRefs.current[activeSlide];
    const carousel = carouselRef.current;

    if (!card || !carousel) return;

    const cardRect = card.getBoundingClientRect();
    const carouselRect = carousel.getBoundingClientRect();
    const offset = cardRect.left - carouselRect.left;

    carousel.scrollTo({
      left: carousel.scrollLeft + offset - 12,
      behavior: "smooth",
    });
  }, [activeSlide]);

  const handleVideoEnded = () => {
    setActiveSlide((current) => (current + 1) % destinations.length);
  };

  const handleDotClick = (index: number) => {
    setActiveSlide(index);
    destinationRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const handleCardClick = (index: number) => {
    setActiveSlide(index);
    destinationRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    dragState.current = {
      isDown: true,
      isDragging: false,
      startX: event.clientX,
      scrollLeft: carousel.scrollLeft,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel || !dragState.current.isDown) return;

    const dx = event.clientX - dragState.current.startX;

    if (!dragState.current.isDragging) {
      if (Math.abs(dx) < 5) return;
      dragState.current.isDragging = true;
      carousel.setPointerCapture(event.pointerId);
    }

    carousel.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel || !dragState.current.isDown) return;

    const wasDragging = dragState.current.isDragging;
    dragState.current.isDown = false;
    dragState.current.isDragging = false;

    if (!wasDragging) return;

    carousel.releasePointerCapture(event.pointerId);

    const cardWidth = 240 + 16;
    const nextIndex = Math.round(carousel.scrollLeft / cardWidth);
    setActiveSlide(Math.min(Math.max(nextIndex, 0), destinations.length - 1));
  };

  return (
    <>
      {/* Hero */}
      <section
        ref={heroSectionRef}
        className="relative min-h-[500px] flex items-center overflow-hidden py-14 md:h-[819px] md:py-0"
      >
        <div className="absolute inset-0 z-0">
          <video
            key={`${HERO_VIDEO}-default`}
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
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
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isDefaultHeroVideo ? "opacity-0" : "opacity-100"
            }`}
            aria-label={`${activeDestination?.name ?? "Andaman Archipelago"} background video`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/40 to-transparent" />
        </div>

        <DecorativeLeaf className="bottom-6 left-4 md:bottom-10 md:left-8" rotate={-25} size={110} opacity={0.22} />

        <div className="relative z-10 w-full max-w-container-fluid mx-auto px-margin-mobile md:px-margin-desktop text-white">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-10">
            <div className="w-full max-w-[980px] text-left">
              <h1 className="hero-title mb-4 text-3xl leading-tight md:mb-6 md:text-headline-xl">
                Discover Andaman &amp; Nicobar Islands
              </h1>
              <p className="mb-6 max-w-xl text-base opacity-90 md:mb-8 md:text-lg md:text-body-lg">
                A journey into pristine nature, vibrant culture, and sustainable
                adventures
              </p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                <Button href="/destinations" variant="white" size="lg">
                  Explore Destinations
                </Button>
                <Button href="/activities" variant="outline-white" size="lg">
                  Plan Your Journey
                </Button>
              </div>

              <div
                ref={carouselRef}
                className="mt-6 w-full max-w-full overflow-x-auto overscroll-x-contain pt-4 pb-1 pl-1 pr-1 active:cursor-grabbing md:max-w-[900px] md:pt-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <div className="flex w-max gap-3 md:gap-4">
                  {destinations.map((destination, index) => (
                    <div
                      key={destination.name}
                      ref={(element) => {
                        destinationRefs.current[index] = element;
                      }}
                      onClick={() => handleCardClick(index)}
                      className={`group relative h-[220px] w-[180px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 md:h-[300px] md:w-[240px] ${
                        index === activeSlide
                          ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.25)]"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-center gap-2">
                {destinations.map((destination, index) => (
                  <button
                    key={`${destination.name}-dot`}
                    type="button"
                    onClick={() => handleDotClick(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      index === activeSlide ? "bg-white" : "bg-white/40"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-pressed={index === activeSlide}
                  />
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[510px] md:w-[510px]">
              <div className="absolute -inset-4 rounded-[28px] bg-white/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-sm shadow-2xl">
                <div className="relative">
                  <img
                    src="/images/map/andaman-map-2.png"
                    alt="Andaman and Nicobar Islands map"
                    className="h-auto w-full object-cover"
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
                        <svg
                          className="absolute left-0 top-0 overflow-visible"
                          width="1"
                          height="1"
                        >
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
          </div>
        </div>
      </section>
      
       {/* Featured Destinations */}
      <section className="relative overflow-hidden py-12 md:py-20 bg-surface-container-low">
        <DecorativeLeaf className="top-8 right-6 md:top-12 md:right-16" rotate={65} size={130} opacity={0.16} />
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
          <div className="w-full">
            <DestinationCarousel featuredDestinations={featuredDestinations} />
          </div>
        </div>
                <DecorativeLeaf className="bottom-6 left-4 md:bottom-10 md:left-8" rotate={-25} size={110} opacity={0.22} />
      </section>

      {/* Featured Activities */}
      <section className="relative overflow-hidden py-20 md:py-24 bg-[url('/images/bg/forest-bg.jpg')] bg-cover bg-center bg-fixed">
        <DecorativeLeaf className="bottom-8 right-4 md:bottom-14 md:right-14" rotate={195} flip size={150} opacity={0.2} />

        <div className="absolute inset-0 -z-10 " />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
            <div className="max-w-2xl text-center md:text-left w-full">
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
          <div className="flex flex-row overflow-x-auto gap-gutter pb-6 no-scrollbar snap-x snap-mandatory">
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity.slug} activity={activity} />
            ))}
          </div>
        </div>
      </section>
    

      {/* Eco-Guidelines */}
      <section className="relative overflow-hidden py-20 md:py-24 bg-surface">
        <DecorativeLeaf className="top-6 left-4 md:top-10 md:left-10" rotate={-60} size={120} opacity={0.15} />
        <DecorativeLeaf className="bottom-6 right-4 md:bottom-12 md:right-20" rotate={110} flip size={160} opacity={0.15} />
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
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4020881.2782082744!2d90.59024351827024!3d10.209710012395053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3064a00f2b650ff3%3A0xce80055648fccb2c!2sAndaman%20and%20Nicobar%20Islands!5e0!3m2!1sen!2sin!4v1788341773220!5m2!1sen!2sin"
                width="400"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
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
