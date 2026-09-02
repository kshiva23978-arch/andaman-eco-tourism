"use client";

import { useRef } from "react";
import { DestinationCard } from "./DestinationCard";

interface Props {
  featuredDestinations: any[];
}

export default function DestinationCarousel({
  featuredDestinations,
}: Props) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const scrollToIndex = (index: number) => {
    const container = document.getElementById("destination-carousel");
    const cards = container?.children;

    if (container && cards && cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = carouselRef.current;
    if (!container) return;

    dragState.current = {
      isDown: true,
      startX: event.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
    };
    container.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = carouselRef.current;
    if (!container || !dragState.current.isDown) return;

    event.preventDefault();
    const x = event.pageX - container.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.2;
    container.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = carouselRef.current;
    if (!container) return;

    dragState.current.isDown = false;
    container.releasePointerCapture(event.pointerId);
  };

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
        className="flex flex-row overflow-x-auto gap-gutter pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "pan-y" }}
      >
        {featuredDestinations.map((destination) => (
          <DestinationCard
            key={destination.slug}
            destination={destination}
            variant="carousel"
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
            className="h-2.5 w-2.5 rounded-full transition-all duration-200 bg-primary/30 hover:bg-primary/60"
          />
        ))}
      </div>
    </div>
  );
}