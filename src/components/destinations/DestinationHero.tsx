"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/ui/ScrollReveal";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Destination detail hero — Ken Burns + scroll parallax on the photo and a
 * masked title reveal, mirroring the interactive banner used on the
 * destinations directory.
 */
export function DestinationHero({
  title,
  image,
  imagePosition = "center",
  breadcrumbs,
  scrollTargetId = "destination-overview",
}: {
  title: string;
  image: string;
  /** CSS object-position for the hero photo — useful when a source image is
   * portrait-oriented and the default center crop lands on a busy, illegible
   * patch (e.g. close-up sand texture) rather than the recognizable scene. */
  imagePosition?: string;
  breadcrumbs?: Crumb[];
  scrollTargetId?: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const fades = gsap.utils.toArray<HTMLElement>("[data-fade]", section);

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(bg, { scale: 1.16 }, { scale: 1.05, duration: 2.4, ease: "power2.out" }, 0)
        .fromTo(fades, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, 0.4);

      if (reduced) return;

      gsap.to(bg, {
        scale: 1.16,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to("[data-copy]", {
        y: -30,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: { trigger: section, start: "35% top", end: "bottom top", scrub: true },
      });

      const bgX = gsap.quickTo(bg, "x", { duration: 1.4, ease: "power3.out" });
      const bgY = gsap.quickTo(bg, "y", { duration: 1.4, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const rect = section.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        bgX(nx * -16);
        bgY(ny * -12);
      };
      const onLeave = () => {
        bgX(0);
        bgY(0);
      };
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);

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
      className="relative h-[320px] md:h-[380px] w-full overflow-hidden bg-primary text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="absolute -inset-[6%] will-change-transform">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover"
            style={{ objectPosition: imagePosition }}
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,43,30,0.15) 0%, rgba(15,43,30,0.1) 35%, rgba(15,43,30,0.65) 78%, rgba(15,43,30,0.9) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/[0.35] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center pb-10 px-margin-mobile text-center md:px-margin-desktop">
        <div className="max-w-container-max mx-auto w-full">
          <div data-copy className="will-change-transform">
            <RevealText
              as="h1"
              className="text-white text-4xl md:text-[56px] md:leading-[1.05] font-semibold"
              style={{ fontFamily: "var(--font-fraunces), serif", letterSpacing: "-0.01em" }}
              stagger={0.04}
              start="top 95%"
            >
              {title}
            </RevealText>

            {breadcrumbs ? (
              <div data-fade className="mt-5 flex justify-center">
                <Breadcrumbs items={breadcrumbs} tone="dark" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <a
        href={`#${scrollTargetId}`}
        aria-label="Scroll to overview"
        className="group absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-white"
      >
        <span className="font-label-md text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="material-symbols-outlined animate-bounce text-[20px] transition-transform">
          expand_more
        </span>
      </a>

      {/* Tideline divider — draws in, then fills, on load */}
      <div className="absolute inset-x-0 bottom-[-2px] z-[1] leading-none">
        <svg viewBox="0 0 1400 130" preserveAspectRatio="none" className="block h-16 w-full md:h-24">
          <path
            className="tide-fill"
            d="M0,60 C120,20 260,90 420,55 C580,20 700,80 860,50 C1020,20 1160,85 1400,45 L1400,130 L0,130 Z"
            fill="var(--paper, #faf9f4)"
          />
          <path
            className="tide-path"
            d="M0,60 C120,20 260,90 420,55 C580,20 700,80 860,50 C1020,20 1160,85 1400,45"
            fill="none"
            stroke="var(--paper, #faf9f4)"
            strokeWidth={3}
          />
        </svg>
      </div>
    </section>
  );
}
