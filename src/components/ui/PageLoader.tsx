"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const EYEBROW = "ANDAMAN & NICOBAR";

export function PageLoader() {
  const pathname = usePathname();
  // Every navigation — not just the first load — replays the loader, so it's
  // shown on every page rather than only once per session. Keying by pathname
  // remounts it with fresh state instead of resetting state inside an effect.
  return <PageLoaderOverlay key={pathname} />;
}

function PageLoaderOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let hideTimer: number | undefined;
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
      hideTimer = window.setTimeout(() => setIsVisible(false), 500);
    }, 2500);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const rootRef = useRef<HTMLDivElement | null>(null);

  // Re-run the draw-in animation each time the loader is (re)shown, since its
  // DOM (and therefore stroke lengths etc.) is freshly mounted per visit.
  useEffect(() => {
    if (!isVisible) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const leaf = root.querySelector<SVGPathElement>("[data-leaf-path]");
      const vein = root.querySelector<SVGPathElement>("[data-leaf-vein]");
      const ring = root.querySelector<SVGCircleElement>("[data-ring]");
      const chars = root.querySelectorAll<HTMLElement>("[data-eyebrow-char]");
      const title = root.querySelector<HTMLElement>("[data-title]");
      const bar = root.querySelector<HTMLElement>("[data-bar]");

      if (leaf) {
        const len = leaf.getTotalLength();
        gsap.set(leaf, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(leaf, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" });
        gsap.fromTo(leaf, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.6, delay: 0.9, ease: "power1.out" });
      }
      if (vein) {
        const len = vein.getTotalLength();
        gsap.set(vein, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(vein, { strokeDashoffset: 0, duration: 0.7, delay: 0.5, ease: "power2.out" });
      }
      if (ring) {
        gsap.fromTo(
          ring,
          { scale: 0.6, opacity: 0, transformOrigin: "50% 50%" },
          { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }
        );
        gsap.to(ring, {
          scale: 1.18,
          opacity: 0,
          duration: 1.6,
          repeat: -1,
          ease: "power1.out",
          delay: 1.2,
          transformOrigin: "50% 50%",
        });
      }
      gsap.fromTo(
        chars,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, delay: 1.1, ease: "power2.out" }
      );
      if (title) {
        gsap.fromTo(title, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 1.35, ease: "power2.out" });
      }
      if (bar) {
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 2.2, ease: "power1.inOut", transformOrigin: "0% 50%" });
      }
    }, root);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="Loading"
      style={{ background: "#faf9f4" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 40%, rgba(31,77,52,0.08), transparent 60%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle
              data-ring
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#2c6146"
              strokeWidth="1.5"
              opacity="0.5"
            />
          </svg>
          {/* Sprouting leaf mark */}
          <svg viewBox="0 0 64 64" className="relative h-12 w-12" aria-hidden="true">
            <path
              data-leaf-path
              d="M32 58C32 58 14 48 14 28C14 14 32 6 32 6C32 6 50 14 50 28C50 48 32 58 32 58Z"
              fill="#1f4d34"
              fillOpacity="0"
              stroke="#1f4d34"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              data-leaf-vein
              d="M32 54V14"
              fill="none"
              stroke="#f3ecd9"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="mb-2 flex gap-[0.14em] text-[11px] font-semibold tracking-[0.32em]" style={{ color: "#2c6146" }}>
          {EYEBROW.split("").map((ch, i) => (
            <span key={i} data-eyebrow-char className="inline-block">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </p>

        <p
          data-title
          className="mb-5 text-[22px] font-semibold"
          style={{ fontFamily: "var(--font-fraunces, serif)", color: "#132018" }}
        >
          Ecotourism
        </p>

        <span className="h-[3px] w-40 overflow-hidden rounded-full" style={{ background: "rgba(19,32,24,0.12)" }}>
          <span
            data-bar
            className="block h-full w-full origin-left rounded-full"
            style={{ background: "linear-gradient(90deg, #2c6146, #2e8b82)" }}
          />
        </span>
      </div>
    </div>
  );
}
