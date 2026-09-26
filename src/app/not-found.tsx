import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { DecorativeLeaf } from "@/components/ui/DecorativeLeaf";
import { AccentText } from "@/components/ui/AccentText";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] w-full items-center overflow-hidden bg-surface-container-low py-20">
      <DecorativeLeaf className="top-10 left-6 md:top-16 md:left-16" rotate={-60} size={140} opacity={0.15} />
      <DecorativeLeaf className="bottom-10 right-6 md:bottom-16 md:right-24" rotate={110} flip size={180} opacity={0.15} delay={4} />

      <div className="relative mx-auto flex max-w-container-max flex-col items-center px-margin-mobile text-center md:px-margin-desktop">
        <Chip variant="secondary" icon="explore_off" className="mb-6">
          Lost at Sea
        </Chip>

        <span className="font-headline-lg text-primary/15 text-[7rem] leading-none tracking-tight md:text-[11rem]">
          404
        </span>

        <h1 className="font-headline-lg mt-2 text-2xl text-black tracking-tight md:text-headline-xl">
          <AccentText text="This *Island* Isn't on the Map" accentClassName="text-emerald-700" />
        </h1>

        <p className="mt-4 max-w-lg font-body-md text-body-md text-on-surface-variant">
          The page you&apos;re looking for may have drifted away, been renamed, or never existed.
          Let&apos;s get you back to charted waters.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <Button href="/" variant="primary" size="lg">
            <span className="material-symbols-outlined text-[18px]">home</span>
            Back to Home
          </Button>
          <Button href="/destinations" variant="outline" size="lg">
            <span className="material-symbols-outlined text-[18px]">map</span>
            Explore Destinations
          </Button>
        </div>
      </div>
    </section>
  );
}
