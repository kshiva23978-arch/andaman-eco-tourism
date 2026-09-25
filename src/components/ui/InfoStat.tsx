"use client";

import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import gsap from "gsap";
import { firstClause } from "@/lib/format";

type InfoStatColor = "primary" | "secondary" | "error";

const colorClasses: Record<InfoStatColor, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  error: "text-error",
};

const colorClassesGlass: Record<InfoStatColor, string> = {
  primary: "text-white",
  secondary: "text-secondary-container",
  error: "text-red-300",
};

export function InfoStat({
  label,
  value,
  color = "primary",
  maxLength = 64,
  tone = "light",
}: {
  label: string;
  value: string;
  color?: InfoStatColor;
  maxLength?: number;
  /** "glass" renders a frosted card for use on photographic backgrounds. */
  tone?: "light" | "glass";
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = firstClause(value, maxLength);
  const isTruncated = preview !== value.trim();

  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleEnter = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, { y: -6, scale: 1.02, duration: 0.35, ease: "power3.out", overwrite: "auto" });
  };

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, { rotateX: -ny * 8, rotateY: nx * 10, duration: 0.4, ease: "power3.out", overwrite: "auto" });
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, { y: 0, scale: 1, rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };

  const isGlass = tone === "glass";

  return (
    <div
      ref={cardRef}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`p-5 rounded-2xl will-change-transform [transform-style:preserve-3d] transition-shadow duration-300 ${
        isGlass
          ? "glass-panel hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
          : "border border-outline-variant bg-surface-container-lowest hover:shadow-xl hover:border-primary/30"
      }`}
      style={{ perspective: 800 }}
    >
      <span
        className={`font-label-md uppercase text-[10px] tracking-widest block mb-1 ${
          isGlass ? "text-white/70" : "text-on-surface-variant"
        }`}
      >
        {label}
      </span>
      <p
        className={`font-sans font-semibold text-[clamp(0.9rem,3.2vw,1.1rem)] leading-snug break-words ${
          isGlass ? colorClassesGlass[color] : colorClasses[color]
        }`}
      >
        {expanded ? value : preview}
      </p>
      {isTruncated ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={`mt-2 inline-flex items-center gap-1 font-label-md text-[12px] ${
            isGlass ? "text-white" : "text-primary"
          }`}
        >
          <span className="group">
            <span className="group-hover:underline underline-offset-2">
              {expanded ? "Read less" : "Read more"}
            </span>
          </span>

          <span className="material-symbols-outlined text-[16px]">
            {expanded ? "expand_less" : "expand_more"}
          </span>
        </button>
      ) : null}
    </div>
  );
}
