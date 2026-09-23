"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function GalleryTile({
  src,
  alt,
  index,
  onOpen,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
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
}: {
  images: string[];
  title?: string;
}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeLightbox = () => setSelectedImage(null);
  const openAll = () => setSelectedImage(0);

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
              <div className="relative h-[280px] sm:h-[400px] overflow-hidden rounded-3xl">
                <GalleryTile
                  src={images[0]}
                  alt={title}
                  index={0}
                  onOpen={setSelectedImage}
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <div className="relative">
                {images.length === 2 ? (
                  <div className="grid h-[280px] grid-cols-2 gap-2 overflow-hidden rounded-3xl sm:h-[320px] lg:h-[420px]">
                    <GalleryTile src={images[0]} alt={title} index={0} onOpen={setSelectedImage} sizes="50vw" priority />
                    <GalleryTile src={images[1]} alt={title} index={1} onOpen={setSelectedImage} sizes="50vw" />
                  </div>
                ) : images.length === 3 ? (
                  <div className="grid h-[320px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:h-[360px] lg:h-[500px]">
                    <GalleryTile src={images[0]} alt={title} index={0} onOpen={setSelectedImage} sizes="50vw" priority className="col-span-2 row-span-2" />
                    <GalleryTile src={images[1]} alt={title} index={1} onOpen={setSelectedImage} sizes="50vw" className="col-span-2" />
                    <GalleryTile src={images[2]} alt={title} index={2} onOpen={setSelectedImage} sizes="50vw" className="col-span-2" />
                  </div>
                ) : images.length === 4 ? (
                  <div className="grid h-[320px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:h-[360px] lg:h-[500px]">
                    <GalleryTile src={images[0]} alt={title} index={0} onOpen={setSelectedImage} sizes="50vw" priority className="col-span-2 row-span-2" />
                    <GalleryTile src={images[1]} alt={title} index={1} onOpen={setSelectedImage} sizes="50vw" className="col-span-2" />
                    <GalleryTile src={images[2]} alt={title} index={2} onOpen={setSelectedImage} sizes="25vw" />
                    <GalleryTile src={images[3]} alt={title} index={3} onOpen={setSelectedImage} sizes="25vw" />
                  </div>
                ) : (
                  <div className="grid h-[320px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:h-[360px] lg:h-[500px]">
                    <GalleryTile
                      src={images[0]}
                      alt={title}
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
                        alt={title}
                        index={i + 1}
                        onOpen={setSelectedImage}
                        sizes="25vw"
                      />
                    ))}
                  </div>
                )}

                <ShowAllButton onClick={openAll} />
              </div>
            )}
          </div>
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
                    alt={title}
                    fill
                    className="object-cover"
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
                    className="absolute right-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-4 md:right-8"
                    aria-label="Next image"
                  >
                    <span className="material-symbols-outlined text-[22px]">chevron_right</span>
                  </button>
                ) : null}
              </div>

              {/* Caption */}
              <p className="pb-5 text-center font-body-md text-[13px] text-white/70">
                {title} - Destination gallery
              </p>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
