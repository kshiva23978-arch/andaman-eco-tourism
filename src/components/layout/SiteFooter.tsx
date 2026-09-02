import Link from "next/link";

const QUICK_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Activities", href: "/activities" },
];

const RESOURCE_LINKS = [
  { label: "Destinations Directory", href: "/destinations" },
  { label: "Activities Guide", href: "/activities" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-outline-variant">
      <div className="absolute inset-0 bg-[url('/images/bg/footer-bg.png')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 text-center md:text-left">
        <div>
          <div className="font-headline-md text-white font-bold mb-4">
            Department of Environment &amp; Forests
            <div className="text-lg">Andaman &amp; Nicobar Administration</div>
          </div>
          <p className="font-body-md text-body-md text-white/70 mb-4 max-w-md mx-auto md:mx-0">
            Official Ecotourism Portal. Dedicated to the sustainable
            development and environmental protection of the archipelago.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <h5 className="text-white font-bold font-label-md text-label-md">
              Quick Links
            </h5>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-white font-body-md text-body-md transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h5 className="text-white font-bold font-label-md text-label-md">
              Resources
            </h5>
            {RESOURCE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-white font-body-md text-body-md transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/15 py-6 text-center text-caption text-white/60">
        © 2024 Andaman &amp; Nicobar Administration. All Rights Reserved.
      </div>
    </footer>
  );
}
