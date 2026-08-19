import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "outline-white" | "white";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-on-primary-fixed-variant border border-primary",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-on-primary",
  "outline-white": "border border-white text-white hover:bg-white/10",
  white: "bg-white text-primary hover:bg-surface-container-low shadow-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-6 py-2",
  md: "px-6 py-3",
  lg: "px-8 py-4",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

type ButtonProps =
  | (CommonProps & { href: string })
  | (CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined });

export function Button({
  variant = "primary",
  size = "sm",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-lg font-label-md text-label-md transition-all",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (props.href) {
    return (
      <Link href={props.href} className={classes}>
        {props.children}
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = props;
  void _href;
  return <button className={classes} {...buttonProps} />;
}
