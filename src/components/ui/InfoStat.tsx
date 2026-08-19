type InfoStatColor = "primary" | "secondary" | "error";

const colorClasses: Record<InfoStatColor, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  error: "text-error",
};

export function InfoStat({
  label,
  value,
  color = "primary",
}: {
  label: string;
  value: string;
  color?: InfoStatColor;
}) {
  return (
    <div className="p-6 border border-outline-variant bg-surface-container-lowest rounded-lg">
      <span className="font-label-md text-on-surface-variant uppercase text-[11px] tracking-widest block mb-1">
        {label}
      </span>
      <p className={`font-headline-md text-headline-md ${colorClasses[color]}`}>
        {value}
      </p>
    </div>
  );
}
