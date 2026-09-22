// Deterministic zig-zag heights (not Math.random) so SSR and client markup match.
const TEETH = [
  8, 22, 14, 26, 10, 20, 6, 24, 16, 28, 12, 18, 9, 25, 15, 21, 7, 23, 13, 27,
  11, 19, 17, 29, 10, 22, 14, 26, 8, 24, 16, 20, 12, 28, 18, 10,
];

const VIEW_WIDTH = 1440;
const VIEW_HEIGHT = 34;
const STEP = VIEW_WIDTH / (TEETH.length - 1);

function buildPath() {
  const points = TEETH.map(
    (tooth, i) => `${i * STEP},${VIEW_HEIGHT - tooth}`
  );
  return `M0,${VIEW_HEIGHT} L${points.join(" L")} L${VIEW_WIDTH},${VIEW_HEIGHT} Z`;
}

const TORN_PATH = buildPath();

/**
 * A torn-paper style edge, meant to sit absolutely at the bottom of a hero
 * image so the section below appears to "tear into" it.
 */
export function TornEdge({
  className = "",
  colorClassName = "text-surface",
}: {
  className?: string;
  colorClassName?: string;
}) {
  return (
    <svg
      className={`absolute bottom-0 left-0 z-20 h-8 w-full md:h-9 ${colorClassName} ${className}`}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={TORN_PATH} fill="currentColor" />
    </svg>
  );
}
