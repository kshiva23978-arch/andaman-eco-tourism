"use client";

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
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
      <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <Link
          href="/"
          className="font-headline-md text-headline-sm sm:text-headline-md text-primary font-bold tracking-tight"
        >
          Andaman &amp; Nicobar Ecotourism
        </Link>

        <button
          className="md:hidden text-primary p-2"
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
                  ? "text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md"
                  : "text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button variant="primary" size="sm" className="hidden md:inline-flex" type="button">
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
          className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="absolute inset-y-0 right-0 flex w-[min(86vw,360px)] flex-col bg-surface shadow-[-24px_0_60px_-20px_rgba(0,51,88,0.45)] will-change-transform"
        >
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
            <span className="font-headline-md text-base font-bold text-primary">Menu</span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-drawer-item
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3.5 font-body-md text-lg transition-colors ${
                    active
                      ? "bg-primary text-white font-bold"
                      : "text-on-surface hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
                  {link.label}
                  <span className="material-symbols-outlined ml-auto text-[18px] opacity-60">
                    chevron_right
                  </span>
                </Link>
              );
            })}
          </nav>

          <div data-drawer-item className="border-t border-outline-variant px-6 py-6">
            <Button variant="primary" size="md" className="w-full justify-center" type="button">
              Official Portal
            </Button>
            <p className="mt-4 text-center text-caption text-on-surface-variant">
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
