"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribeNoop = () => () => {};

/** Moves the lightbox index by `delta`, wrapping around; stays closed if closed. */
function stepImage(current: number | null, delta: 1 | -1, count: number): number | null {
  if (current === null) return null;
  return (current + delta + count) % count;
}

/** Title strip over the bottom of a gallery image; only rendered when the image has a title. */
function CaptionOverlay({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-3 pt-10 text-left">
      <p className="line-clamp-2 font-label-md text-[13px] leading-snug text-white drop-shadow-sm">
        {text}
      </p>
    </div>
  );
}

function GalleryTile({
  src,
  alt,
  caption,
  index,
  onOpen,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  index: number;
  onOpen: (index: number) => void;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={`group relative block h-full w-full overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes={sizes}
      />
      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
      {caption ? <CaptionOverlay text={caption} /> : null}
    </button>
  );
}

function ShowAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-label-md text-[13px] text-on-surface shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <span className="material-symbols-outlined text-[18px]">grid_view</span>
      Show all
    </button>
  );
}

export function DestinationGallery({
  images,
  title = "Destination",
  captions,
}: {
  images: string[];
  title?: string;
  /** Optional per-image titles (index-aligned); blank entries fall back to `title`. */
  captions?: string[];
}) {
  /** The image's own title, if it has one. */
  const captionAt = (index: number) => captions?.[index]?.trim() || undefined;
  /** Alt text: the image's title, falling back to the page title. */
  const captionFor = (index: number) => captionAt(index) || title;
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  // The lightbox portals into document.body, which only exists on the client.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  const closeLightbox = () => setSelectedImage(null);
  const openAll = () => setSelectedImage(0);

  const nextImage = () => setSelectedImage((prev) => stepImage(prev, 1, images.length));
  const prevImage = () => setSelectedImage((prev) => stepImage(prev, -1, images.length));

  const isOpen = selectedImage !== null;
  const imageCount = images.length;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") setSelectedImage((prev) => stepImage(prev, 1, imageCount));
      if (e.key === "ArrowLeft") setSelectedImage((prev) => stepImage(prev, -1, imageCount));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, imageCount]);

  if (images.length === 0) return null;

  return (
    <>
      <section className="w-full py-12 md:py-0 px-1">
        {/* Mobile: stacked list, one image per row */}
        {images.length > 1 ? (
          <div className="sm:hidden flex flex-col gap-3 px-4">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setSelectedImage(i)}
                className="relative h-64 w-full overflow-hidden rounded-2xl"
              >
                <Image
                  src={src}
                  alt={captionFor(i)}
                  fill
                  // Eager rather than `priority`: this list is hidden from sm up, and a
                  // <link rel="preload"> would warn as unused there.
                  loading={i === 0 ? "eager" : "lazy"}
                  className="object-cover"
                  sizes="(min-width: 640px) 1px, calc(100vw - 2rem)"
                />
                {captionAt(i) ? <CaptionOverlay text={captionAt(i)!} /> : null}
              </button>
            ))}
          </div>
        ) : null}

        <div className={`w-full ${images.length > 1 ? "hidden sm:block" : ""}`}>
          {images.length === 1 ? (
            <div className="relative aspect-[16/9] max-h-[560px] overflow-hidden">
              <GalleryTile
                src={images[0]}
                alt={captionFor(0)}
                caption={captionAt(0)}
                index={0}
                onOpen={setSelectedImage}
                sizes="100vw"
                priority
              />
            </div>
          ) : (
            <div className="relative">
              {images.length === 2 ? (
                <div className="grid h-[320px] grid-cols-2 gap-2 overflow-hidden sm:h-[420px] lg:h-[560px]">
                  <GalleryTile src={images[0]} alt={captionFor(0)} caption={captionAt(0)} index={0} onOpen={setSelectedImage} sizes="50vw" priority />
                  <GalleryTile src={images[1]} alt={captionFor(1)} caption={captionAt(1)} index={1} onOpen={setSelectedImage} sizes="50vw" />
                </div>
              ) : images.length === 3 ? (
                <div className="grid h-[340px] grid-cols-3 gap-2 overflow-hidden sm:h-[440px] lg:h-[600px]">
                  <GalleryTile src={images[0]} alt={captionFor(0)} caption={captionAt(0)} index={0} onOpen={setSelectedImage} sizes="34vw" priority className="col-span-1" />
                  <GalleryTile src={images[1]} alt={captionFor(1)} caption={captionAt(1)} index={1} onOpen={setSelectedImage} sizes="33vw" className="col-span-1" />
                  <GalleryTile src={images[2]} alt={captionFor(2)} caption={captionAt(2)} index={2} onOpen={setSelectedImage} sizes="33vw" className="col-span-1" />
                </div>
              ) : images.length <= 6 ? (
                <div className="grid h-[420px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden sm:h-[480px] lg:h-[640px]">
                  <GalleryTile
                    src={images[0]}
                    alt={captionFor(0)}
                    caption={captionAt(0)}
                    index={0}
                    onOpen={setSelectedImage}
                    sizes="50vw"
                    priority
                    className="col-span-2 row-span-2"
                  />
                  {images.slice(1, 5).map((src, i) => (
                    <GalleryTile
                      key={src + i}
                      src={src}
                      alt={captionFor(i + 1)}
                      caption={captionAt(i + 1)}
                      index={i + 1}
                      onOpen={setSelectedImage}
                      sizes="25vw"
                    />
                  ))}
                </div>
              ) : (
                // 7+ images: three-column mosaic — tall images bookend a
                // stacked middle column, matching a classic photo-grid layout.
                <div className="grid h-[560px] grid-cols-3 grid-rows-3 gap-2 overflow-hidden sm:h-[620px] lg:h-[760px]">
                  <GalleryTile
                    src={images[0]}
                    alt={captionFor(0)}
                    caption={captionAt(0)}
                    index={0}
                    onOpen={setSelectedImage}
                    sizes="34vw"
                    priority
                    className="col-start-1 row-span-2"
                  />
                  <GalleryTile src={images[1]} alt={captionFor(1)} caption={captionAt(1)} index={1} onOpen={setSelectedImage} sizes="33vw" className="col-start-2 row-start-1" />
                  <GalleryTile src={images[2]} alt={captionFor(2)} caption={captionAt(2)} index={2} onOpen={setSelectedImage} sizes="33vw" className="col-start-2 row-start-2" />
                  <GalleryTile
                    src={images[3]}
                    alt={captionFor(3)}
                    caption={captionAt(3)}
                    index={3}
                    onOpen={setSelectedImage}
                    sizes="33vw"
                    className="col-start-3 row-span-2"
                  />
                  <GalleryTile src={images[4]} alt={captionFor(4)} caption={captionAt(4)} index={4} onOpen={setSelectedImage} sizes="34vw" className="col-start-1 row-start-3" />
                  <GalleryTile src={images[5]} alt={captionFor(5)} caption={captionAt(5)} index={5} onOpen={setSelectedImage} sizes="33vw" className="col-start-2 row-start-3" />
                  <GalleryTile src={images[6]} alt={captionFor(6)} caption={captionAt(6)} index={6} onOpen={setSelectedImage} sizes="33vw" className="col-start-3 row-start-3" />
                </div>
              )}

              <ShowAllButton onClick={openAll} />
            </div>
          )}
        </div>
      </section>

      {mounted && selectedImage !== null
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex flex-col"
              style={{ backgroundColor: "rgba(11, 31, 28, 0.97)" }}
              onClick={closeLightbox}
            >
              {/* Progress segments */}
              <div className="flex gap-1.5 px-4 pt-4 sm:px-6">
                {images.map((_, i) => (
                  <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
                    <span
                      className={`block h-full rounded-full bg-white transition-all duration-300 ${
                        i <= selectedImage ? "w-full" : "w-0"
                      }`}
                    />
                  </span>
                ))}
              </div>

              {/* Header */}
              <div className="flex items-start justify-between px-4 pt-3 sm:px-6">
                <div onClick={(e) => e.stopPropagation()}>
                  <p className="font-label-md text-[12px] text-white/60">
                    {String(selectedImage + 1).padStart(2, "0")} / {images.length}
                  </p>
                  <p className="font-headline-md text-lg text-white">{title}</p>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    aria-label="Save"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeLightbox}
                    aria-label="Close"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </div>

              {/* Image stage */}
              <div className="relative flex flex-1 items-center justify-center px-4 py-4 sm:px-16">
                {images.length > 1 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-4 md:left-8"
                    aria-label="Previous image"
                  >
                    <span className="material-symbols-outlined text-[22px]">chevron_left</span>
                  </button>
                ) : null}

                <div
                  className="relative h-full w-full max-w-5xl overflow-hidden rounded-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={images[selectedImage]}
                    alt={captionFor(selectedImage)}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1152px) 1024px, 100vw"
                    priority
                  />
                </div>

                {images.length > 1 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-4 md:right-8"
                    aria-label="Next image"
                  >
                    <span className="material-symbols-outlined text-[22px]">chevron_right</span>
                  </button>
                ) : null}
              </div>

              {/* Caption */}
              <p className="pb-5 text-center font-body-md text-[13px] text-white/70">
                {captionAt(selectedImage) || `${title} - Destination gallery`}
              </p>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
