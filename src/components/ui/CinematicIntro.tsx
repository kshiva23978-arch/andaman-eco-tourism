"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import gsap from "gsap";

// sessionStorage has no change events worth subscribing to here.
const subscribeNoop = () => () => {};

/**
 * Full-screen cinematic opener shown before the home hero.
 *
 * Drone footage (Ken Burns) + kinetic typography of the hero headline with
 * birds drifting across at different depths (parallax). At the end the
 * headline itself glides and scales into its place in the hero (shared
 * element / FLIP), while the intro backdrop dissolves into the hero video.
 *
 * The hero must render its headline with `data-hero-title` and the same
 * font / line-height / line breaks (see HERO_TITLE_LINES) so the two match.
 */

const INTRO_VIDEO = "/videos/bg-banner.mp4";

// Only play the full cinematic opener once per browser session; later visits
// to the homepage (e.g. navigating back via the header) skip straight to the hero.
const INTRO_SEEN_KEY = "andaman:intro-seen";

/** Shared headline, one entry per rendered line. */
export const HERO_TITLE_LINES = ["Discover Andaman", "& Nicobar Islands"];

// Delay so the intro starts as the PageLoader (2.5s + 0.5s fade) clears.
const LOADER_DELAY = 2.6;

// depth < 1 = far away (smaller, blurrier, slower); depth > 1 = close (faster).
const BIRDS = [
  { top: "14%", size: 64, depth: 0.55, duration: 11, delay: 0.2 },
  { top: "22%", size: 120, depth: 1, duration: 8.5, delay: 0.6 },
  { top: "72%", size: 190, depth: 1.6, duration: 6.5, delay: 1.1 },
  { top: "80%", size: 88, depth: 0.8, duration: 9.5, delay: 2.4 },
];

interface CinematicIntroProps {
  /** Fired the moment the headline lands in the hero — show the hero content now. */
  onReveal?: () => void;
  onComplete?: () => void;
}

