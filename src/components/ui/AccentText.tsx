import { Fragment } from "react";

/**
 * Renders editable heading text where words wrapped in *stars* get the accent color,
 * e.g. "Explore Featured *Destinations*".
 */
export function AccentText({ text, accentClassName }: { text: string; accentClassName: string }) {
  const parts = text.split(/\*([^*]+)\*/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={accentClassName}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
