"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RevealSide } from "@/components/ui/RevealSide";

export interface ActivityGuideSectionProps {
  href: string;
  image: string;
  imageAlt: string;
  icon: string;
  title: string;
  duration?: string;
  difficulty?: string;
  body: string;
  bullets?: string[];
  callout?: string;
  reverse?: boolean;
  /** "dark" = forest-deep section with sand text; "light" = paper section with ink text. */
  tone?: "light" | "dark";
}

/**
 * Alternating activity guide row — a photo on one side, a glass-styled
 * write-up on the other. Both panels slide in from their own side as the
 * section scrolls into view.
 */
export function ActivityGuideSection({
  href,
  image,
  imageAlt,
  icon,
  title,
  duration,
  difficulty,
  body,
  bullets,
  callout,
  reverse = false,
  tone = "light",
}: ActivityGuideSectionProps) {
  const isDark = tone === "dark";
  const glowRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const glow = glowRef.current;
    if (!glow) return;
    const rect = event.currentTarget.getBoundingClientRect();
    glow.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
    glow.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
  };

  const imagePanel = (
    <div className={`order-1 ${reverse ? "lg:order-2" : "lg:order-1"}`}>
      <Link
        href={href}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[28px] shadow-[0_28px_56px_-24px_rgba(15,43,30,0.35)]"
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/[0.14] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
          {title}
        </span>
      </Link>
    </div>
  );

  const contentPanel = (
    <div className={`order-2 ${reverse ? "lg:order-1" : "lg:order-2"}`}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {duration ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold ${
              isDark ? "bg-white/[0.08] text-white/85" : "bg-[var(--sand)] text-[var(--ink-soft)]"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {duration}
          </span>
        ) : null}
        {difficulty ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold ${
              isDark ? "bg-white/[0.08] text-white/85" : "bg-[var(--sand)] text-[var(--ink-soft)]"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {difficulty}
          </span>
        ) : null}
      </div>

      <h3
        className={`mb-4 text-[clamp(1.6rem,3vw,2.1rem)] leading-tight font-semibold ${
          isDark ? "text-[var(--sand)]" : "text-[var(--ink)]"
        }`}
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        <Link href={href} className="hover:underline">
          {title}
        </Link>
      </h3>

      <p
        className={`mb-6 text-[15px] leading-relaxed text-justify ${
          isDark ? "text-white/90" : "text-[var(--ink-soft)]"
        }`}
      >
        {body}
      </p>

      {bullets && bullets.length > 0 ? (
        <ul className="mb-6 flex flex-col gap-2.5">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className={`flex items-start gap-2.5 text-[14px] leading-snug ${
                isDark ? "text-white/85" : "text-[var(--ink)]"
              }`}
            >
              <span
                className="material-symbols-outlined mt-0.5 text-[16px] flex-shrink-0"
                style={{ color: "var(--lagoon)" }}
              >
                check_circle
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}

      {callout ? (
        <div
          className={`mb-6 rounded-xl border-l-4 px-5 py-4 text-[13.5px] italic leading-relaxed text-justify ${
            isDark
              ? "border-[var(--lagoon-light)] bg-white/[0.09] text-white/95"
              : "border-[var(--lagoon)] bg-[var(--sand)] text-[var(--ink-soft)]"
          }`}
        >
          {callout}
        </div>
      ) : null}

      <Link
        href={href}
        className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-semibold transition-all hover:-translate-y-0.5 ${
          isDark
            ? "bg-[var(--lagoon)] text-white hover:bg-[var(--forest-mid)] hover:shadow-lg"
            : "bg-[var(--forest-deep)] text-white hover:bg-[var(--forest-mid)] hover:shadow-lg"
        }`}
      >
        View Full Guide
        <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
          arrow_forward
        </span>
      </Link>
    </div>
  );

  return (
    <section
      onPointerMove={handlePointerMove}
      className={`group/glow relative overflow-hidden py-16 md:py-20 ${isDark ? "bg-[var(--forest-deep)]" : "bg-[var(--paper)]"}`}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          background: `radial-gradient(500px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${
            isDark ? "rgba(127,196,184,0.16)" : "rgba(44,97,70,0.08)"
          }, transparent 70%)`,
        }}
      />
      <RevealSide
        as="div"
        className="mx-auto grid max-w-container-max grid-cols-1 items-center gap-10 px-margin-mobile md:px-margin-desktop lg:grid-cols-2 lg:gap-16"
        x={64}
      >
        {reverse ? contentPanel : imagePanel}
        {reverse ? imagePanel : contentPanel}
      </RevealSide>
    </section>
  );
}
