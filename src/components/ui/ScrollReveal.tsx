"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef } from "react";
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
 * Fades its direct children up into view as they scroll in, staggered.
 * Wrap a chip + heading + link group to reveal them one after another.
 */
export function ScrollReveal({
  as: Tag = "div",
  className = "",
  children,
  y = 28,
  stagger = 0.12,
  duration = 0.8,
  start = "top 85%",
  delay = 0,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Distance (px) children travel up while fading in. */
  y?: number;
  stagger?: number;
  duration?: number;
  /** ScrollTrigger start position. */
  start?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, stagger, duration, start, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Recursively wraps every word in its own masked span so it can be animated,
 * preserving nested elements (e.g. accent-coloured spans).
 */
function splitWords(node: ReactNode, keyPrefix = "w"): ReactNode {
  return Children.map(node, (child, index) => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child)
        .split(/(\s+)/)
        .map((part, i) =>
          part.trim() === "" ? (
            part
          ) : (
            <span
              key={`${keyPrefix}-${index}-${i}`}
              className="inline-block overflow-hidden align-bottom"
            >
              <span data-reveal-word className="inline-block">
                {part}
              </span>
            </span>
          )
        );
    }

    if (isValidElement<{ children?: ReactNode }>(child)) {
      return cloneElement(
        child,
        undefined,
        splitWords(child.props.children, `${keyPrefix}-${index}`)
      );
    }

    return child;
  });
}

/**
 * Word-by-word text reveal: each word slides up from behind a clipping mask
 * as the element scrolls into view. Nested spans (accent colours) are kept.
 */
export function RevealText({
  as: Tag = "h2",
  className = "",
  style,
  children,
  stagger = 0.05,
  duration = 0.9,
  start = "top 85%",
  delay = 0,
}: {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  stagger?: number;
  duration?: number;
  start?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-reveal-word]"),
        { yPercent: 110, opacity: 0, rotate: 4 },
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration,
          delay,
          ease: "power4.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, duration, start, delay]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {splitWords(children)}
    </Tag>
  );
}
