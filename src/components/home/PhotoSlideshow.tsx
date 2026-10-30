"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PhotoSlideshowProps = {
  urls: string[];
  alt: string;
  /** Tailwind aspect class, e.g. aspect-[16/10] or aspect-[4/3] */
  aspectClassName?: string;
};

export default function PhotoSlideshow({
  urls,
  alt,
  aspectClassName = "aspect-[16/10]",
}: PhotoSlideshowProps) {
  const photos = urls.filter((url) => typeof url === "string" && url.trim());
  // Prefer the 2nd photo as the card preview when available
  const initialIndex = photos.length > 1 ? 1 : 0;
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(photos.length > 1 ? 1 : 0);
  }, [photos.join("|")]);

  if (photos.length === 0) {
    return (
      <div
        className={`flex ${aspectClassName} items-center justify-center bg-zinc-100 text-xs font-semibold text-zinc-400`}
      >
        No photo
      </div>
    );
  }

  const go = (delta: number, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((current) => (current + delta + photos.length) % photos.length);
  };

  return (
    <div className={`relative overflow-hidden bg-zinc-100 ${aspectClassName}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[index]}
        alt={`${alt} ${index + 1}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />

      {photos.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => go(-1, e)}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => go(1, e)}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/45 px-2 py-1 backdrop-blur-sm">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Photo ${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition ${
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
          <span className="absolute right-2 top-2 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            {index + 1}/{photos.length}
          </span>
        </>
      ) : null}
    </div>
  );
}
