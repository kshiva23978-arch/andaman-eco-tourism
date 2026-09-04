"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function GalleryTile({
  src,
  alt,
  index,
  onOpen,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  index: number;
  onOpen: (index: number) => void;
  sizes: string;
  priority?: boolean;
  className: string;
}) {
  return (
    <button type="button" onClick={() => onOpen(index)} className={`group relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes={sizes}
      />
      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
      <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-black opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
        +
      </div>
    </button>
  );
}

export function DestinationGallery({
  images,
  title = "Destination",
}: {
  images: string[];
  title?: string;
}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const closeLightbox = () => setSelectedImage(null);

  const nextImage = () =>
    setSelectedImage((prev) =>
      prev === null ? null : prev === images.length - 1 ? 0 : prev + 1
    );

  const prevImage = () =>
    setSelectedImage((prev) =>
      prev === null ? null : prev === 0 ? images.length - 1 : prev - 1
    );

  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  if (images.length === 0) return null;

  return (
    <>
      <section className="w-full py-12 md:py-0">
        <div className="mx-auto max-w-7xl px-4">
          {/* Mobile: horizontal snap-scroll strip, one image per view */}
          {images.length > 1 ? (
            <div className="sm:hidden -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className="relative h-64 w-[85%] flex-shrink-0 snap-center overflow-hidden rounded-2xl"
                >
                  <Image
                    src={src}
                    alt={title}
                    fill
                    priority={i === 0}
                    className="object-cover"
                    sizes="85vw"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className={images.length > 1 ? "hidden sm:block" : ""}>
            {images.length === 1 ? (
              <div className="relative h-[280px] sm:h-[400px] overflow-hidden rounded-2xl">
                <GalleryTile
                  src={images[0]}
                  alt={title}
                  index={0}
                  onOpen={setSelectedImage}
                  sizes="100vw"
                  priority
                  className="h-full w-full rounded-2xl"
                />
              </div>
            ) : images.length === 2 ? (
              <div className="grid h-[280px] sm:h-[320px] lg:h-[400px] grid-cols-2 gap-2 overflow-hidden rounded-2xl">
                <GalleryTile
                  src={images[0]}
                  alt={title}
                  index={0}
                  onOpen={setSelectedImage}
                  sizes="50vw"
                  priority
                  className="h-full w-full rounded-l-2xl"
                />
                <GalleryTile
                  src={images[1]}
                  alt={title}
                  index={1}
                  onOpen={setSelectedImage}
                  sizes="50vw"
                  className="h-full w-full rounded-r-2xl"
                />
              </div>
            ) : images.length === 3 ? (
              <div className="grid h-[320px] sm:h-[360px] lg:h-[500px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
                <GalleryTile
                  src={images[0]}
                  alt={title}
                  index={0}
                  onOpen={setSelectedImage}
                  sizes="50vw"
                  priority
                  className="col-span-2 row-span-2 rounded-l-2xl"
                />
                <GalleryTile
                  src={images[1]}
                  alt={title}
                  index={1}
                  onOpen={setSelectedImage}
                  sizes="50vw"
                  className="col-span-2 rounded-tr-2xl"
                />
                <GalleryTile
                  src={images[2]}
                  alt={title}
                  index={2}
                  onOpen={setSelectedImage}
                  sizes="50vw"
                  className="col-span-2 rounded-br-2xl"
                />
              </div>
            ) : images.length === 4 ? (
              <div className="grid h-[320px] sm:h-[360px] lg:h-[500px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
                <GalleryTile
                  src={images[0]}
                  alt={title}
                  index={0}
                  onOpen={setSelectedImage}
                  sizes="50vw"
                  priority
                  className="col-span-2 row-span-2 rounded-l-2xl"
                />
                <GalleryTile
                  src={images[1]}
                  alt={title}
                  index={1}
                  onOpen={setSelectedImage}
                  sizes="50vw"
                  className="col-span-2 rounded-tr-2xl"
                />
                <GalleryTile
                  src={images[2]}
                  alt={title}
                  index={2}
                  onOpen={setSelectedImage}
                  sizes="25vw"
                  className=""
                />
                <GalleryTile
                  src={images[3]}
                  alt={title}
                  index={3}
                  onOpen={setSelectedImage}
                  sizes="25vw"
                  className="rounded-br-2xl"
                />
              </div>
            ) : (
              <div className="grid h-[320px] sm:h-[360px] lg:h-[500px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
                <GalleryTile
                  src={images[0]}
                  alt={title}
                  index={0}
                  onOpen={setSelectedImage}
                  sizes="50vw"
                  priority
                  className="col-span-2 row-span-2 rounded-l-2xl"
                />
                {images.slice(1, 5).map((src, i) => {
                  const index = i + 1;
                  const isLastVisible = index === 4;
                  const remaining = images.length - 5;
                  const corner =
                    index === 2 ? "rounded-tr-2xl" : index === 4 ? "rounded-br-2xl" : "";

                  return (
                    <div key={src + index} className={`relative overflow-hidden ${corner}`}>
                      <GalleryTile
                        src={src}
                        alt={title}
                        index={index}
                        onOpen={setSelectedImage}
                        sizes="25vw"
                        className="h-full w-full"
                      />
                      {isLastVisible && remaining > 0 ? (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 font-headline-md text-white">
                          +{remaining}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedImage !== null ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-3 sm:p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-3 top-3 sm:right-5 sm:top-5 z-50 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/10 text-2xl sm:text-3xl text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>

          <div className="absolute left-1/2 top-4 sm:top-6 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white backdrop-blur">
            {selectedImage + 1} / {images.length}
          </div>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 sm:left-4 top-1/2 z-50 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl sm:text-4xl text-white backdrop-blur transition hover:bg-white/20 md:left-8"
              aria-label="Previous image"
            >
              ‹
            </button>
          ) : null}

          <div className="relative h-[70vh] sm:h-[80vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedImage]}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
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
              className="absolute right-2 sm:right-4 top-1/2 z-50 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl sm:text-4xl text-white backdrop-blur transition hover:bg-white/20 md:right-8"
              aria-label="Next image"
            >
              ›
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
