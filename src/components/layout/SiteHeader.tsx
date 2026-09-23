"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Destinations", href: "/destinations", icon: "landscape" },
  { label: "Activities", href: "/activities", icon: "hiking" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Slide the panel in from the right / out to the right, dim the page behind it.
  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!drawer || !backdrop || !panel) return;

    const items = panel.querySelectorAll("[data-drawer-item]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      drawer.style.visibility = "visible";
      drawer.style.pointerEvents = "auto";
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.35 }, 0)
        .fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: reduce ? 0 : 0.5, ease: "power4.out" }, 0)
        .fromTo(
          items,
          { x: 32, opacity: 0 },
          { x: 0, opacity: 1, duration: reduce ? 0 : 0.5, stagger: reduce ? 0 : 0.06 },
          reduce ? 0 : 0.18
        );
      closeButtonRef.current?.focus({ preventScroll: true });
      return () => {
        tl.kill();
      };
    }

    document.body.style.overflow = "";
    const tl = gsap.timeline({
      defaults: { ease: "power3.in" },
      onComplete: () => {
        drawer.style.visibility = "hidden";
        drawer.style.pointerEvents = "none";
      },
    });
    tl.to(items, { x: 24, opacity: 0, duration: reduce ? 0 : 0.2, stagger: reduce ? 0 : 0.03 }, 0)
      .to(panel, { xPercent: 100, duration: reduce ? 0 : 0.4 }, reduce ? 0 : 0.05)
      .to(backdrop, { opacity: 0, duration: reduce ? 0 : 0.3 }, reduce ? 0 : 0.1);
    return () => {
      tl.kill();
    };
  }, [menuOpen]);

  // Esc closes; restore scroll if unmounted while open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="bg-gradient-to-r from-[#0f2b1e] via-[rgb(16,56,47)] to-[#1c4a3c] border-b border-white/10 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <Link
          href="/"
          className="flex items-center gap-3 font-headline-md text-headline-sm sm:text-headline-md text-[#f3ecd9] font-bold tracking-tight"
        >
          <Image
            src="/logo/department-logo.png"
            alt="Andaman & Nicobar Forests department seal"
            width={64}
            height={64}
            className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
            priority
          />
          Andaman &amp; Nicobar Ecotourism
        </Link>

        <button
          className="md:hidden text-[#f3ecd9] p-2"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="site-drawer"
          onClick={() => setMenuOpen(true)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <nav className="hidden md:flex flex-wrap justify-center gap-6 md:gap-gutter">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "text-[#f3ecd9] font-bold border-b-2 border-[#f3ecd9] pb-1 font-body-md text-body-md"
                  : "text-white/70 hover:text-[#f3ecd9] transition-colors font-body-md text-body-md"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button variant="white" size="sm" className="hidden md:inline-flex" type="button">
          Official Portal
        </Button>
      </div>

      {/* Offcanvas drawer — slides in from the right (mobile only) */}
      <div
        ref={drawerRef}
        id="site-drawer"
        className="fixed inset-0 z-[60] md:hidden"
        style={{ visibility: "hidden", pointerEvents: "none" }}
        aria-hidden={!menuOpen}
      >
        <div
          ref={backdropRef}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="absolute inset-y-0 right-0 flex w-[min(78vw,300px)] flex-col bg-[#0f2b1e] shadow-[-24px_0_60px_-20px_rgba(0,0,0,0.55)] will-change-transform"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
            <span className="font-headline-md text-sm font-bold text-[#f3ecd9]">Menu</span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#f3ecd9] transition-colors hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2.5 py-4">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-drawer-item
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 border-l-2 px-3.5 py-2.5 font-body-md text-sm transition-colors ${
                    active
                      ? "border-[#2e8b82] bg-white/[0.06] text-[#f3ecd9] font-bold"
                      : "border-transparent text-white/70 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                  {link.label}
                  <span className="material-symbols-outlined ml-auto text-[16px] opacity-50">
                    chevron_right
                  </span>
                </Link>
              );
            })}
          </nav>

          <div data-drawer-item className="border-t border-white/10 px-5 py-5">
            <Button variant="white" size="sm" className="w-full justify-center" type="button">
              Official Portal
            </Button>
            <p className="mt-3 text-center text-[11px] leading-snug text-white/50">
              Department of Environment &amp; Forests
              <br />
              Andaman &amp; Nicobar Administration
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
