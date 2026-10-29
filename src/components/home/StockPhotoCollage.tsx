"use client";

type StockPhotoCollageProps = {
  urls: string[];
  alt: string;
};

function cleanUrls(urls: string[]): string[] {
  return urls
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter((url) => url.length > 0);
}

/** Prefer 2nd photo as lead when available; rest follow in original order minus lead. */
function orderedPhotos(urls: string[]): string[] {
  const photos = cleanUrls(urls);
  if (photos.length <= 1) return photos;
  const lead = photos[1];
  const rest = photos.filter((_, i) => i !== 1);
  return [lead, ...rest];
}

export default function StockPhotoCollage({ urls, alt }: StockPhotoCollageProps) {
  const photos = orderedPhotos(urls);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-sm font-semibold text-zinc-400">
        No photos
      </div>
    );
  }

  if (photos.length === 1) {
    return (
      <a
        href={photos[0]}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[0]}
          alt={alt}
          className="aspect-[16/10] w-full object-cover"
          loading="lazy"
        />
      </a>
    );
  }

  const [lead, ...rest] = photos;

  return (
    <div className="grid h-[min(420px,70vw)] grid-cols-1 gap-1 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
      <a
        href={lead}
        target="_blank"
        rel="noreferrer"
        className="relative block min-h-[200px] overflow-hidden bg-zinc-100 sm:col-span-2 sm:h-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lead}
          alt={`${alt} — main`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </a>
      <div className="flex max-h-[220px] flex-col gap-1 overflow-y-auto sm:max-h-none sm:h-full">
        {rest.map((url, index) => (
          <a
            key={`${url}-${index}`}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="relative block min-h-[88px] flex-1 overflow-hidden bg-zinc-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${alt} ${index + 2}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
