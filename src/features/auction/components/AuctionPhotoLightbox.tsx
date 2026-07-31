/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export function AuctionPhotoLightbox({
  images,
  index,
  title,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  title?: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onIndexChange(index - 1);
  }, [hasPrev, index, onIndexChange]);

  const goNext = useCallback(() => {
    if (hasNext) onIndexChange(index + 1);
  }, [hasNext, index, onIndexChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, goPrev, goNext]);

  if (images.length === 0) return null;

  return (
    <div
      className="auction-photo-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Vehicle photos'}
      onClick={onClose}
    >
      <div className="auction-photo-lightbox-inner" onClick={e => e.stopPropagation()}>
        <div className="auction-photo-lightbox-toolbar">
          <div className="auction-photo-lightbox-meta glass-chip">
            {title && <p className="auction-photo-lightbox-title">{title}</p>}
            <p className="auction-photo-lightbox-counter">
              {index + 1} / {images.length}
            </p>
          </div>
          <button
            type="button"
            className="auction-photo-lightbox-close glass-chip"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="auction-photo-lightbox-stage">
          {hasPrev && (
            <button
              type="button"
              className="auction-photo-lightbox-nav glass-chip prev"
              onClick={goPrev}
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          <img
            src={images[index]}
            alt={title ? `${title} — photo ${index + 1}` : `Photo ${index + 1}`}
            className="auction-photo-lightbox-image"
          />

          {hasNext && (
            <button
              type="button"
              className="auction-photo-lightbox-nav glass-chip next"
              onClick={goNext}
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="auction-photo-lightbox-thumbs glass-chip">
            {images.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                className={`auction-photo-lightbox-thumb${i === index ? ' active' : ''}`}
                onClick={() => onIndexChange(i)}
                aria-label={`View photo ${i + 1}`}
              >
                <img src={url} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
