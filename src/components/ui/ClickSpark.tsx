"use client";

import { useEffect } from "react";
import gsap from "gsap";

const LEAF_COUNT = 6;
const LEAF_SRC = "/images/illustrations/leaf.png";
const FALL_DISTANCE = 90;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Scatters a handful of leaves at the click point, anywhere on the site,
 * which drift and sway downward before fading out. Purely decorative —
 * skipped for reduced-motion and non-primary clicks.
 */
export function ClickSpark() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0) return;

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = `${event.clientX}px`;
      container.style.top = `${event.clientY}px`;
      container.style.width = "0px";
      container.style.height = "0px";
      container.style.zIndex = "9999";
      container.style.pointerEvents = "none";
      document.body.appendChild(container);

      for (let i = 0; i < LEAF_COUNT; i++) {
        const size = randomBetween(14, 22);
        const leaf = document.createElement("img");
        leaf.src = LEAF_SRC;
        leaf.alt = "";
        leaf.style.position = "absolute";
        leaf.style.left = `${-size / 2}px`;
        leaf.style.top = `${-size / 2}px`;
        leaf.style.width = `${size}px`;
        leaf.style.height = "auto";
        leaf.style.willChange = "transform, opacity";
        container.appendChild(leaf);

        const startAngle = randomBetween(-25, 25);
        const drift = randomBetween(-50, 50);
        const fall = FALL_DISTANCE + randomBetween(-10, 30);
        const spin = randomBetween(140, 320) * (Math.random() < 0.5 ? -1 : 1);
        const duration = randomBetween(0.9, 1.4);

        const midX = drift * 0.5 + randomBetween(-16, 16);

        const tl = gsap.timeline({ onComplete: () => leaf.remove() });
        tl.fromTo(leaf, { scale: 0.6, opacity: 1 }, { scale: 1, duration: 0.15, ease: "power1.out" }, 0)
          .fromTo(
            leaf,
            { x: 0, y: 0, rotate: startAngle },
            { x: midX, y: fall * 0.55, rotate: startAngle + spin * 0.5, ease: "sine.inOut", duration: duration * 0.5 },
            0
          )
          .to(
            leaf,
            { x: drift, y: fall, rotate: startAngle + spin, ease: "sine.in", duration: duration * 0.5 },
            duration * 0.5
          )
          .to(leaf, { opacity: 0, duration: 0.4, ease: "power1.in" }, duration - 0.35);
      }

      gsap.delayedCall(2, () => container.remove());
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
