"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DestinationCard } from "./DestinationCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  featuredDestinations: any[];
  /** Milliseconds between auto-advances. 0 disables autoplay. */
  autoplayInterval?: number;
}

const RESUME_DELAY = 6000;

export default function DestinationCarousel({
  featuredDestinations,
  autoplayInterval = 4000,
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
  const activeIndexRef = useRef(n);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Autoplay pauses while hovered / dragging / off-screen, and for a while after any user interaction.
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseAutoplay = () => {
    setIsUserPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => setIsUserPaused(false), RESUME_DELAY);
  };
  useEffect(() => () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  }, []);

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
    pauseAutoplay();
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

  // Cards slide in left-to-right, in view order, as the carousel scrolls into view.
  useEffect(() => {
    const container = carouselRef.current;
    if (!container || n === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Only the middle (visible) copy of the infinite-loop triple — the
      // other two copies sit off-scroll and would just waste stagger time.
      const visibleCards = Array.from(container.children).slice(n, n * 2);
      const tween = gsap.fromTo(
        visibleCards,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          paused: true,
        }
      );

      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: () => tween.play(),
        onEnterBack: () => tween.play(),
        onLeaveBack: () => tween.reverse(),
      });
    }, container);

    return () => ctx.revert();
  }, [n]);

  // Pause autoplay while the carousel is scrolled out of view.
  useEffect(() => {
    const container = carouselRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Autoplay: advance one card at a time; the loop realign keeps it endless.
  useEffect(() => {
    if (n === 0 || autoplayInterval <= 0 || isHovered || isUserPaused || !isInView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      if (dragState.current.isDown || document.hidden) return;
      scrollToExtendedIndex(activeIndexRef.current + 1, "smooth");
    }, autoplayInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, autoplayInterval, isHovered, isUserPaused, isInView]);

  // Only hijack pointer events for mouse (click-drag). Touch keeps native momentum scrolling.
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const container = carouselRef.current;
    if (!container) return;

    pauseAutoplay();
    dragState.current = {
      isDown: true,
      startX: event.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
      hasDragged: false,
    };
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const DRAG_THRESHOLD = 6;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const container = carouselRef.current;
    if (!container || !dragState.current.isDown) return;

    const x = event.pageX - container.offsetLeft;
    const walk = x - dragState.current.startX;

    if (!dragState.current.hasDragged) {
      if (Math.abs(walk) < DRAG_THRESHOLD) return;
      dragState.current.hasDragged = true;
      // Only hijack the pointer once an actual drag starts — capturing it on
      // every plain click suppresses the resulting click event on the card link.
      container.style.scrollBehavior = "auto";
      container.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    container.scrollLeft = dragState.current.scrollLeft - walk * 1.2;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const container = carouselRef.current;
    if (!container) return;

    dragState.current.isDown = false;
    container.style.scrollBehavior = "smooth";
    if (container.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={pauseAutoplay}
        onFocusCapture={() => setIsHovered(true)}
        onBlurCapture={() => setIsHovered(false)}
        onDragStart={handleDragStart}
        className="flex flex-row items-center overflow-x-auto gap-6 px-[10%] py-5 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "pan-x pan-y" }}
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
