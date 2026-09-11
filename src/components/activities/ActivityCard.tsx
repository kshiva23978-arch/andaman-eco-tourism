import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/lib/types";

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="min-w-[280px] snap-start" style={{ perspective: "1200px" }}>
      <Link
        href={`/activities/${activity.slug}`}
        className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-surface-container-low shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition-all duration-500 ease-out [transform-style:preserve-3d] hover:[transform:perspective(1200px)_rotateX(4deg)_translateY(-8px)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55)]"
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={activity.heroImage}
            alt={activity.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {activity.icon && (
            <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-md transition-transform duration-500 group-hover:[transform:translateZ(24px)_scale(1.1)]">
              <span className="material-symbols-outlined text-[22px]">
                {activity.icon}
              </span>
            </span>
          )}

          {activity.duration && (
            <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-md">
              {activity.duration}
            </span>
          )}
        </div>

        <div className="relative flex flex-col p-6 pb-16 text-center md:text-left">
          <h4 className="font-headline-md text-body-lg font-bold text-primary mb-3 transition-transform duration-500 group-hover:[transform:translateZ(20px)]">
            {activity.title}
          </h4>
          <p className="text-on-surface-variant text-caption">
            {activity.tagline}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-outline-variant bg-surface-container-low px-6 py-4">
          <span className="flex items-center justify-center gap-2 font-label-md text-primary md:justify-start">
            View Details
            <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">
              arrow_outward
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}
