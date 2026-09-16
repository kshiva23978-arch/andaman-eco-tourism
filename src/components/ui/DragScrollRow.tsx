"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function DragScrollRow({
  children,
  className = "",
  loopCount,
  revealOnScroll = false,
  coverflow = false,
  settleToCenter = false,
  autoplayInterval = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Pass the real (pre-tripled) item count to enable infinite-loop scrolling.
   * Children must render three consecutive copies of the same set. */
  loopCount?: number;
  /** Fade each card in (opacity only, no position shift) as the row scrolls into view. */
  revealOnScroll?: boolean;
  /** Cinematic 3D arc: cards turn to face the centre and recede toward the edges as you scroll. */
  coverflow?: boolean;
  /** After scrolling stops, ease the nearest card into the centre (use instead of CSS scroll-snap). */
  settleToCenter?: boolean;
  /** Milliseconds between smooth auto-advances (0 = off). Pauses on hover, drag, hidden tab, off-screen. */
  autoplayInterval?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, hasDragged: false });
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DRAG_THRESHOLD = 6;

  const settleTween = useRef<gsap.core.Tween | null>(null);
  const hoverRef = useRef(false);
  const inViewRef = useRef(true);

  const getCards = () => containerRef.current?.children ?? null;

  const scrollLeftToCenter = (el: HTMLElement) => {
    const container = containerRef.current!;
    return el.offsetLeft + el.offsetWidth / 2 - container.clientWidth / 2;
  };

  /** Smoothly scroll so `index` sits in the centre, then re-seat the infinite loop. */
  const glideToIndex = (index: number, duration = 0.9) => {
    const container = containerRef.current;
    const cards = getCards();
    if (!container || !cards || !cards[index]) return;

    const target = scrollLeftToCenter(cards[index] as HTMLElement);
    if (Math.abs(target - container.scrollLeft) < 1) {
      realignLoop(index);
      return;
    }

    settleTween.current?.kill();
    container.style.scrollBehavior = "auto";
    settleTween.current = gsap.to(container, {
      scrollLeft: target,
      duration,
      ease: "power3.out",
      overwrite: true,
      onComplete: () => {
        settleTween.current = null;
        realignLoop(index);
      },
    });
  };

  const findClosestIndex = () => {
    const container = containerRef.current;
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

    return closestIndex;
  };

  const realignLoop = (closestIndex: number) => {
    const container = containerRef.current;
    const cards = getCards();
    if (!container || !cards || !loopCount) return;

    let target: number | null = null;
    if (closestIndex < loopCount) target = closestIndex + loopCount;
    else if (closestIndex >= 2 * loopCount) target = closestIndex - loopCount;
    if (target === null) return;

    const from = cards[closestIndex] as HTMLElement;
    const to = cards[target] as HTMLElement;
    if (!from || !to) return;

    const shift = to.offsetLeft - from.offsetLeft;
    const previousBehavior = container.style.scrollBehavior;
    container.style.scrollBehavior = "auto";
    container.scrollLeft += shift;
    container.style.scrollBehavior = previousBehavior;
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !loopCount) return;

    // Position instantly, before first paint, so there is no visible jump on load.
    const cards = getCards();
    if (cards && cards[loopCount]) {
      const previousBehavior = container.style.scrollBehavior;
      container.style.scrollBehavior = "auto";
      const el = cards[loopCount] as HTMLElement;
      container.scrollLeft = el.offsetLeft;
      container.style.scrollBehavior = previousBehavior;
    }

    const scheduleRealign = () => {
      // Ignore scroll events produced by our own glide or by an in-progress drag.
      if (settleTween.current || dragState.current.isDown) return;
      const closest = findClosestIndex();
      if (closest === null) return;
      if (settleToCenter) glideToIndex(closest, 0.8);
      else realignLoop(closest);
    };

    // Debounce ourselves rather than relying on `scrollend`, which is unreliable mid-tween.
    const handleScroll = () => {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      settleTimeout.current = setTimeout(scheduleRealign, settleToCenter ? 120 : 150);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      settleTween.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopCount, settleToCenter]);

  // Smooth autoplay: glide one card at a time.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || autoplayInterval <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => (inViewRef.current = entry.isIntersecting), { threshold: 0.3 })
        : null;
    observer?.observe(container);

    const tick = () => {
      if (hoverRef.current || !inViewRef.current || document.hidden) return;
      if (dragState.current.isDown || settleTween.current) return;
      const closest = findClosestIndex();
      if (closest !== null) glideToIndex(closest + 1, 1.1);
    };
    const interval = setInterval(tick, autoplayInterval);

    return () => {
      clearInterval(interval);
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplayInterval]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !revealOnScroll) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container.children,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: container, start: "top 90%" },
        }
      );
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealOnScroll]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !coverflow) return;

    const MAX_ROTATE = 38; // deg at the row edge (outer edge turns toward the viewer)
    const MAX_LIFT = 36; // px the row curves upward toward the edges
    const MAX_DEPTH = 180; // px pushed back at the row edge
    const MAX_DIM = 0.45; // brightness reduction at the row edge

    let frame = 0;
    const apply = () => {
      frame = 0;
      const center = container.scrollLeft + container.clientWidth / 2;
      const half = container.clientWidth / 2;
      Array.from(container.children).forEach((child) => {
        const el = child as HTMLElement;
        // -1 (left edge) .. 0 (centre) .. 1 (right edge)
        const offset = gsap.utils.clamp(-1, 1, (el.offsetLeft + el.offsetWidth / 2 - center) / half);
        const mag = Math.abs(offset);
        gsap.set(el, {
          rotateY: -offset * MAX_ROTATE,
          y: -mag * MAX_LIFT,
          z: -mag * MAX_DEPTH,
          scale: 1 - mag * 0.08,
          filter: `brightness(${1 - mag * MAX_DIM})`,
          transformPerspective: 1200,
          zIndex: Math.round((1 - mag) * 100),
        });
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    container.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      container.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [coverflow]);

  // Only hijack pointer events for mouse (click-drag). Touch keeps native momentum scrolling.
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const container = containerRef.current;
    if (!container) return;

    settleTween.current?.kill();
    settleTween.current = null;
    if (settleTimeout.current) clearTimeout(settleTimeout.current);
    container.style.scrollBehavior = "auto";
    dragState.current = {
      isDown: true,
      startX: event.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
      hasDragged: false,
    };
    container.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const container = containerRef.current;
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
    if (event.pointerType !== "mouse") return;
    const container = containerRef.current;
    if (!container) return;

    const wasDown = dragState.current.isDown;
    dragState.current.isDown = false;
    container.style.scrollBehavior = settleToCenter ? "auto" : "smooth";
    if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);

    // Release: ease into the nearest card instead of stopping dead / snapping.
    if (wasDown && settleToCenter) {
      const closest = findClosestIndex();
      if (closest !== null) glideToIndex(closest, 0.7);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerLeave={stopDragging}
      onPointerCancel={stopDragging}
      onDragStart={handleDragStart}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      className={`cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{
        touchAction: "pan-x pan-y",
        ...(coverflow ? { perspective: "1200px", transformStyle: "preserve-3d" } : {}),
      }}
    >
      {children}
    </div>
  );
}
