"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reveals its direct children row by row as the grid scrolls into view,
 * using GSAP's grid-aware stagger so each row animates together instead of
 * one diagonal wave across every card. `columns` maps each breakpoint to
 * the actual column count so the row grouping matches the CSS grid.
 */
export function GridReveal({
  as: Tag = "div",
  className = "",
  children,
  columns = { base: 1, sm: 2, lg: 3 },
  y = 32,
  each = 0.12,
  duration = 0.7,
  start = "top 85%",
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  columns?: { base: number; sm?: number; lg?: number };
  y?: number;
  each?: number;
  duration?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(el.children) as HTMLElement[];
      const mm = gsap.matchMedia();

      mm.add(
        {
          isLg: "(min-width: 1024px)",
          isSm: "(min-width: 640px) and (max-width: 1023px)",
          isBase: "(max-width: 639px)",
        },
        (context) => {
          const conditions = context.conditions as {
            isLg: boolean;
            isSm: boolean;
            isBase: boolean;
          };
          const cols = conditions.isLg
            ? columns.lg ?? 3
            : conditions.isSm
            ? columns.sm ?? 2
            : columns.base;
          const rows = Math.ceil(cards.length / cols);

          // Built as a paused tween + explicit ScrollTrigger callbacks rather
          // than the `scrollTrigger` tween shorthand: when the trigger's
          // start point is already behind the initial scroll position (e.g.
          // a grid sitting just below a short hero, already on screen at
          // load), the shorthand snaps the tween to match that scroll
          // distance instead of actually playing it — cards would appear
          // already revealed, barely animating. Calling .play()/.reverse()
          // from onEnter/onLeaveBack always runs the full animation.
          const tween = gsap.fromTo(
            cards,
            { y, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration,
              ease: "power3.out",
              stagger: { each, grid: [rows, cols], from: "start", axis: "y" },
              paused: true,
            }
          );

          ScrollTrigger.create({
            trigger: el,
            start,
            onEnter: () => tween.play(),
            onEnterBack: () => tween.play(),
            onLeaveBack: () => tween.reverse(),
          });
        }
      );

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [columns, y, each, duration, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
