"use client";

import { useState } from "react";
import { firstClause } from "@/lib/format";

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
  maxLength = 64,
}: {
  label: string;
  value: string;
  color?: InfoStatColor;
  maxLength?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = firstClause(value, maxLength);
  const isTruncated = preview !== value.trim();

  return (
    <div className="p-6 border border-outline-variant bg-surface-container-lowest rounded-lg">
      <span className="font-label-md text-on-surface-variant uppercase text-[11px] tracking-widest block mb-1">
        {label}
      </span>
      <p className={`font-headline-md text-headline-md ${colorClasses[color]}`}>
        {expanded ? value : preview}
      </p>
      {isTruncated ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 inline-flex items-center gap-1 font-label-md text-label-md text-primary"
        >
          <span className="group">
            <span className="group-hover:underline underline-offset-2">
              {expanded ? "Read less" : "Read more"}
            </span>
          </span>

          <span className="material-symbols-outlined text-[18px]">
            {expanded ? "expand_less" : "expand_more"}
          </span>
        </button>
      ) : null}
    </div>
  );
}
