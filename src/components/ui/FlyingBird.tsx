"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Decorative bird+branch that lifts off and tilts as if taking flight
 * while the page scrolls, then settles back once scrolling stops.
 */
export function FlyingBird() {
  const [isFlying, setIsFlying] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleScroll() {
      setIsFlying(true);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsFlying(false);
      }, 350);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 top-1/2 z-10 hidden -translate-y-1/2 pl-4 xl:block"
      style={{ width: 220, height: 260 }}
    >
      <div
        style={{
          transform: isFlying
            ? "translate(18px, -70px) rotate(-10deg) scale(1.04)"
            : "translate(0, 0) rotate(0deg) scale(1)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)",
        }}
      >
        <Image
          src="/bird-on-branch.png"
          alt="A bird perched on a branch"
          width={220}
          height={260}
          className="object-contain opacity-85"
          style={{
            filter: isFlying
              ? "drop-shadow(0 30px 18px rgba(0,0,0,0.16))"
              : "drop-shadow(0 6px 8px rgba(0,0,0,0.12))",
            transition: "filter 0.3s ease",
          }}
          priority
        />
      </div>
    </div>
  );
}
