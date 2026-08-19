import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-caption text-on-surface-variant"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-bold text-on-surface" : ""}>
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
