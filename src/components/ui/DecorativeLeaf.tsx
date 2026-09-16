"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DecorativeLeafProps {
  className?: string;
  rotate?: number;
  flip?: boolean;
  size?: number;
  opacity?: number;
  /** Animate a slow, swaying fall from where the leaf is placed (default on). */
  fall?: boolean;
  /** Seconds for one full fall before the leaf resets. */
  duration?: number;
  /** How far (px) the leaf drops over one fall. */
  distance?: number;
  /** Stagger leaves on the same page so they don't move in unison. */
  delay?: number;
}

export function DecorativeLeaf({
  className = "",
  rotate = 0,
  flip = false,
  size = 140,
  opacity = 0.18,
  fall = true,
  duration = 14,
  distance = 220,
  delay = 0,
}: DecorativeLeafProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !fall) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // The drop is centred on where the leaf is placed, so leaves anchored to a section's
      // bottom edge stay visible for most of the fall instead of leaving the section at once.
      const startY = -distance * 0.55;
      const endY = distance * 0.45;
      gsap.set(el, { transformPerspective: 800, y: startY, opacity: 0 });

      // Main descent: fade in, drift down, fade out, then start again from the top.
      const fallTl = gsap.timeline({ repeat: -1, delay });
      fallTl
        .to(el, { opacity, duration: duration * 0.12, ease: "sine.out" }, 0)
        .to(el, { y: endY, duration, ease: "sine.inOut" }, 0)
        .to(el, { opacity: 0, duration: duration * 0.18, ease: "sine.in" }, duration * 0.82)
        .set(el, { y: startY });

      // Side-to-side sway, slightly out of phase with the descent.
      gsap.fromTo(
        el,
        { x: -size * 0.18 },
        { x: size * 0.18, duration: duration * 0.28, ease: "sine.inOut", yoyo: true, repeat: -1, delay }
      );

      // Tumble: rocking spin plus a 3D flutter so it catches the light like a real leaf.
      gsap.fromTo(
        el,
        { rotation: -14 },
        { rotation: 14, duration: duration * 0.36, ease: "sine.inOut", yoyo: true, repeat: -1, delay }
      );
      gsap.fromTo(
        el,
        { rotateX: -22, rotateY: -10 },
        { rotateX: 22, rotateY: 10, duration: duration * 0.22, ease: "sine.inOut", yoyo: true, repeat: -1, delay }
      );
    }, el);

    return () => ctx.revert();
  }, [fall, duration, distance, delay, opacity, size]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute select-none will-change-transform ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <img
        src="/images/bg/leaf.png"
        alt=""
        width={size}
        height={size}
        className="h-full w-full"
        style={{
          transform: `rotate(${rotate}deg)${flip ? " scaleX(-1)" : ""}`,
        }}
      />
    </div>
  );
}
