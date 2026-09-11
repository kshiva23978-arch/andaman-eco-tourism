"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ParallaxBackground({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = layerRef.current;
    const section = el?.parentElement?.parentElement;
    if (!el || !section) return;

    const tween = gsap.fromTo(
      el,
      { yPercent: -14 },
      {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        ref={layerRef}
        className={`absolute -inset-x-0 -top-[15%] -bottom-[15%] bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
}
