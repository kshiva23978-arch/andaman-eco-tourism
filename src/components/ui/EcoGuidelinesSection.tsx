"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chip } from "@/components/ui/Chip";
import { DecorativeLeaf } from "@/components/ui/DecorativeLeaf";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Guideline {
  icon?: string;
  title: string;
  body?: string;
}

const ACCENTS = ["#22c55e", "#0ea5e9", "#f97316", "#a855f7"];

export function EcoGuidelinesSection({ guidelines }: { guidelines: Guideline[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
          }
        );
      }

      if (mapRef.current) {
        gsap.fromTo(
          mapRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: mapRef.current, start: "top 85%" },
          }
        );
      }

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.querySelectorAll("[data-guideline-card]"),
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-surface-container-low py-20 md:py-24"
    >
      <DecorativeLeaf className="top-6 left-4 md:top-10 md:left-10" rotate={-60} size={120} opacity={0.15} />
      <DecorativeLeaf className="bottom-6 right-4 md:bottom-12 md:right-20" rotate={110} flip size={160} opacity={0.15} />

      <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div ref={headerRef} className="mx-auto mb-12 max-w-2xl text-center">
          <Chip variant="secondary" icon="shield" className="mb-3">
            Responsible Travel
          </Chip>
          <h2 className="font-headline-lg text-2xl md:text-headline-xl text-black tracking-tight mb-4">
            <span className="text-green-500">Eco</span>-Guidelines
          </h2>
          <p className="text-on-surface-variant font-body-md text-body-md">
            Traveling to a sensitive ecological zone requires a commitment to responsibility.
            Please adhere to these official guidelines to help preserve our natural heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1.1fr] items-start">
          <div ref={mapRef} className="overflow-hidden rounded-2xl border border-outline-variant shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4020881.2782082744!2d90.59024351827024!3d10.209710012395053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3064a00f2b650ff3%3A0xce80055648fccb2c!2sAndaman%20and%20Nicobar%20Islands!5e0!3m2!1sen!2sin!4v1788341773220!5m2!1sen!2sin"
              width="100%"
              height="340"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {guidelines.map((guideline, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              return (
                <div
                  key={guideline.title}
                  data-guideline-card
                  className="group relative"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-70"
                    style={{ background: accent }}
                  />
                  <div
                    className="relative h-full rounded-2xl border-2 border-outline-variant bg-surface p-6 text-center transition-all duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(6deg)_rotateY(-6deg)_translateY(-6px)] md:text-left"
                    style={{ boxShadow: "0 10px 30px -18px rgba(0,0,0,0.35)" }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl border-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ borderColor: accent }}
                    />
                    <span
                      className="relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-500 group-hover:[transform:translateZ(30px)_scale(1.08)]"
                      style={{ backgroundColor: `${accent}1A`, color: accent }}
                    >
                      {guideline.icon ? (
                        <span className="material-symbols-outlined text-[28px]">
                          {guideline.icon}
                        </span>
                      ) : (
                        <span className="font-headline-md text-headline-md">{index + 1}</span>
                      )}
                    </span>
                    <h4 className="relative font-headline-md text-body-lg font-bold text-primary mb-3 transition-transform duration-500 group-hover:[transform:translateZ(20px)]">
                      {guideline.title}
                    </h4>
                    {guideline.body ? (
                      <p className="relative text-on-surface-variant font-body-md text-body-md">
                        {guideline.body}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
