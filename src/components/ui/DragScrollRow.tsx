"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

export function DragScrollRow({
  children,
  className = "",
  loopCount,
}: {
  children: ReactNode;
  className?: string;
  /** Pass the real (pre-tripled) item count to enable infinite-loop scrolling.
   * Children must render three consecutive copies of the same set. */
  loopCount?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, hasDragged: false });
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DRAG_THRESHOLD = 6;

  const getCards = () => containerRef.current?.children ?? null;

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
      const closest = findClosestIndex();
      if (closest !== null) realignLoop(closest);
    };

    const supportsScrollEnd = "onscrollend" in window;

    const handleScroll = () => {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      if (!supportsScrollEnd) {
        settleTimeout.current = setTimeout(scheduleRealign, 150);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    if (supportsScrollEnd) {
      container.addEventListener("scrollend", scheduleRealign, { passive: true });
    }
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (supportsScrollEnd) {
        container.removeEventListener("scrollend", scheduleRealign);
      }
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopCount]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
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

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
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
    const container = containerRef.current;
    if (!container) return;

    dragState.current.isDown = false;
    container.style.scrollBehavior = "smooth";
    container.releasePointerCapture(event.pointerId);
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
      className={`cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      {children}
    </div>
  );
}
