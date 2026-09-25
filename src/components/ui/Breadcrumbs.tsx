import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  tone = "light",
}: {
  items: Crumb[];
  /** "dark" renders light text for use on photographic backgrounds. */
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-caption no-scrollbar ${
        isDark ? "text-white/70" : "text-on-surface-variant"
      }`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex shrink-0 items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className={isDark ? "hover:text-white" : "hover:text-primary"}>
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast ? `font-bold ${isDark ? "text-white" : "text-on-surface"}` : ""
                }
              >
                {item.label}
              </span>
            )}
            {!isLast ? (
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
