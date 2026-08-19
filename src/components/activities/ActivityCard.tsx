import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/lib/types";

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link
      href={`/activities/${activity.slug}`}
      className="min-w-[280px] snap-start bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden hover:border-primary transition-all flex flex-col"
    >
      <div className="h-48 overflow-hidden relative">
        <Image
          src={activity.heroImage}
          alt={activity.title}
          fill
          className="object-cover"
          sizes="280px"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow text-center md:text-left">
        <h4 className="font-headline-md text-body-lg font-bold text-primary mb-3">
          {activity.title}
        </h4>
        <p className="text-on-surface-variant text-caption mb-6 flex-grow">
          {activity.tagline}
        </p>
        <span className="text-primary font-label-md flex items-center justify-center md:justify-start gap-2 mt-auto">
          View Details
          <span className="material-symbols-outlined text-sm">arrow_outward</span>
        </span>
      </div>
    </Link>
  );
}
