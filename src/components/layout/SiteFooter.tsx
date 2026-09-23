"use client";

import Image from "next/image";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Activities", href: "/activities" },
];

const CONTACT = {
  designation: "Department of Environment & Forests",
  org: "Andaman & Nicobar Administration",
  phone: "03192-244664",
  email: "dcfwl313@gmail.com",
};

export function SiteFooter() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden bg-[#10382F]">
      <div className="relative grid grid-cols-1 gap-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-14 md:grid-cols-3 md:gap-8 lg:grid-cols-[1.3fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center justify-start gap-4 mb-4">
            <Image
              src="/logo/department-logo.png"
              alt="Andaman & Nicobar Forests department seal"
              width={72}
              height={72}
              className="h-16 w-16 shrink-0 object-contain"
            />
            <div className="font-headline-md text-white font-bold">
              Department of Environment &amp; Forests
              <div className="text-lg">Andaman &amp; Nicobar Administration</div>
            </div>
          </div>
          <p className="font-body-md text-body-md text-white/70 max-w-md">
            Official Ecotourism Portal. Dedicated to the sustainable
            development and environmental protection of the archipelago.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h5 className="mb-4 text-[13px] font-bold uppercase tracking-[0.08em] text-white">
            Contact
          </h5>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-[18px] text-[var(--lagoon-light,#7fc4b8)]">
                badge
              </span>
              <div>
                <p className="font-semibold text-white">{CONTACT.designation}</p>
                <p className="text-white/70 text-body-sm">{CONTACT.org}</p>
              </div>
            </div>
            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px] text-[var(--lagoon-light,#7fc4b8)]">
                call
              </span>
              {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px] text-[var(--lagoon-light,#7fc4b8)]">
                mail
              </span>
              {CONTACT.email}
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="mb-4 text-[13px] font-bold uppercase tracking-[0.08em] text-white">
            Quick Links
          </h5>
          <div className="flex flex-col gap-2.5">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-1.5 text-white/70 hover:text-white font-body-md text-body-md transition-all"
              >
                <span className="material-symbols-outlined text-[16px] opacity-60 transition-transform group-hover:translate-x-0.5">
                  chevron_right
                </span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.15] py-6 text-center text-caption text-white/60">
        © 2026 Andaman &amp; Nicobar Administration. All Rights Reserved.
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--lagoon,#2e8b82)] text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
      </button>
    </footer>
  );
}
