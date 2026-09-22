"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chip } from "@/components/ui/Chip";
import { RevealText } from "@/components/ui/ScrollReveal";
import { TornEdge } from "@/components/ui/TornEdge";

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
  region,
  overview,
  image,
  scrollTargetId = "destination-overview",
}: {
  title: string;
  region: string;
  overview: string;
  image: string;
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
      className="relative h-[560px] md:h-[640px] w-full overflow-hidden bg-primary text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="absolute -inset-[6%] will-change-transform">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex h-full items-end pb-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto w-full">
          <div data-copy className="will-change-transform">
            <div data-fade>
              <Chip variant="glass" className="mb-4">
                {region}
              </Chip>
            </div>

            <RevealText
              as="h1"
              className="font-headline-xl text-white mb-4 text-4xl md:text-[56px] md:leading-[1.05]"
              stagger={0.04}
              start="top 95%"
            >
              {title}
            </RevealText>

            <p data-fade className="font-body-lg text-white/90 max-w-2xl text-lg md:text-[22px] text-justify">
              {overview}
            </p>
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

      <TornEdge colorClassName="text-surface-container-high" />
    </section>
  );
}
