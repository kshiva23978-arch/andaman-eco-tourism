"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export interface HeroSlide {
  image: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  href: string;
  cta: string;
}

const AUTOPLAY_SECONDS = 7;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Full-bleed, GSAP-driven hero slider: clip-wipe image transitions with a
 * slow Ken Burns drift, masked word-by-word titles, pointer parallax,
 * autoplay with a progress ring, keyboard + swipe navigation.
 */
export function ActivitiesHero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  /** Thumbnail highlight; updates on click, before the slide itself swaps. */
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);

  const prevIndex = useRef(0);
  const isAnimating = useRef(false);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const dragStartX = useRef<number | null>(null);

  const count = slides.length;
  const slide = slides[index];

  /* ---------- navigation ---------- */
  const goTo = useCallback(
    (next: number) => {
      if (isAnimating.current) return;
      const target = (next + count) % count;
      if (target === index) return;

      isAnimating.current = true;
      setActive(target);
      const content = contentRef.current;
      const words = titleRef.current?.querySelectorAll("[data-word]") ?? [];

      // Animate current text out, then swap the slide.
      gsap
        .timeline({ onComplete: () => setIndex(target) })
        .to(
          words,
          {
            yPercent: -110,
            opacity: 0,
            duration: 0.45,
            ease: "power3.in",
            stagger: 0.03,
          },
          0,
        )
        .to(
          content?.querySelectorAll("[data-fade]") ?? [],
          {
            y: -16,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
            stagger: 0.04,
          },
          0,
        );
    },
    [count, index],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  /* ---------- initial + per-slide entrance ---------- */
  useLayoutEffect(() => {
    const from = prevIndex.current;
    const to = index;
    const isFirst = from === to && !isAnimating.current;
    prevIndex.current = to;

    const incoming = slideRefs.current[to];
    const incomingImg = imageRefs.current[to];
    const outgoing = from !== to ? slideRefs.current[from] : null;
    const outgoingImg = from !== to ? imageRefs.current[from] : null;
    const words = titleRef.current?.querySelectorAll("[data-word]") ?? [];
    const fades = contentRef.current?.querySelectorAll("[data-fade]") ?? [];

    if (!incoming || !incomingImg) return;

    const reduced = prefersReducedMotion();
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    // Accept the next click once the wipe has landed.
    tl.add(
      () => {
        isAnimating.current = false;
      },
      isFirst ? 0.3 : 1.2,
    );

    // Make sure only the incoming slide sits on top.
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { zIndex: i === to ? 2 : i === from ? 1 : 0 });
    });

    if (reduced) {
      gsap.set(incoming, { clipPath: "inset(0 0 0 0%)", opacity: 1 });
      gsap.set(incomingImg, { scale: 1, xPercent: 0 });
      if (outgoing) gsap.set(outgoing, { opacity: 0 });
      gsap.set(words, { yPercent: 0, opacity: 1 });
      gsap.set(fades, { y: 0, opacity: 1 });
      isAnimating.current = false;
      return () => tl.kill();
    }

    // Image: wipe in from the right while settling from a zoomed state.
    tl.fromTo(
      incoming,
      {
        clipPath: isFirst ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)",
        opacity: 1,
      },
      {
        clipPath: "inset(0 0 0 0%)",
        duration: isFirst ? 0 : 1.2,
        ease: "power4.inOut",
      },
      0,
    ).fromTo(
      incomingImg,
      { scale: isFirst ? 1.06 : 1.12, xPercent: isFirst ? 0 : 3 },
      {
        scale: 1,
        xPercent: 0,
        duration: isFirst ? 2.4 : 1.6,
        ease: "power3.out",
      },
      0,
    );

    if (outgoing && outgoingImg) {
      tl.to(
        outgoingImg,
        { scale: 1.08, duration: 1.2, ease: "power2.inOut" },
        0,
      ).to(outgoing, { opacity: 0, duration: 0.6 }, 0.7);
    }

    // Slow Ken Burns drift for as long as the slide is visible (separate
    // tween so its length doesn't hold the timeline open).
    const drift = gsap.to(incomingImg, {
      scale: 1.05,
      duration: AUTOPLAY_SECONDS + 2,
      ease: "none",
      delay: isFirst ? 2.2 : 1.4,
    });

    // Text: masked words rise, then supporting content fades up.
    const textStart = isFirst ? 0.3 : 0.55;
    tl.fromTo(
      words,
      { yPercent: 110, opacity: 0, rotate: 3 },
      {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.06,
      },
      textStart,
    ).fromTo(
      fades,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
      textStart + 0.25,
    );

    // Counter flicks up.
    if (counterRef.current) {
      tl.fromTo(
        counterRef.current,
        { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5 },
        textStart,
      );
    }

    return () => {
      tl.kill();
      drift.kill();
    };
  }, [index]);

  /* ---------- thumbnail highlight ---------- */
  useEffect(() => {
    const thumbs =
      sectionRef.current?.querySelectorAll<HTMLElement>("[data-thumb]");
    if (!thumbs?.length) return;
    const reduced = prefersReducedMotion();

    thumbs.forEach((thumb, i) => {
      const isActive = i === active;
      gsap.to(thumb, {
        width: isActive ? 144 : 96,
        height: isActive ? 96 : 64,
        opacity: isActive ? 1 : 0.6,
        borderColor: isActive
          ? "rgba(255,255,255,0.8)"
          : "rgba(255,255,255,0.2)",
        boxShadow: isActive
          ? "0 20px 25px -5px rgba(0,0,0,0.4)"
          : "0 0 0 0 rgba(0,0,0,0)",
        duration: reduced ? 0 : 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
      const label = thumb.querySelector("[data-thumb-label]");
      if (label) {
        gsap.to(label, {
          y: isActive ? 0 : 4,
          opacity: isActive ? 1 : 0.7,
          duration: reduced ? 0 : 0.4,
          overwrite: "auto",
        });
      }
      if (isActive && !reduced) {
        gsap.fromTo(
          thumb,
          { scale: 0.94 },
          { scale: 1, duration: 0.5, ease: "back.out(2)", overwrite: false },
        );
      }
    });
  }, [active]);

  /* ---------- autoplay progress ---------- */
  useEffect(() => {
    const bars = sectionRef.current?.querySelectorAll("[data-progress]");
    if (!bars?.length) return;
    progressTween.current?.kill();
    progressTween.current = gsap.fromTo(
      bars,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: AUTOPLAY_SECONDS,
        ease: "none",
        onComplete: () => goTo(index + 1),
      },
    );
    if (isPaused) progressTween.current.pause();
    return () => {
      progressTween.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (!progressTween.current) return;
    if (isPaused) progressTween.current.pause();
    else progressTween.current.resume();
  }, [isPaused]);

  /* ---------- pointer parallax ---------- */
  useEffect(() => {
    const section = sectionRef.current;
    const layer = parallaxRef.current;
    if (!section || !layer || prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const xTo = gsap.quickTo(layer, "x", { duration: 1.2, ease: "power3.out" });
    const yTo = gsap.quickTo(layer, "y", { duration: 1.2, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(dx * -28);
      yTo(dy * -18);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* ---------- swipe ---------- */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) > 60) (delta < 0 ? next : prev)();
  };

  const pad = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-black text-white select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragStartX.current = null)}
      aria-roledescription="carousel"
      aria-label="Featured activities"
    >
      {/* Image stack */}
      <div
        ref={parallaxRef}
        className="absolute inset-0"
        style={{ transform: "scale(1.04)" }}
      >
        {slides.map((s, i) => (
          <div
            key={s.image}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0 will-change-[clip-path]"
            style={{ opacity: i === 0 ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <div
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="h-full w-full object-cover object-center"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Cinematic grading */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full items-center">
        <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div ref={contentRef} className="max-w-2xl pb-24 md:pb-10">
            <div
              data-fade
              className="mb-5 flex items-center gap-3 text-white/70"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-300">
                eco
              </span>
              <span className="font-label-md text-[11px] uppercase tracking-[0.3em]">
                {slide.eyebrow}
              </span>
            </div>

            <h1
              key={index}
              ref={titleRef}
              className="font-headline-xl mb-5 text-4xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              {slide.title.split(" ").map((word, i) => (
                <span
                  key={`${index}-t-${i}`}
                  className="inline-block overflow-hidden pb-[0.08em] align-bottom mr-[0.25em]"
                >
                  <span data-word className="inline-block">
                    {word}
                  </span>
                </span>
              ))}
              {slide.accent.split(" ").map((word, i) => (
                <span
                  key={`${index}-a-${i}`}
                  className="inline-block overflow-hidden pb-[0.08em] align-bottom mr-[0.25em]"
                >
                  <span data-word className="inline-block text-emerald-300">
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <p
              data-fade
              className="mb-8 max-w-lg text-base text-white/85 md:text-lg"
            >
              {slide.description}
            </p>

            <div
              data-fade
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
            >
              <Link
                href={slide.href}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3.5 font-label-md text-label-md text-primary shadow-lg transition-transform hover:-translate-y-0.5"
              >
                {slide.cta}
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="#marine-activities"
                className="group inline-flex items-center gap-2 font-label-md text-label-md text-white"
              >
                Browse the guide
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-y-1">
                  expand_more
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: counter, arrows, thumbnails */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pb-16 md:pb-24"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-end justify-between gap-6">
          {/* Counter + arrows */}
          <div className="flex items-center gap-5">
            <div className="flex items-baseline gap-1 font-headline-xl leading-none">
              <span className="overflow-hidden">
                <span
                  ref={counterRef}
                  className="inline-block text-3xl md:text-4xl"
                >
                  {pad(index)}
                </span>
              </span>
              <span className="text-sm text-white/50">/ {pad(count - 1)}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="hidden md:flex items-end gap-3">
            {slides.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.image}
                  type="button"
                  data-thumb
                  onClick={() => goTo(i)}
                  aria-label={`Show ${s.title} ${s.accent}`}
                  aria-current={isActive}
                  className="group relative shrink-0 overflow-hidden rounded-lg border border-white/20"
                  style={{
                    width: isActive ? 144 : 96,
                    height: isActive ? 96 : 64,
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    draggable={false}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span
                    data-thumb-label
                    className="absolute bottom-1.5 left-2 right-2 truncate font-label-md text-[10px] uppercase tracking-widest"
                  >
                    {s.accent}
                  </span>
                  {i === index ? (
                    <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
                      <span
                        data-progress
                        className="absolute inset-y-0 left-0 w-full origin-left bg-emerald-300"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Mobile progress dots */}
          <div className="flex md:hidden items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`relative h-1.5 overflow-hidden rounded-full bg-white/30 transition-all ${
                  i === index ? "w-10" : "w-3"
                }`}
              >
                {i === index ? (
                  <span
                    data-progress
                    className="absolute inset-0 origin-left bg-emerald-300"
                    style={{ transform: "scaleX(0)" }}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 leading-none">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="h-[50px] w-full md:h-[90px]"
        >
          <path
            fill="var(--paper)"
            d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,100 L0,100 Z"
          />
        </svg>
      </div>
    </section>
  );
}
