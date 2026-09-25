import type { ReactNode } from "react";

/**
 * Full-bleed photographic section background with a dark scrim, used to give
 * glassmorphic cards something to "frost" against. Pass `id`/`className`
 * through to the underlying `<section>`.
 */
export function SectionPhotoBg({
  image,
  tone = "dark",
  id,
  className = "",
  children,
}: {
  image: string;
  /** "dark" = strong scrim for white text; "subtle" = light scrim for on-surface text. */
  tone?: "dark" | "subtle";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`relative overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute inset-0 z-0 ${
          tone === "dark"
            ? "bg-gradient-to-b from-black/80 via-black/70 to-black/85"
            : "bg-surface/90"
        }`}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
