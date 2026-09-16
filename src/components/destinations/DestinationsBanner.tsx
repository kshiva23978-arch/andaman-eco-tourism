"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Layered parallax banner for the destinations directory.
 *
 * Every element with `data-depth` is a layer: depth 0 is pinned to the page,
 * higher values move more — both as the page scrolls (ScrollTrigger scrub)
 * and as the pointer moves over the banner. The floating photo cards also
 * tilt in 3D toward the pointer.
 */

const FLOATING_CARDS = [
  {
    src: "/images/destinations/radhanagar.png",
    label: "Radhanagar Beach",
    className: "right-[6%] top-[10%] w-[34%] rotate-[-6deg] md:right-[16%] md:top-[9%] md:w-[240px] lg:w-[280px]",
    depth: 1.1,
  },
  {
    src: "/images/destinations/turtle.jpg",
    label: "Cuthbert Bay",
    className: "right-[38%] top-[38%] w-[28%] rotate-[5deg] md:right-[30%] md:top-[36%] md:w-[190px] lg:w-[220px]",
    depth: 1.6,
  },
  {
    src: "/images/destinations/coral-fish.jpg",
    label: "Jolly Buoy",
    className: "right-[4%] top-[58%] w-[30%] rotate-[3deg] md:right-[3%] md:top-[57%] md:w-[210px] lg:w-[240px]",
    depth: 2.1,
  },
];

export function DestinationsBanner({
  destinationCount,
  regionCount,
}: {
  destinationCount: number;
  regionCount: number;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", section);
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", section);
      const words = gsap.utils.toArray<HTMLElement>("[data-word]", section);
      const bg = section.querySelector<HTMLElement>("[data-bg]");
      const depthOf = (el: HTMLElement) => Number(el.dataset.depth ?? 0);

      // ---- Entrance --------------------------------------------------------
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .fromTo(bg, { scale: 1.18 }, { scale: 1.06, duration: 2.2, ease: "power2.out" }, 0)
        .fromTo(
          words,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08 },
          0.15
        )
        .fromTo("[data-fade]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, 0.5)
        .fromTo(
          cards,
          { y: 80, opacity: 0, rotateX: 18, scale: 0.9 },
          { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.3, stagger: 0.12, ease: "expo.out" },
          0.35
        )
        .fromTo("[data-foliage]", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, 0.4);

      if (reduceMotion) return;

      // ---- Scroll parallax: deeper layers travel further as the banner scrolls away.
      layers.forEach((layer) => {
        const depth = depthOf(layer);
        gsap.to(layer, {
          y: () => depth * 90,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
      gsap.to(bg, {
        scale: 1.18,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      // Text lifts and fades slightly faster than it scrolls so the hand-off to the grid feels light.
      gsap.to("[data-copy]", {
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: section, start: "40% top", end: "bottom top", scrub: true },
      });

      // ---- Pointer parallax + 3D tilt (mouse only) ------------------------
      const setters = layers.map((layer) => ({
        depth: depthOf(layer),
        x: gsap.quickTo(layer, "x", { duration: 1, ease: "power3.out" }),
        // `y` is owned by the scroll tween; use a separate transform channel for the pointer.
        yPercent: gsap.quickTo(layer, "yPercent", { duration: 1, ease: "power3.out" }),
      }));
      const tilts = cards.map((card) => ({
        rx: gsap.quickTo(card, "rotateX", { duration: 0.9, ease: "power3.out" }),
        ry: gsap.quickTo(card, "rotateY", { duration: 0.9, ease: "power3.out" }),
      }));
      const bgX = gsap.quickTo(bg, "x", { duration: 1.4, ease: "power3.out" });
      const bgY = gsap.quickTo(bg, "y", { duration: 1.4, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const rect = section.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        setters.forEach(({ depth, x, yPercent }) => {
          x(nx * depth * 22);
          yPercent(ny * depth * 4);
        });
        tilts.forEach(({ rx, ry }) => {
          rx(-ny * 14);
          ry(nx * 16);
        });
        bgX(nx * -18);
        bgY(ny * -14);
      };
      const onLeave = () => {
        setters.forEach(({ x, yPercent }) => {
          x(0);
          yPercent(0);
        });
        tilts.forEach(({ rx, ry }) => {
          rx(0);
          ry(0);
        });
        bgX(0);
        bgY(0);
      };
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);

      // Idle float so the cards never sit perfectly still.
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: `+=${8 + i * 3}`,
          duration: 3 + i * 0.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.4,
        });
      });

      return () => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[72vh] min-h-[560px] w-full overflow-hidden bg-primary text-white [perspective:1400px]"
    >
      {/* Background — depth 0 layer, drifts with the pointer and zooms on scroll */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          data-bg
          className="absolute -inset-[6%] bg-cover bg-center will-change-transform"
          style={{ backgroundImage: "url(/images/bg/beach.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/45 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-black/20" />
      </div>

      {/* Floating destination photos — mid/foreground depths */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block [transform-style:preserve-3d]">
        {FLOATING_CARDS.map((card) => (
          <div key={card.src} data-depth={card.depth} className={`absolute will-change-transform ${card.className}`}>
            <figure
              data-card
              className="overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-[0_30px_60px_-18px_rgba(0,0,0,0.6)] backdrop-blur-sm will-change-transform [transform-style:preserve-3d]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img src={card.src} alt="" className="h-full w-full object-cover" />
              </div>
              <figcaption className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold tracking-wide text-white/90">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {card.label}
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      {/* Copy */}
      <div className="relative z-10 flex h-full items-center">
        <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div data-copy data-depth={0.5} className="max-w-xl will-change-transform">
            <div data-fade className="mb-5 flex items-center gap-3 text-white/75">
              <span className="h-px w-10 bg-white/60" />
              <span className="font-label-md text-[11px] uppercase tracking-[0.3em]">
                Andaman &amp; Nicobar Islands
              </span>
            </div>

            <h1 className="hero-title text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              {["Destinations", "Directory"].map((word, i) => (
                <span key={word} className="block overflow-hidden">
                  <span data-word className={`inline-block will-change-transform ${i === 1 ? "text-emerald-200" : ""}`}>
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <p data-fade className="mt-5 max-w-md text-base text-white/85 md:text-lg">
              Every officially documented beach, reef, sanctuary and forest trail across the
              archipelago — explore them all, region by region.
            </p>

            <div data-fade className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[12px] font-semibold backdrop-blur">
                {destinationCount} destinations
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[12px] font-semibold backdrop-blur">
                {regionCount} regions
              </span>
              <Link
                href="#destinations-explorer"
                className="group ml-1 inline-flex items-center gap-2 font-label-md text-label-md text-white"
              >
                Start exploring
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-y-1">
                  arrow_downward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Foreground foliage — fastest layers */}
      <img
        data-foliage
        data-depth={2.6}
        src="/images/bg/branch.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 w-[220px] rotate-[12deg] opacity-90 drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)] will-change-transform md:-bottom-16 md:-left-8 md:w-[340px]"
      />
      <img
        data-foliage
        data-depth={1.9}
        src="/images/bg/leaf.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-8 w-[140px] rotate-[150deg] opacity-80 drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] will-change-transform md:w-[200px]"
      />
    </section>
  );
}
