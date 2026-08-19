type IconFeatureVariant = "vertical" | "horizontal" | "compact";

export function IconFeatureCard({
  icon,
  title,
  body,
  variant = "vertical",
  className = "",
}: {
  icon?: string;
  title: string;
  body?: string;
  variant?: IconFeatureVariant;
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <div
        className={`bg-white p-4 border border-outline-variant flex flex-col items-center gap-2 text-center rounded-lg ${className}`}
      >
        {icon ? (
          <span className="material-symbols-outlined text-primary text-[32px]">
            {icon}
          </span>
        ) : null}
        <span className="font-label-md">{title}</span>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div
        className={`bg-white p-6 border border-outline-variant rounded-lg flex gap-4 ${className}`}
      >
        {icon ? (
          <span className="material-symbols-outlined text-primary text-[32px]">
            {icon}
          </span>
        ) : null}
        <div>
          <h4 className="font-headline-md mb-2">{title}</h4>
          {body ? <p className="font-body-md text-on-surface-variant">{body}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 border border-outline-variant rounded hover:border-primary transition-colors bg-white text-center md:text-left ${className}`}
    >
      {icon ? (
        <span
          className="material-symbols-outlined text-primary mb-4 block"
          style={{ fontSize: "32px" }}
        >
          {icon}
        </span>
      ) : null}
      <h4 className="font-headline-md text-body-lg font-bold text-primary mb-3">
        {title}
      </h4>
      {body ? <p className="text-on-surface-variant font-body-md text-body-md">{body}</p> : null}
    </div>
  );
}
