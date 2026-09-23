"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function SectionHeading({
  icon,
  iconColor = "text-primary",
  children,
  description,
  className = "",
  tone = "light",
}: {
  icon: string;
  iconColor?: string;
  children: ReactNode;
  description?: string;
  className?: string;
  /** "dark" renders white text for use on photographic backgrounds. */
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { opacity: 0, y: -28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="mb-8">
      <h2
        className={`font-headline-lg text-headline-lg flex items-center gap-3 ${
          isDark ? "text-white" : ""
        } ${className}`}
      >
        <span className={`material-symbols-outlined ${isDark ? "text-white" : iconColor}`}>
          {icon}
        </span>
        {children}
      </h2>
      {description ? (
        <p
          className={`mt-3 font-body-md text-body-md max-w-2xl ${
            isDark ? "text-white/75" : "text-on-surface-variant"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
