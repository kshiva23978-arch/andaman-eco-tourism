import type { ReactNode } from "react";

export function SectionHeading({
  icon,
  iconColor = "text-primary",
  children,
  description,
}: {
  icon: string;
  iconColor?: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="font-headline-lg text-headline-lg flex items-center gap-3">
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        {children}
      </h2>
      {description ? (
        <p className="mt-3 text-on-surface-variant font-body-md text-body-md max-w-2xl">
          {description}
        </p>
      ) : null}
    </div>
  );
}
