import type { ReactNode } from "react";

type ChipVariant = "neutral" | "secondary" | "primary" | "glass";

const variantClasses: Record<ChipVariant, string> = {
  neutral: "bg-surface-container-highest text-on-surface-variant",
  secondary: "bg-secondary-container text-on-secondary-container",
  primary: "bg-primary-container text-on-primary-container",
  glass:
    "bg-surface-container-lowest/20 backdrop-blur-md border border-white/30 text-white",
};

export function Chip({
  children,
  variant = "neutral",
  icon,
  className = "",
}: {
  children: ReactNode;
  variant?: ChipVariant;
  icon?: string;
  className?: string;
}) {
  const shape = variant === "glass" ? "rounded-full px-4 py-1.5" : "rounded-sm px-2 py-1";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 font-label-md text-caption",
        shape,
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {icon ? (
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
      ) : null}
      {children}
    </span>
  );
}
