"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { DestinationCard } from "./DestinationCard";

interface Props {
  featuredDestinations: any[];
}

export default function DestinationCarousel({
  featuredDestinations,
}: Props) {
  const n = featuredDestinations.length;
  const extendedDestinations =
    n > 0
      ? [...featuredDestinations, ...featuredDestinations, ...featuredDestinations]
      : [];

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, hasDragged: false });
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(n); // index into extendedDestinations

  const getCards = () => carouselRef.current?.children ?? null;

  const scrollToExtendedIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const cards = getCards();
    if (!cards || !cards[index]) return;

    setActiveIndex(index);
    (cards[index] as HTMLElement).scrollIntoView({
      behavior,
      inline: "center",
      block: "nearest",
    });
  };

  // Public-facing dot click: jump to the copy of `realIndex` nearest the current view.
  const scrollToIndex = (realIndex: number) => {
    if (n === 0) return;
    const candidates = [realIndex, realIndex + n, realIndex + 2 * n];
    const closest = candidates.reduce((best, candidate) =>
      Math.abs(candidate - activeIndex) < Math.abs(best - activeIndex) ? candidate : best
    );
    scrollToExtendedIndex(closest, "smooth");
  };

  const updateActiveIndex = () => {
    const container = carouselRef.current;
    if (!container) return null;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
    return closestIndex;
  };

  // After scrolling settles, silently re-centre into the middle copy so the loop never runs out.
  const realignLoop = (closestIndex: number) => {
    const container = carouselRef.current;
    const cards = getCards();
    if (!container || !cards || n === 0) return;

    let target: number | null = null;
    if (closestIndex < n) target = closestIndex + n;
    else if (closestIndex >= 2 * n) target = closestIndex - n;
    if (target === null) return;

    const from = cards[closestIndex] as HTMLElement;
    const to = cards[target] as HTMLElement;
    if (!from || !to) return;

    const shift = to.offsetLeft - from.offsetLeft;
    const previousBehavior = container.style.scrollBehavior;
    container.style.scrollBehavior = "auto";
    container.scrollLeft += shift;
    container.style.scrollBehavior = previousBehavior;
    setActiveIndex(target);
  };

  useLayoutEffect(() => {
    const container = carouselRef.current;
    if (!container || n === 0) return;

    // Start centred inside the middle copy, before first paint, so there is no visible jump on load.
    const cards = getCards();
    if (cards && cards[n]) {
      const previousBehavior = container.style.scrollBehavior;
      container.style.scrollBehavior = "auto";
      const el = cards[n] as HTMLElement;
      container.scrollLeft = el.offsetLeft + el.offsetWidth / 2 - container.clientWidth / 2;
      container.style.scrollBehavior = previousBehavior;
    }

    let ticking = false;
    const scheduleRealign = () => {
      const closest = updateActiveIndex();
      if (closest !== null) realignLoop(closest);
    };

    const supportsScrollEnd = "onscrollend" in window;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateActiveIndex();
          ticking = false;
        });
      }

      if (!supportsScrollEnd) {
        if (settleTimeout.current) clearTimeout(settleTimeout.current);
        settleTimeout.current = setTimeout(scheduleRealign, 150);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    if (supportsScrollEnd) {
      container.addEventListener("scrollend", scheduleRealign, { passive: true });
    }
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (supportsScrollEnd) {
        container.removeEventListener("scrollend", scheduleRealign);
      }
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = carouselRef.current;
    if (!container) return;

    container.style.scrollBehavior = "auto";
    dragState.current = {
      isDown: true,
      startX: event.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
      hasDragged: false,
    };
    container.setPointerCapture(event.pointerId);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const DRAG_THRESHOLD = 6;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = carouselRef.current;
    if (!container || !dragState.current.isDown) return;

    const x = event.pageX - container.offsetLeft;
    const walk = x - dragState.current.startX;

    if (!dragState.current.hasDragged) {
      if (Math.abs(walk) < DRAG_THRESHOLD) return;
      dragState.current.hasDragged = true;
    }

    event.preventDefault();
    container.scrollLeft = dragState.current.scrollLeft - walk * 1.2;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = carouselRef.current;
    if (!container) return;

    dragState.current.isDown = false;
    container.style.scrollBehavior = "smooth";
    container.releasePointerCapture(event.pointerId);
  };

  if (n === 0) return null;

  const realActiveIndex = ((activeIndex % n) + n) % n;

  return (
    <div className="relative w-full">
      <div
        ref={carouselRef}
        id="destination-carousel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
        onPointerCancel={stopDragging}
        onDragStart={handleDragStart}
        className="flex flex-row items-center overflow-x-auto gap-6 px-[10%] py-10 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "pan-y" }}
      >
        {extendedDestinations.map((destination, index) => (
          <DestinationCard
            key={`${destination.slug}-${index}`}
            destination={destination}
            variant="carousel"
            isActive={index === activeIndex}
            onExpand={() => scrollToExtendedIndex(index)}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {featuredDestinations.map((destination, index) => (
          <button
            key={destination.slug}
            type="button"
            aria-label={`View ${destination.title}`}
            onClick={() => scrollToIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === realActiveIndex
                ? "w-6 bg-primary"
                : "w-2.5 bg-primary/30 hover:bg-primary/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