export function CinematicIntro({ onReveal, onComplete }: CinematicIntroProps) {
  const [mounted, setMounted] = useState(true);
  // Read on the client only; the server (and hydration) always renders the overlay.
  const introSeen = useSyncExternalStore(
    subscribeNoop,
    () => sessionStorage.getItem(INTRO_SEEN_KEY) === "1",
    () => false
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    // Already seen this session: the overlay renders `null` (see the `introSeen` check below),
    // so `rootRef` never attaches — this path must not depend on it. Still wait for the
    // PageLoader (which replays on every navigation) to clear before revealing, so the hero's
    // fade-up and video start aren't wasted behind the opaque loader.
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === "1") {
      const timer = window.setTimeout(() => {
        onReveal?.();
        onComplete?.();
      }, LOADER_DELAY * 1000);
      return () => window.clearTimeout(timer);
    }

    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Lock scrolling while the overlay is up (Lenis ignores the overlay via data-lenis-prevent).
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    // Keep the page pinned to the top: the hand-off measures the hero headline in the viewport,
    // so a restored/Lenis scroll position would send the title toward an off-screen target.
    const prevRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const pinTop = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    pinTop();
    window.addEventListener("scroll", pinTop);
    // Swallow wheel/touch at the window capture phase so Lenis (and the PageLoader above us) never see it.
    const swallow = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener("wheel", swallow, { passive: false, capture: true });
    window.addEventListener("touchmove", swallow, { passive: false, capture: true });

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      window.removeEventListener("scroll", pinTop);
      window.removeEventListener("wheel", swallow, { capture: true });
      window.removeEventListener("touchmove", swallow, { capture: true });
      history.scrollRestoration = prevRestoration;
      html.style.overflow = prevOverflow;
      onReveal?.();
      onComplete?.();
      setMounted(false);
    };

    if (reduceMotion) {
      finish();
      return;
    }

    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      const bg = q("[data-intro-bg]");
      const backdrop = q("[data-intro-backdrop]");
      const eyebrow = q("[data-eyebrow]");
      const eyebrowChars = q("[data-eyebrow-char]");
      const title = q("[data-intro-title]")[0] as HTMLElement;
      const wordChars = q("[data-word-char]");
      const tagline = q("[data-tagline]");
      const birds = q("[data-bird]");
      const skip = q("[data-skip]");
      const textLayer = q("[data-text-layer]");
      const birdLayer = q("[data-bird-layer]");

      // ---- Initial states -------------------------------------------------
      gsap.set(bg, { scale: 1.28, xPercent: -2.5, yPercent: 1.5, transformOrigin: "50% 50%" });
      gsap.set(eyebrowChars, { yPercent: 120, opacity: 0 });
      gsap.set(wordChars, { yPercent: 115, rotateX: -35, opacity: 0, transformOrigin: "50% 100%" });
      gsap.set(tagline, { y: 24, opacity: 0 });
      gsap.set(skip, { opacity: 0 });

      // ---- Mouse parallax (layers move at different depths) ---------------
      const textX = gsap.quickTo(textLayer, "x", { duration: 0.9, ease: "power3.out" });
      const textY = gsap.quickTo(textLayer, "y", { duration: 0.9, ease: "power3.out" });
      const birdX = gsap.quickTo(birdLayer, "x", { duration: 1.2, ease: "power3.out" });
      const birdY = gsap.quickTo(birdLayer, "y", { duration: 1.2, ease: "power3.out" });
      const bgX = gsap.quickTo(bg, "x", { duration: 1.6, ease: "power3.out" });
      const bgY = gsap.quickTo(bg, "y", { duration: 1.6, ease: "power3.out" });
      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        textX(nx * -18);
        textY(ny * -12);
        birdX(nx * 34);
        birdY(ny * 22);
        bgX(nx * -10);
        bgY(ny * -8);
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      const stopParallax = () => {
        window.removeEventListener("mousemove", onMove);
        gsap.to([textLayer, birdLayer], { x: 0, y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      };

      // ---- Birds: continuous drift with independent depth/speed -----------
      birds.forEach((bird, i) => {
        const { duration, delay, depth } = BIRDS[i];
        gsap.fromTo(
          bird,
          { left: "-18vw" },
          {
            left: "118vw",
            duration,
            delay: LOADER_DELAY + delay,
            ease: "none",
            repeat: -1,
            repeatDelay: 1.5,
          }
        );
        gsap.to(bird, {
          y: `-=${14 * depth}`,
          rotate: -4 * depth,
          duration: 1.4 / Math.max(depth, 0.6),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // ---- Shared-element hand-off: fly the headline into the hero --------
      const morphToHero = (duration: number) => {
        const target = document.querySelector<HTMLElement>("[data-hero-title]");
        const hand = gsap.timeline({ onComplete: finish });

        if (target) {
          pinTop();
          const from = title.getBoundingClientRect();
          const to = target.getBoundingClientRect();
          const scale = to.width / from.width;
          gsap.set(title, { transformOrigin: "0 0" });
          hand.to(
            title,
            { x: to.left - from.left, y: to.top - from.top, scale, duration, ease: "power3.inOut" },
            0
          );
        } else {
          hand.to(title, { opacity: 0, y: -30, duration: duration * 0.6, ease: "power2.in" }, 0);
        }

        // Backdrop dissolves into the (already playing) hero video underneath.
        hand
          .to(bg, { scale: "+=0.1", duration: duration + 0.2, ease: "power2.inOut" }, 0)
          .to(backdrop, { opacity: 0, duration: duration * 0.85, ease: "power2.inOut" }, duration * 0.15);

        return hand;
      };

      // ---- Master timeline ------------------------------------------------
      const tl = gsap.timeline({
        delay: LOADER_DELAY,
        defaults: { ease: "power4.out" },
      });

      // Ken Burns runs underneath the intro.
      tl.to(bg, { scale: 1.08, xPercent: 2, yPercent: -1.5, duration: 4.8, ease: "none" }, 0);
      tl.to(skip, { opacity: 1, duration: 1 }, 0.8);

      // Kinetic typography in
      tl.to(eyebrowChars, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.018 }, 0.1)
        .to(
          wordChars,
          { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.035, ease: "expo.out" },
          0.35
        )
        .to(tagline, { y: 0, opacity: 1, duration: 1 }, 1.5);

      // Supporting elements out, then the headline flies to the hero.
      const outAt = 4.3;
      tl.add(stopParallax, outAt - 0.4)
        .to(eyebrowChars, { yPercent: -120, opacity: 0, duration: 0.6, stagger: 0.008, ease: "power3.in" }, outAt)
        .to(eyebrow, { opacity: 0, duration: 0.4 }, outAt + 0.3)
        .to(tagline, { y: -20, opacity: 0, duration: 0.6, ease: "power3.in" }, outAt)
        .to(skip, { opacity: 0, duration: 0.3 }, outAt)
        .to(birds, { opacity: 0, duration: 0.8 }, outAt)
        .add(() => morphToHero(1.5), outAt + 0.45);

      // Skip: jump straight to the hand-off.
      const onSkip = () => {
        tl.kill();
        stopParallax();
        gsap.to([eyebrow, tagline, skip, birds], { opacity: 0, duration: 0.3, overwrite: "auto" });
        morphToHero(0.9);
      };
      skip[0]?.addEventListener("click", onSkip);

      return () => {
        window.removeEventListener("mousemove", onMove);
        skip[0]?.removeEventListener("click", onSkip);
      };
    }, root);

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", pinTop);
      window.removeEventListener("wheel", swallow, { capture: true });
      window.removeEventListener("touchmove", swallow, { capture: true });
      history.scrollRestoration = prevRestoration;
      html.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || introSeen) return null;

  return (
    <div
      ref={rootRef}
      data-lenis-prevent
      className="fixed inset-0 z-[90] overflow-hidden text-white [perspective:1400px]"
      role="presentation"
    >
      {/* Backdrop — everything that dissolves away at the hand-off */}
      <div data-intro-backdrop className="absolute inset-0 bg-black">
        <div data-intro-bg className="absolute inset-0 will-change-transform">
          <video
            src={INTRO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/[0.15] to-black/[0.45]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/[0.45] via-transparent to-black/[0.35]" />
      </div>

      {/* Birds — layered at different depths */}
      <div data-bird-layer className="pointer-events-none absolute inset-0 will-change-transform">
        {BIRDS.map((bird, i) => (
          <Image
            key={i}
            data-bird
            src="/images/illustrations/bird-fly.png"
            width={bird.size}
            height={bird.size}
            alt=""
            className="absolute will-change-transform"
            style={{
              top: bird.top,
              left: "-18vw",
              width: bird.size,
              height: "auto",
              opacity: Math.min(0.35 + bird.depth * 0.45, 1),
              filter: `blur(${bird.depth < 1 ? (1 - bird.depth) * 3 : 0}px) drop-shadow(0 18px 20px rgba(0,0,0,.35))`,
            }}
          />
        ))}
      </div>

      {/* Kinetic typography */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div data-text-layer className="flex flex-col items-center px-6 will-change-transform">
          <div data-eyebrow className="mb-5 flex items-center justify-center gap-3 text-white/75 md:mb-7">
            <span className="h-px w-8 bg-white/50 md:w-12" />
            <span className="font-label-md flex overflow-hidden text-[11px] uppercase tracking-[0.32em] md:text-[12px]">
              {"Andaman & Nicobar Islands".split("").map((ch, i) => (
                <span key={i} data-eyebrow-char className="inline-block will-change-transform">
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </span>
            <span className="h-px w-8 bg-white/50 md:w-12" />
          </div>

          {/* Must mirror the hero <h1> (font, line-height, line breaks) for the FLIP hand-off. */}
          <div
            data-intro-title
            className="hero-title w-fit text-left leading-[1.05] will-change-transform"
            style={{ fontSize: "clamp(2.1rem, 8.5vw, 7.5rem)" }}
          >
            {HERO_TITLE_LINES.map((line, li) => (
              <span key={li} className="block overflow-hidden whitespace-nowrap">
                {line.split("").map((ch, ci) => (
                  <span key={ci} data-word-char className="inline-block will-change-transform">
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
            ))}
          </div>

          <p
            data-tagline
            className="mt-5 max-w-md text-center text-sm text-white/80 md:mt-7 md:max-w-lg md:text-lg"
          >
            Where the rainforest meets the reef — an archipelago of 572 islands, protected by the
            people who call it home.
          </p>
        </div>
      </div>

      {/* Skip */}
      <button
        type="button"
        data-skip
        className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur transition-colors hover:bg-white/20 md:bottom-8 md:right-8"
      >
        Skip intro
        <span className="material-symbols-outlined !text-[16px]">skip_next</span>
      </button>
    </div>
  );
}
