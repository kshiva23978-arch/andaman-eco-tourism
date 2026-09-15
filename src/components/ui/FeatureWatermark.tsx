"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Faint decorative illustration for AlternatingFeatureSection. Drifts in and
 * fades up as its section scrolls into view, then floats gently in place.
 */
export function FeatureWatermark({
  src,
  size,
  opacity,
  positionClass,
  index = 0,
}: {
  src: string;
  size: number;
  /** Final opacity, 0-1. */
  opacity: number;
  positionClass: string;
  /** Used to stagger multiple watermarks in the same section. */
  index?: number;
}) {
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.closest("section");
    if (!el || !section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(el, { opacity });
      return;
    }

    const fromLeft = positionClass.includes("left-0");
    const fromTop = positionClass.includes("top-0");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      tl.fromTo(
        el,
        {
          opacity: 0,
          x: fromLeft ? -40 : 40,
          y: fromTop ? -30 : 30,
          rotate: fromLeft ? -6 : 6,
          scale: 0.9,
        },
        {
          opacity,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.4,
          delay: index * 0.15,
          ease: "power3.out",
        }
      ).to(el, {
        y: fromTop ? 10 : -10,
        rotate: fromLeft ? 2 : -2,
        duration: 3.5 + index * 0.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [opacity, positionClass, index]);

  return (
    <Image
      ref={ref}
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`absolute hidden w-auto object-contain pointer-events-none will-change-transform md:block ${positionClass}`}
      style={{ height: size, opacity: 0 }}
    />
  );
}
