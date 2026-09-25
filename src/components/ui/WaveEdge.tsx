"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const WAVE_VIEW_WIDTH = 900;
const WAVE_VIEW_HEIGHT = 600;

const WAVE_PATH =
  "M0 534L5.3 539.7C10.7 545.3 21.3 556.7 32 559.3C42.7 562 53.3 556 64 553.2C74.7 550.3 85.3 550.7 96.2 544.8C107 539 118 527 128.8 522.8C139.7 518.7 150.3 522.3 161 524.5C171.7 526.7 182.3 527.3 193 527.8C203.7 528.3 214.3 528.7 225 535.3C235.7 542 246.3 555 257 557.2C267.7 559.3 278.3 550.7 289 548.5C299.7 546.3 310.3 550.7 321.2 546C332 541.3 343 527.7 353.8 521.2C364.7 514.7 375.3 515.3 386 522.3C396.7 529.3 407.3 542.7 418 547.3C428.7 552 439.3 548 450 542.8C460.7 537.7 471.3 531.3 482 529.7C492.7 528 503.3 531 514 531.7C524.7 532.3 535.3 530.7 546.2 526.7C557 522.7 568 516.3 578.8 513.3C589.7 510.3 600.3 510.7 611 516.7C621.7 522.7 632.3 534.3 643 541.5C653.7 548.7 664.3 551.3 675 551.2C685.7 551 696.3 548 707 545.7C717.7 543.3 728.3 541.7 739 538.7C749.7 535.7 760.3 531.3 771.2 526.3C782 521.3 793 515.7 803.8 522.5C814.7 529.3 825.3 548.7 836 551.3C846.7 554 857.3 540 868 530.7C878.7 521.3 889.3 516.7 894.7 514.3L900 512L900 601L894.7 601C889.3 601 878.7 601 868 601C857.3 601 846.7 601 836 601C825.3 601 814.7 601 803.8 601C793 601 782 601 771.2 601C760.3 601 749.7 601 739 601C728.3 601 717.7 601 707 601C696.3 601 685.7 601 675 601C664.3 601 653.7 601 643 601C632.3 601 621.7 601 611 601C600.3 601 589.7 601 578.8 601C568 601 557 601 546.2 601C535.3 601 524.7 601 514 601C503.3 601 492.7 601 482 601C471.3 601 460.7 601 450 601C439.3 601 428.7 601 418 601C407.3 601 396.7 601 386 601C375.3 601 364.7 601 353.8 601C343 601 332 601 321.2 601C310.3 601 299.7 601 289 601C278.3 601 267.7 601 257 601C246.3 601 235.7 601 225 601C214.3 601 203.7 601 193 601C182.3 601 171.7 601 161 601C150.3 601 139.7 601 128.8 601C118 601 107 601 96.2 601C85.3 601 74.7 601 64 601C53.3 601 42.7 601 32 601C21.3 601 10.7 601 5.3 601L0 601Z";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A soft wave-style divider, meant to sit absolutely at the bottom of a hero
 * image so the section below appears to ripple in underneath it. The wave
 * gently "breathes" in place — this particular path's left and right edges
 * don't line up, so it can't be tiled/scrolled without a visible seam.
 */
export function WaveEdge({
  className = "",
  colorClassName = "text-surface",
  zIndexClassName = "z-20",
}: {
  className?: string;
  colorClassName?: string;
  /** Stacking order — pass something below the hero copy's z-index (e.g. "z-0") to tuck the wave behind the text but above the background image. */
  zIndexClassName?: string;
}) {
  const groupRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group || prefersReducedMotion()) return;

    gsap.set(group, { transformOrigin: "50% 100%" });
    const tween = gsap.to(group, {
      scaleY: 1.12,
      skewX: 1.5,
      duration: 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <svg
      className={`absolute bottom-0 left-0 h-16 w-full md:h-28 overflow-hidden ${zIndexClassName} ${colorClassName} ${className}`}
      viewBox={`0 ${WAVE_VIEW_HEIGHT - 90} ${WAVE_VIEW_WIDTH} 90`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g ref={groupRef}>
        <path d={WAVE_PATH} fill="currentColor" />
      </g>
    </svg>
  );
}
