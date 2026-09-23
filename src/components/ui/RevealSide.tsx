"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveals its direct children by sliding them in from alternating sides
 * (even index from the left, odd from the right) as each one scrolls into
 * view individually — used for glass card grids/rows.
 */
export function RevealSide({
  as: Tag = "div",
  className = "",
  style,
  children,
  x = 64,
  duration = 0.9,
  stagger = 0.1,
  start = "top 88%",
}: {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Distance (px) children travel in from the side while fading in. */
  x?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(el.children) as HTMLElement[];

      cards.forEach((card, i) => {
        const tween = gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -x : x },
          {
            opacity: 1,
            x: 0,
            duration,
            delay: (i % 2) * stagger,
            ease: "power3.out",
            paused: true,
          }
        );

        ScrollTrigger.create({
          trigger: card,
          start,
          onEnter: () => tween.play(),
          onEnterBack: () => tween.play(),
          onLeaveBack: () => tween.reverse(),
        });
      });
    }, el);

    return () => ctx.revert();
  }, [x, duration, stagger, start]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
