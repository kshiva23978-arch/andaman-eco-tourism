"use client";

import { useEffect, useState } from "react";

const DEFAULT_PHOTOS = [
  "/images/illustrations/img-1.jpeg",
  "/images/illustrations/img-2.jpeg",
  "/images/illustrations/img-3.jpeg",
  "/images/illustrations/img-4.jpeg",
  "/images/illustrations/img-5.jpeg",
  "/images/illustrations/img-6.jpeg",
  "/images/illustrations/img-7.jpeg",
  "/images/illustrations/img-8.jpeg",
  "/images/illustrations/img-9.jpeg",
  "/images/illustrations/img-10.jpeg",
  "/images/illustrations/img-11.jpeg",
  "/images/illustrations/img-12.jpeg",
];

/** How often (ms) each card swaps to its next image. */
const IMAGE_SWITCH_INTERVAL = 10000;
/** How long (ms) the crossfade between images takes. */
const IMAGE_FADE_DURATION = 1200;

/** Splits a flat photo list into `slots` round-robin buckets, so each card cycles its own subset. */
function distribute(images: string[], slots: number): string[][] {
  const buckets: string[][] = Array.from({ length: slots }, () => []);
  images.forEach((img, i) => buckets[i % slots].push(img));
  return buckets.map((bucket) => (bucket.length > 0 ? bucket : images));
}

function Card({
  images,
  rotate,
  width,
  delay,
  startIndex = 0,
}: {
  images: string[];
  rotate: number;
  width: number;
  delay: number;
  startIndex?: number;
}) {
  const [index, setIndex] = useState(startIndex % images.length);
  const [showNext, setShowNext] = useState(false);
  const nextIndex = (index + 1) % images.length;

  useEffect(() => {
    if (images.length <= 1) return;

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setShowNext(true);
        setTimeout(() => {
          setIndex((current) => (current + 1) % images.length);
          setShowNext(false);
        }, IMAGE_FADE_DURATION);
      }, IMAGE_SWITCH_INTERVAL);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [images.length, delay]);

  const baseStyle = {
    width,
    height: width * 0.8,
    transform: `rotate(${rotate}deg)`,
    animationDelay: `${delay}s`,
  };

  return (
    <div className="relative opacity-50" style={{ width, height: width * 0.8 }}>
      <img
        src={images[index]}
        alt=""
        aria-hidden="true"
        className="animate-float absolute inset-0 rounded-2xl border-2 border-white object-cover shadow-lg"
        style={baseStyle}
      />
      <img
        src={images[nextIndex]}
        alt=""
        aria-hidden="true"
        className="animate-float absolute inset-0 rounded-2xl border-2 border-white object-cover shadow-lg"
        style={{
          ...baseStyle,
          opacity: showNext ? 1 : 0,
          transition: `opacity ${IMAGE_FADE_DURATION}ms ease`,
        }}
      />
    </div>
  );
}

interface FloatingPhotoStackProps {
  /** Which edge of the viewport to anchor to. */
  side: "left" | "right";
  /** Image paths to cycle through, shared across the 5 cards round-robin. Defaults to a stock illustration set. */
  images?: string[];
  /** Card width in px; height is derived at a 5:4 ratio. */
  cardWidth?: number;
  /** Tailwind breakpoint prefix at which the stack becomes visible, e.g. "xl" or "2xl". */
  showFrom?: "lg" | "xl" | "2xl";
  /** Extra classes, e.g. to nudge horizontal offset ("left-4" / "right-4"). */
  className?: string;
}

const SHOW_FROM_CLASS: Record<NonNullable<FloatingPhotoStackProps["showFrom"]>, string> = {
  lg: "lg:flex",
  xl: "xl:flex",
  "2xl": "2xl:flex",
};

export function FloatingPhotoStack({
  side,
  images = DEFAULT_PHOTOS,
  cardWidth = 140,
  showFrom = "xl",
  className = "",
}: FloatingPhotoStackProps) {
  const mirror = side === "right" ? -1 : 1;
  const [slot0, slot1, slot2, slot3, slot4] = distribute(images, 5);
  // Offset the right stack's starting frame so it never shows the same image as the left stack at the same moment.
  const startIndex = (bucket: string[]) => (side === "right" ? Math.floor(bucket.length / 2) : 0);

  return (
    <div
      className={`pointer-events-none fixed top-1/2 z-0 hidden -translate-y-1/2 flex-col items-center gap-3 opacity-90 ${SHOW_FROM_CLASS[showFrom]} ${
        side === "left" ? "left-2" : "right-2"
      } ${className}`}
    >
      <div className="flex gap-3">
        <Card images={slot0} rotate={-8 * mirror} width={cardWidth} delay={0} startIndex={startIndex(slot0)} />
        <Card images={slot1} rotate={8 * mirror} width={cardWidth} delay={0.6} startIndex={startIndex(slot1)} />
      </div>

      <Card images={slot4} rotate={-4 * mirror} width={cardWidth} delay={1.2} startIndex={startIndex(slot4)} />

      <div className="flex gap-3">
        <Card images={slot2} rotate={6 * mirror} width={cardWidth} delay={0.3} startIndex={startIndex(slot2)} />
        <Card images={slot3} rotate={-6 * mirror} width={cardWidth} delay={0.9} startIndex={startIndex(slot3)} />
      </div>
    </div>
  );
}
