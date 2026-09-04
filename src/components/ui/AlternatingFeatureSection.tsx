import Image from "next/image";
import Link from "next/link";

export interface FeatureBullet {
  icon?: string;
  text: string;
}

export type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center"
  | "center";

export interface WatermarkConfig {
  src: string;
  /** Where in the section it sits. Defaults auto-cycle through the 4 corners if omitted. */
  position?: WatermarkPosition;
  /** Height in px (width scales to match, aspect preserved). Default 160. */
  size?: number;
  /** Tailwind opacity step (5, 10, 15, 20 ...). Default 10. */
  opacity?: number;
}

export type WatermarkInput = string | string[] | WatermarkConfig | WatermarkConfig[];

const POSITION_CLASSES: Record<WatermarkPosition, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "top-center": "top-0 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

/** Corner slots auto-assigned (in order) to watermarks that don't specify a position. */
const AUTO_POSITIONS: WatermarkPosition[] = [
  "bottom-right",
  "top-left",
  "bottom-left",
  "top-right",
];

function normalizeWatermarks(input: WatermarkInput | undefined): Required<WatermarkConfig>[] {
  if (!input) return [];
  const list = Array.isArray(input) ? input : [input];

  return list.map((item, index) => {
    const config = typeof item === "string" ? { src: item } : item;
    return {
      src: config.src,
      position: config.position ?? AUTO_POSITIONS[index % AUTO_POSITIONS.length],
      size: config.size ?? 160,
      opacity: config.opacity ?? 10,
    };
  });
}

export function AlternatingFeatureSection({
  href,
  image,
  imageAlt,
  icon,
  title,
  body,
  bullets,
  callout,
  reverse = false,
  bgClassName = "bg-surface",
  tone = "light",
  watermark,
}: {
  href?: string;
  image: string;
  imageAlt: string;
  icon?: string;
  title: string;
  body: string;
  bullets?: FeatureBullet[];
  callout?: string;
  reverse?: boolean;
  bgClassName?: string;
  tone?: "light" | "dark";
  /** Optional faint decorative illustration(s). A plain string/array auto-cycles corners; pass `{ src, position, size, opacity }` (or an array of those) for explicit control. */
  watermark?: WatermarkInput;
}) {
  const watermarks = normalizeWatermarks(watermark);
  const isDark = tone === "dark";
  const bodyColor = isDark ? "opacity-90" : "text-on-surface-variant";
  const iconColor = isDark ? "" : "text-primary";
  const titleColor = isDark ? "" : "text-primary";
  const linkColor = isDark ? "text-on-primary" : "text-primary";

  return (
    <section className={`relative py-16 ${bgClassName} ${isDark ? "text-on-primary" : ""}`}>
      {watermarks.map((wm, index) => (
        <Image
          key={`${wm.src}-${index}`}
          src={wm.src}
          alt=""
          aria-hidden="true"
          width={wm.size}
          height={wm.size}
          className={`absolute w-auto object-contain pointer-events-none sm:display-none ${POSITION_CLASSES[wm.position]}`}
          style={{ height: wm.size, opacity: wm.opacity / 100 }}
        />
      ))}
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
        <div className={`order-2 ${reverse ? "md:order-2" : "md:order-1"}`}>
          <div className="flex items-center gap-3 mb-4">
            {icon ? (
              <span className={`material-symbols-outlined text-3xl ${iconColor}`}>
                {icon}
              </span>
            ) : null}
            <h2 className={`font-headline-lg text-headline-lg ${titleColor}`}>
              {href ? (
                <Link href={href} className="hover:underline">
                  {title}
                </Link>
              ) : (
                title
              )}
            </h2>
          </div>
          <p className={`font-body-md text-body-md leading-relaxed mb-6 ${bodyColor}`}>
            {body}
          </p>
          {bullets ? (
            <ul className="space-y-2">
              {bullets.map((bullet) => (
                <li
                  key={bullet.text}
                  className={`flex items-center gap-2 font-label-md ${bodyColor}`}
                >
                  {bullet.icon ? (
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isDark ? "" : "text-secondary"
                      }`}
                    >
                      {bullet.icon}
                    </span>
                  ) : null}
                  {bullet.text}
                </li>
              ))}
            </ul>
          ) : null}
          {callout ? (
            <div
              className={
                isDark
                  ? "mt-4 p-4 border border-white/20 bg-white/5 rounded"
                  : "mt-4 bg-primary-container/10 p-4 border-l-4 border-primary rounded"
              }
            >
              <p className={isDark ? "text-caption italic" : "font-body-md text-primary"}>
                {callout}
              </p>
            </div>
          ) : null}
          {href ? (
            <Link
              href={href}
              className={`mt-6 inline-flex items-center gap-2 font-label-md text-label-md group ${linkColor}`}
            >
              View Details
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          ) : null}
        </div>
        <div className={`order-1 ${reverse ? "md:order-1" : "md:order-2"}`}>
          {href ? (
            <Link
              href={href}
              className="block w-full aspect-video relative overflow-hidden rounded shadow-sm group"
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          ) : (
            <div className="w-full aspect-video relative overflow-hidden rounded shadow-sm">
              <Image src={image} alt={imageAlt} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
