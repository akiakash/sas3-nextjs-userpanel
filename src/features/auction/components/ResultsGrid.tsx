"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { AuctionLot, SearchResult } from "@/lib/auction-api";
import { ApiError } from "@/lib/api-client";
import {
  addToWishlist,
  getWishlistLotIds,
  removeWishlistByLotId,
} from "@/lib/customer-wishlist-api";
import SendForBidModal from "@/components/customer/SendForBidModal";
import { AuctionPhotoLightbox } from "./AuctionPhotoLightbox";
import {
  equipmentLetters,
  formatAuctionResult,
  formatMetric,
  formatResultsDateLabel,
  formatAuctionPrice,
  formatAuctionResultPrice,
  mockTimeLeft,
} from "../auction-utils";

export type ResultsGridVariant = "auction" | "sale-stats";

const PER_PAGE_OPTIONS = [20, 50, 100] as const;

const RESULT_TONE_CLASS = {
  available: "auction-legacy-available",
  unsold: "auction-legacy-unsold",
  sold: "auction-legacy-sold",
  neutral: "auction-legacy-neutral",
} as const;

function LotPhotos({
  lot,
  onOpenGallery,
}: {
  lot: AuctionLot;
  onOpenGallery: (images: string[], startIndex: number) => void;
}) {
  const urls = lot.imageUrls.filter(Boolean);
  const thumbs = [...urls.slice(0, 3)];
  while (thumbs.length < 3) thumbs.push("");

  return (
    <div className="auction-legacy-photos">
      {thumbs.map((url, i) => (
        <div key={`${lot.lotId}-img-${i}`} className="auction-legacy-photo-cell">
          {url ? (
            <button
              type="button"
              className="auction-legacy-photo-btn"
              onClick={() => onOpenGallery(urls, i)}
              aria-label={`View photos for lot ${lot.bid}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" loading="lazy" />
            </button>
          ) : (
            <span className="auction-legacy-photo-empty" />
          )}
        </div>
      ))}
    </div>
  );
}

function StackCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td>
      <div
        className={`auction-legacy-stack-cell${className ? ` ${className}` : ""}`}
      >
        {children}
      </div>
    </td>
  );
}

export function ResultsGrid({
  result,
  page,
  perPage,
  resultDate,
  filtersHidden,
  onToggleFilters,
  onPerPageChange,
  onPageChange,
  loading,
}: {
  result: SearchResult;
  page: number;
  perPage: number;
  resultDate?: string;
  filtersHidden: boolean;
  onToggleFilters: () => void;
  onPerPageChange: (n: number) => void;
  onPageChange: (page: number) => void;
  loading?: boolean;
  variant?: ResultsGridVariant;
}) {
  const lots = useMemo(() => result.data, [result.data]);
  const [bidLot, setBidLot] = useState<AuctionLot | null>(null);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [wishlistBusy, setWishlistBusy] = useState<string | null>(null);

  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getWishlistLotIds()
      .then((ids) => {
        if (!cancelled) setWishlistIds(new Set(ids));
      })
      .catch(() => {
        /* ignore — user may not be authed yet */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleWishlist = async (lot: AuctionLot) => {
    if (!lot.lotId || wishlistBusy) return;
    setWishlistBusy(lot.lotId);
    const saved = wishlistIds.has(lot.lotId);
    try {
      if (saved) {
        await removeWishlistByLotId(lot.lotId);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(lot.lotId);
          return next;
        });
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(lot.lotId);
        setWishlistIds((prev) => new Set(prev).add(lot.lotId));
        toast.success("Saved to wishlist");
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Wishlist update failed",
      );
    } finally {
      setWishlistBusy(null);
    }
  };

  const openGallery = (
    lot: AuctionLot,
    images: string[],
    startIndex: number,
  ) => {
    if (images.length === 0) return;
    setLightbox({
      images,
      index: Math.max(0, startIndex),
      title: `${lot.company} ${lot.modelNameEn} · Lot ${lot.bid}`,
    });
  };

  const totalPages = Math.max(
    1,
    Math.ceil(result.meta.total / result.meta.perPage),
  );
  const pageNums = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const max = Math.min(totalPages, 10);
    for (let i = 0; i < max; i += 1) pages.push(i);
    if (totalPages > 10) pages.push("ellipsis");
    return pages;
  }, [totalPages]);

  if (result.meta.total === 0) {
    return (
      <div className="auction-legacy-results-wrap auction-legacy-results-empty">
        <div className="auction-legacy-results-empty-body">
          <p className="auction-legacy-results-empty-title">No lots found</p>
          <p className="auction-legacy-results-empty-text">
            Try a different auction date, make, or model — future dates may not
            have lots yet.
          </p>
        </div>
        <button
          type="button"
          className="auction-legacy-hide-btn"
          onClick={onToggleFilters}
        >
          {filtersHidden ? "Show All Search +" : "Hide All Search -"}
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`auction-legacy-results-wrap${loading ? " is-loading" : ""}`}
      >
        {loading && (
          <div
            className="auction-legacy-results-loading"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="auction-loading-spinner" aria-hidden />
            <span>Loading lots…</span>
          </div>
        )}
        <div className="auction-legacy-results-top">
          <div className="auction-legacy-results-meta">
            {resultDate && (
              <span>
                Results for the date:{" "}
                <strong>{formatResultsDateLabel(resultDate)}</strong>
              </span>
            )}
            <span>
              Total Records:{" "}
              <strong>{result.meta.total.toLocaleString()}</strong>
            </span>
          </div>

          <div className="auction-legacy-top-pager">
            {pageNums.map((p, i) =>
              p === "ellipsis" ? (
                <span key={`e-${i}`} className="auction-legacy-page-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`auction-legacy-page-num${page === p ? " active" : ""}`}
                  onClick={() => onPageChange(p)}
                  disabled={loading}
                >
                  {p + 1}
                </button>
              ),
            )}
            <button
              type="button"
              className="auction-legacy-page-next"
              disabled={page + 1 >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>
          </div>

          <div className="auction-legacy-results-top-right">
            <button
              type="button"
              className="auction-legacy-hide-btn"
              onClick={onToggleFilters}
            >
              {filtersHidden ? "Show All Search +" : "Hide All Search -"}
            </button>
            <label className="auction-legacy-per-page">
              Per Page
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(Number(e.target.value))}
                disabled={loading}
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="auction-legacy-results-scroll">
          <table className="auction-legacy-results-table">
            <colgroup>
              <col className="auction-col-photo" />
              <col className="auction-col-lot" />
              <col className="auction-col-date" />
              <col className="auction-col-model" />
              <col className="auction-col-chassis" />
              <col className="auction-col-engine" />
              <col className="auction-col-trans" />
              <col className="auction-col-grade" />
              <col className="auction-col-price" />
              <col className="auction-col-result" />
            </colgroup>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Lot Number</th>
                <th>
                  Auction Date
                  <br />
                  Auction Hall
                </th>
                <th>
                  Model Name
                  <br />
                  Year
                </th>
                <th>
                  Chassis No.
                  <br />
                  Model Grade
                </th>
                <th>
                  Engine (CC)
                  <br />
                  Mileage (KM)
                </th>
                <th>
                  Trans.
                  <br />
                  Color
                </th>
                <th>Auction Grade</th>
                <th>
                  Start Price
                  <br />
                  Result Price
                </th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => {
                const badges = equipmentLetters(lot.equipmentEn);
                const timeLeft = mockTimeLeft(lot.lotId);
                const resultDisplay = formatAuctionResult(lot);
                const gradeLabel = lot.gradeEn || "—";

                return (
                  <tr key={lot.lotId}>
                    <td className="auction-legacy-photo-col">
                      <LotPhotos
                        lot={lot}
                        onOpenGallery={(images, startIndex) =>
                          openGallery(lot, images, startIndex)
                        }
                      />
                    </td>
                    <td className="auction-legacy-lot-cell">
                      <div className="auction-legacy-lot-stack">
                        <div className="auction-legacy-lot-badge">{lot.bid}</div>
                        <Link
                          href={`/vehicles/auction/${encodeURIComponent(lot.lotId)}`}
                          className="auction-legacy-lot-btn auction-legacy-lot-btn-link"
                        >
                          View Lot
                        </Link>
                        <button
                          type="button"
                          className="auction-legacy-lot-btn"
                          onClick={() => setBidLot(lot)}
                        >
                          Send for Bid
                        </button>
                        <button
                          type="button"
                          className="auction-legacy-lot-btn"
                          disabled={wishlistBusy === lot.lotId}
                          onClick={() => void toggleWishlist(lot)}
                          title={
                            wishlistIds.has(lot.lotId)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          style={{
                            color: wishlistIds.has(lot.lotId)
                              ? "#dc2626"
                              : undefined,
                          }}
                        >
                          <Heart
                            size={12}
                            style={{
                              display: "inline",
                              marginRight: 4,
                              verticalAlign: "middle",
                              fill: wishlistIds.has(lot.lotId)
                                ? "currentColor"
                                : "none",
                            }}
                          />
                          {wishlistIds.has(lot.lotId) ? "Saved" : "Wishlist"}
                        </button>
                      </div>
                    </td>
                    <StackCell>
                      <span>{formatResultsDateLabel(lot.lotDate)}</span>
                      <span className="auction-legacy-time-left">{timeLeft}</span>
                      <span className="auction-legacy-hall">
                        {lot.auctionName}
                      </span>
                    </StackCell>
                    <StackCell>
                      <Link
                        href={`/vehicles/auction/${encodeURIComponent(lot.lotId)}`}
                        className="auction-legacy-model-link"
                      >
                        {lot.modelNameEn || lot.company || "—"}
                      </Link>
                      <span>{lot.modelYearEn || "—"}</span>
                      {badges.length > 0 && (
                        <div className="auction-legacy-equip-badges">
                          {badges.map((b) => (
                            <span
                              key={b}
                              className="auction-legacy-equip-badge"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </StackCell>
                    <StackCell>
                      <span className="auction-legacy-chassis">
                        {lot.modelTypeEn || "—"}
                      </span>
                      <span className="auction-legacy-grade-line">
                        {gradeLabel}
                      </span>
                    </StackCell>
                    <StackCell className="auction-legacy-num-stack">
                      <span>{formatMetric(lot.displacement)}</span>
                      <span>{formatMetric(lot.mileage)}</span>
                    </StackCell>
                    <StackCell>
                      <span>{lot.transmissionEn || "—"}</span>
                      <span>{lot.colorEn || "—"}</span>
                    </StackCell>
                    <td className="auction-legacy-grade-cell">
                      <span>{lot.scoresEn || "—"}</span>
                    </td>
                    <StackCell className="auction-legacy-num-stack auction-legacy-price-stack">
                      <span className="auction-legacy-price-line">
                        <span className="auction-legacy-price-label">Start</span>
                        {formatAuctionPrice(lot.startPrice, { allowZero: true })}
                      </span>
                      <span className="auction-legacy-price-line">
                        <span className="auction-legacy-price-label">
                          Result
                        </span>
                        {formatAuctionResultPrice(
                          lot.endPrice,
                          resultDisplay.tone,
                        )}
                      </span>
                    </StackCell>
                    <td className="auction-legacy-result-cell">
                      <span className={RESULT_TONE_CLASS[resultDisplay.tone]}>
                        {resultDisplay.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {lightbox && (
        <AuctionPhotoLightbox
          images={lightbox.images}
          index={lightbox.index}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
          onIndexChange={(index) =>
            setLightbox((prev) => (prev ? { ...prev, index } : null))
          }
        />
      )}

      <SendForBidModal
        lot={bidLot}
        open={Boolean(bidLot)}
        onClose={() => setBidLot(null)}
      />
    </>
  );
}
