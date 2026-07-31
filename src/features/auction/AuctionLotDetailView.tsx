/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { type AuctionLot, getLot, getUssImages } from '@/lib/auction-api';
import { formatAuctionPrice, formatAuctionResultPrice, formatAuctionResult } from './auction-utils';

export default function AuctionLotDetailView() {
  const params = useParams();
  const lotId = decodeURIComponent(String(params.lotId ?? ''));
  const [lot, setLot] = useState<AuctionLot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [ussImages, setUssImages] = useState<string[] | null>(null);
  const [loadingUss, setLoadingUss] = useState(false);
  const [ussError, setUssError] = useState<string | null>(null);

  useEffect(() => {
    if (!lotId) return;
    getLot(lotId)
      .then(setLot)
      .catch(err => setLoadError(err instanceof Error ? err.message : 'Lot not found'));
  }, [lotId]);

  const loadUssImages = async () => {
    if (!lot) return;
    setLoadingUss(true);
    setUssError(null);
    try {
      const res = await getUssImages({
        date: lot.lotDate,
        auctionId: lot.auctRef,
        lotNumber: lot.bid,
      });
      setUssImages(res.imagesUrls);
    } catch (err) {
      setUssImages([]);
      setUssError(err instanceof Error ? err.message : 'USS images unavailable');
    } finally {
      setLoadingUss(false);
    }
  };

  if (loadError) {
    return (
      <div className="auction-page">
        <Link href="/vehicles/auction" className="auction-back-link">
          <ArrowLeft size={16} /> Back to search
        </Link>
        <div className="auction-error-banner">
          <AlertCircle size={18} />
          <span>{loadError}</span>
        </div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="auction-page">
        <p className="auction-loading">Loading lot…</p>
      </div>
    );
  }

  return (
    <div className="auction-page auction-detail-page">
      <Link href="/vehicles/auction" className="auction-back-link">
        <ArrowLeft size={16} /> Back to search
      </Link>

      <header className="auction-detail-head">
        <div>
          <p className="auction-page-eyebrow">{lot.auctionName} · {lot.lotDate}</p>
          <h1 className="auction-page-title">
            {lot.company} {lot.modelNameEn}
          </h1>
          <p className="auction-page-subtitle">
            Lot {lot.bid} · {lot.modelTypeEn} · {lot.modelYearEn}
          </p>
        </div>
        <dl className="auction-detail-prices">
          <div>
            <dt>Start</dt>
            <dd>{formatAuctionPrice(lot.startPrice, { allowZero: true })}</dd>
          </div>
          <div>
            <dt>End</dt>
            <dd>{formatAuctionResultPrice(lot.endPrice, formatAuctionResult(lot).tone)}</dd>
          </div>
        </dl>
      </header>

      <div className="auction-detail-grid">
        <section className="auction-detail-panel">
          <h2>Photos</h2>
          <div className="auction-gallery">
            {lot.imageUrls.map(url => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="auction-gallery-item">
                <img src={url} alt="" loading="lazy" />
              </a>
            ))}
          </div>

          <div className="auction-uss-section">
            {ussImages === null ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-brand-red hover:text-brand-red disabled:opacity-60"
                onClick={loadUssImages}
                disabled={loadingUss}
              >
                {loadingUss ? (
                  <>
                    <Loader2 size={16} className="auction-spin" />
                    Fetching from Aleado (may take a minute)…
                  </>
                ) : (
                  'Load USS auction sheet images'
                )}
              </button>
            ) : ussImages.length === 0 ? (
              <p className="auction-uss-empty">
                {ussError ?? 'No USS images available for this lot.'}
              </p>
            ) : (
              <div className="auction-gallery">
                {ussImages.map(url => (
                  <a key={url} href={url} target="_blank" rel="noreferrer" className="auction-gallery-item">
                    <img src={url} alt="" loading="lazy" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="auction-detail-panel">
          <h2>Vehicle details</h2>
          <dl className="auction-detail-dl">
            <div><dt>Score</dt><dd>{lot.scoresEn}</dd></div>
            <div><dt>Grade</dt><dd>{lot.gradeEn}</dd></div>
            <div><dt>Color</dt><dd>{lot.colorEn}</dd></div>
            <div><dt>Mileage</dt><dd>{Number(lot.mileage).toLocaleString()} km</dd></div>
            <div><dt>Displacement</dt><dd>{lot.displacement} cc</dd></div>
            <div><dt>Transmission</dt><dd>{lot.transmissionEn}</dd></div>
            <div><dt>Equipment</dt><dd>{lot.equipmentEn || '—'}</dd></div>
            <div><dt>Auction ref</dt><dd>{lot.auctRef}</dd></div>
            <div><dt>Lot ID</dt><dd className="auction-detail-mono">{lot.lotId}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}
