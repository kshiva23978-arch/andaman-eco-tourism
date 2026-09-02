"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Activities", href: "/activities" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
      <div className="flex flex-wrap justify-between items-center w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <Link
          href="/"
className="font-headline-md text-headline-sm sm:text-headline-md text-primary font-bold tracking-tight"        >
          Andaman &amp; Nicobar Ecotourism
        </Link>

        <button
          className="md:hidden text-primary p-2"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="material-symbols-outlined">
            {menuOpen ? "close" : "menu"}
          </span>
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

        {menuOpen ? (
          <div className="w-full flex flex-col gap-4 py-4 md:hidden border-t border-outline-variant mt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={
                  isActive(link.href)
                    ? "text-primary font-bold font-body-md text-body-md"
                    : "text-on-surface-variant font-body-md text-body-md"
                }
              >
                {link.label}
              </Link>
            ))}
            <Button variant="primary" size="sm" className="mt-2" type="button">
              Official Portal
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
