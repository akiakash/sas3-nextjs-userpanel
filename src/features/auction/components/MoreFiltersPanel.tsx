/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useMemo } from 'react';
import type { AuctionFilters } from '@/lib/auction-api';
import {
  MILEAGE_BUCKETS,
  sanitizeFilterTransmissions,
  sanitizeFilterYears,
  sortAuctionRates,
} from '../auction-utils';

export interface AuctionSelection {
  dates: string[];
  makes: string[];
  models: string[];
  auctions: string[];
  rates: string[];
  colors: string[];
  grades: string[];
  transmissions: string[];
  results: string[];
  lotNo: string;
  /** Free-text chassis / model-type codes (comma or space separated). */
  chassisText: string;
  chassisModels: string[];
  dateFrom: string;
  dateTo: string;
  yearFrom?: number;
  yearTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  displacementFrom?: number;
  displacementTo?: number;
}

type ToggleKey =
  | 'dates'
  | 'makes'
  | 'models'
  | 'auctions'
  | 'rates'
  | 'colors'
  | 'grades'
  | 'chassisModels'
  | 'transmissions'
  | 'results';

type RangeKey =
  | 'yearFrom'
  | 'yearTo'
  | 'mileageFrom'
  | 'mileageTo'
  | 'displacementFrom'
  | 'displacementTo';

export function MoreFiltersPanel({
  filters,
  cascadeLoading,
  selection,
  onToggle,
  onChange,
}: {
  filters: AuctionFilters;
  cascadeLoading: boolean;
  selection: AuctionSelection;
  onToggle: (key: ToggleKey, value: string) => void;
  onChange: (patch: Partial<AuctionSelection>) => void;
}) {
  const years = useMemo(() => sanitizeFilterYears(filters.years), [filters.years]);
  const transmissionOptions = useMemo(
    () => sanitizeFilterTransmissions(filters.transmissions),
    [filters.transmissions],
  );
  const rateOptions = useMemo(() => sortAuctionRates(filters.rates), [filters.rates]);
  const displacements = useMemo(
    () => [...filters.displacements].sort((a, b) => a - b),
    [filters.displacements],
  );

  const setRange = (key: RangeKey) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ [key]: e.target.value ? Number(e.target.value) : undefined });
  };

  return (
    <div className="auction-legacy-col auction-legacy-more">
      <div className="auction-legacy-col-head">More Filters</div>
      <div className="auction-legacy-col-body auction-legacy-more-body">
        <div className="auction-legacy-more-section auction-legacy-more-dropdowns">
          <div className="auction-legacy-dropdown-row">
            <select
              className="auction-legacy-select"
              value={selection.yearFrom ?? ''}
              onChange={setRange('yearFrom')}
              aria-label="Year from"
            >
              <option value="">Year From</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              className="auction-legacy-select"
              value={selection.yearTo ?? ''}
              onChange={setRange('yearTo')}
              aria-label="Year to"
            >
              <option value="">Year To</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="auction-legacy-dropdown-row">
            <select
              className="auction-legacy-select"
              value={selection.mileageFrom ?? ''}
              onChange={setRange('mileageFrom')}
              aria-label="Mileage from"
            >
              <option value="">Mileage From</option>
              {MILEAGE_BUCKETS.map(m => (
                <option key={m} value={m}>{m.toLocaleString()}</option>
              ))}
            </select>
            <select
              className="auction-legacy-select"
              value={selection.mileageTo ?? ''}
              onChange={setRange('mileageTo')}
              aria-label="Mileage to"
            >
              <option value="">Mileage To</option>
              {MILEAGE_BUCKETS.map(m => (
                <option key={m} value={m}>{m.toLocaleString()}</option>
              ))}
            </select>
          </div>

          <div className="auction-legacy-dropdown-row">
            <select
              className="auction-legacy-select"
              value={selection.transmissions[0] ?? ''}
              onChange={e =>
                onChange({ transmissions: e.target.value ? [e.target.value] : [] })
              }
              aria-label="Transmission"
            >
              <option value="">Transmission</option>
              {transmissionOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              className="auction-legacy-select"
              value={selection.colors[0] ?? ''}
              onChange={e => onChange({ colors: e.target.value ? [e.target.value] : [] })}
              aria-label="Color"
            >
              <option value="">{cascadeLoading ? 'Loading…' : 'Colors'}</option>
              {filters.colors.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="auction-legacy-dropdown-row">
            <select
              className="auction-legacy-select"
              value={selection.displacementFrom ?? ''}
              onChange={setRange('displacementFrom')}
              aria-label="Displacement"
            >
              <option value="">Displacement</option>
              {displacements.map(d => (
                <option key={d} value={d}>{d.toLocaleString()} cc</option>
              ))}
            </select>
            <select
              className="auction-legacy-select"
              value={selection.results[0] ?? ''}
              onChange={e => onChange({ results: e.target.value ? [e.target.value] : [] })}
              aria-label="Status"
            >
              <option value="">{cascadeLoading ? 'Loading…' : 'Status'}</option>
              {filters.results.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="auction-legacy-more-section auction-legacy-more-section-grow">
          <div className="auction-legacy-more-label-row">
            <p className="auction-legacy-more-label">Auction Grade</p>
            {cascadeLoading && (
              <span className="auction-legacy-more-hint">Loading …</span>
            )}
          </div>

          {rateOptions.length === 0 && !cascadeLoading && (
            <p className="auction-legacy-more-empty">No grades available</p>
          )}

          {rateOptions.length > 0 && (
            <div className="auction-legacy-grade-grid auction-legacy-grade-grid-full">
              {rateOptions.map(rate => (
                <label key={rate} className="auction-legacy-grade-check">
                  <input
                    type="checkbox"
                    checked={selection.rates.includes(rate)}
                    onChange={() => onToggle('rates', rate)}
                  />
                  <span>{rate}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
