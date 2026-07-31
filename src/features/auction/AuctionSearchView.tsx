/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  type AuctionFilters,
  type SearchResult,
  getFilters,
  getModelCounts,
  mergeCascadeFilters,
  searchLots,
} from '@/lib/auction-api';
import { formatAuctionDateLabel, sanitizeFilterYears } from './auction-utils';
import { AuctionColumn } from './components/AuctionColumn';
import { ChassisModelColumn } from './components/ChassisModelColumn';
import { DateColumn } from './components/DateColumn';
import { MakeColumn } from './components/MakeColumn';
import { ModelColumn } from './components/ModelColumn';
import { MoreFiltersPanel, type AuctionSelection } from './components/MoreFiltersPanel';
import { ResultsGrid } from './components/ResultsGrid';

const EMPTY_SELECTION: AuctionSelection = {
  dates: [],
  makes: [],
  models: [],
  auctions: [],
  rates: [],
  colors: [],
  grades: [],
  transmissions: [],
  results: [],
  lotNo: '',
  chassisText: '',
  chassisModels: [],
  dateFrom: '',
  dateTo: '',
};

type ToggleKey = keyof Omit<
  AuctionSelection,
  | 'lotNo'
  | 'chassisText'
  | 'dateFrom'
  | 'dateTo'
  | 'yearFrom'
  | 'yearTo'
  | 'mileageFrom'
  | 'mileageTo'
  | 'displacementFrom'
  | 'displacementTo'
>;

function pruneSelectionToFilters(
  selection: AuctionSelection,
  filters: AuctionFilters,
): AuctionSelection {
  const validYears = new Set(sanitizeFilterYears(filters.years));
  const validDisplacements = new Set(filters.displacements);

  return {
    ...selection,
    models: selection.models.filter(m => filters.models.includes(m)),
    rates: selection.rates.filter(r => filters.rates.includes(r)),
    colors: selection.colors.filter(c => filters.colors.includes(c)),
    grades: selection.grades.filter(g => filters.grades.includes(g)),
    transmissions: selection.transmissions.filter(t => filters.transmissions.includes(t)),
    results: selection.results.filter(r => filters.results.includes(r)),
    chassisModels: selection.chassisModels.filter(c => filters.modelTypes.includes(c)),
    yearFrom:
      selection.yearFrom != null && validYears.has(String(selection.yearFrom))
        ? selection.yearFrom
        : undefined,
    yearTo:
      selection.yearTo != null && validYears.has(String(selection.yearTo))
        ? selection.yearTo
        : undefined,
    displacementFrom:
      selection.displacementFrom != null && validDisplacements.has(selection.displacementFrom)
        ? selection.displacementFrom
        : undefined,
    displacementTo:
      selection.displacementTo != null && validDisplacements.has(selection.displacementTo)
        ? selection.displacementTo
        : undefined,
  };
}

function formatApiError(err: unknown, fallback: string): string {
  const message = err instanceof Error ? err.message : fallback;
  return message === 'Failed to fetch'
    ? 'Could not reach the API. Ensure the NestJS backend is running on port 3001.'
    : message;
}

export default function AuctionSearchView() {
  const [filters, setFilters] = useState<AuctionFilters | null>(null);
  const [filtersError, setFiltersError] = useState<string | null>(null);
  const [selection, setSelection] = useState<AuctionSelection>(EMPTY_SELECTION);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [cascadeLoading, setCascadeLoading] = useState(false);
  const [modelCounts, setModelCounts] = useState<Record<string, number>>({});
  const [modelCountsLoading, setModelCountsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filtersHidden, setFiltersHidden] = useState(false);
  const globalFiltersRef = useRef<AuctionFilters | null>(null);
  const selectionRef = useRef(selection);
  const perPageRef = useRef(perPage);
  const searchSeqRef = useRef(0);
  const resultsSectionRef = useRef<HTMLElement | null>(null);

  perPageRef.current = perPage;

  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  function buildSearchParams(nextPage: number, nextPerPage: number): Parameters<typeof searchLots>[0] {
    const sel = selectionRef.current;
    return {
      auction_date: sel.dates.length ? sel.dates : undefined,
      marka_name: sel.makes.length ? sel.makes : undefined,
      model_name: sel.models.length ? sel.models : undefined,
      auction: sel.auctions.length ? sel.auctions : undefined,
      model_type: sel.chassisModels.length ? sel.chassisModels : undefined,
      rate: sel.rates.length ? sel.rates : undefined,
      color: sel.colors.length ? sel.colors : undefined,
      grade: sel.grades.length ? sel.grades : undefined,
      result: sel.results.length ? sel.results : undefined,
      transmission: sel.transmissions.length ? sel.transmissions : undefined,
      year_from: sel.yearFrom,
      year_to: sel.yearTo,
      mileage_from: sel.mileageFrom,
      mileage_to: sel.mileageTo,
      displacement_from: sel.displacementFrom,
      displacement_to: sel.displacementTo,
      lot_no: sel.lotNo.trim() || undefined,
      sort: 'lot_date',
      seq: 'DESC',
      page: nextPage,
      per_page: nextPerPage,
    };
  }

  function scrollToResults() {
    requestAnimationFrame(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const runSearch = useCallback(async (nextPage = 0, nextPerPage?: number) => {
    const per = nextPerPage ?? perPageRef.current;
    const seq = ++searchSeqRef.current;

    setLoading(true);
    setSearchError(null);

    try {
      const res = await searchLots(buildSearchParams(nextPage, per));
      if (seq !== searchSeqRef.current) return;

      setResults(res);
      setPage(nextPage);
      if (nextPerPage != null) setPerPage(nextPerPage);
      scrollToResults();
    } catch (err) {
      if (seq !== searchSeqRef.current) return;
      setSearchError(formatApiError(err, 'Search failed'));
    } finally {
      if (seq === searchSeqRef.current) setLoading(false);
    }
  }, []);

  const loadAuctionData = useCallback(async () => {
    setLoadingFilters(true);
    setFiltersError(null);
    setSearchError(null);

    try {
      const data = await getFilters();
      globalFiltersRef.current = data;
      setFilters(data);
      setLoadingFilters(false);

      const defaultDate = data.dates[0];
      if (defaultDate) {
        const nextSelection = { ...EMPTY_SELECTION, dates: [defaultDate] };
        setSelection(nextSelection);
        selectionRef.current = nextSelection;
      }

      await runSearch(0, 20);
    } catch (err) {
      setFiltersError(formatApiError(err, 'Failed to load auction filters'));
      setFilters(null);
      setLoadingFilters(false);
    }
  }, [runSearch]);

  useEffect(() => {
    loadAuctionData();
  }, [loadAuctionData]);

  const makesKey = selection.makes.join(',');
  const modelsKey = selection.models.join(',');
  const datesKey = selection.dates.join(',');
  const auctionsKey = selection.auctions.join(',');
  const modelListKey = filters?.models.join(',') ?? '';

  useEffect(() => {
    if (!globalFiltersRef.current) return;
    if (!selection.makes.length && !selection.models.length) return;

    let cancelled = false;
    setCascadeLoading(true);

    getFilters(selection.makes, selection.models)
      .then(narrowed => {
        if (cancelled || !globalFiltersRef.current) return;

        const merged = mergeCascadeFilters(globalFiltersRef.current, narrowed);
        setFilters(merged);
        setSelection(prev => pruneSelectionToFilters(prev, merged));
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setCascadeLoading(false);
      });

    return () => { cancelled = true; };
  }, [makesKey, modelsKey]);

  useEffect(() => {
    let cancelled = false;

    if (!selection.makes.length || !filters?.models.length) {
      setModelCounts({});
      setModelCountsLoading(false);
      return () => { cancelled = true; };
    }

    setModelCountsLoading(true);
    getModelCounts(selection.makes, filters.models, {
      dates: selection.dates,
      auctions: selection.auctions,
    })
      .then(counts => {
        if (!cancelled) setModelCounts(counts);
      })
      .catch(() => {
        if (!cancelled) setModelCounts({});
      })
      .finally(() => {
        if (!cancelled) setModelCountsLoading(false);
      });

    return () => { cancelled = true; };
  }, [makesKey, modelListKey, datesKey, auctionsKey, filters?.models]);

  const toggle = useCallback((key: ToggleKey, value: string) => {
    setSelection(prev => {
      const list = prev[key] as string[];
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter(v => v !== value)
          : [...list, value],
      };
    });
  }, []);

  const selectMake = useCallback((value: string) => {
    setSelection(prev => ({
      ...prev,
      makes: prev.makes[0] === value ? [] : [value],
      models: [],
      rates: [],
      colors: [],
      grades: [],
      transmissions: [],
      results: [],
      chassisModels: [],
      yearFrom: undefined,
      yearTo: undefined,
      displacementFrom: undefined,
      displacementTo: undefined,
    }));
  }, []);

  const reset = useCallback(() => {
    setSelection(EMPTY_SELECTION);
    selectionRef.current = EMPTY_SELECTION;
    setResults(null);
    setPage(0);
    setSearchError(null);
    setModelCounts({});
    if (globalFiltersRef.current) {
      setFilters(globalFiltersRef.current);
    }
  }, []);

  const clearFiltersForEmptyDate = useCallback((dateLabel: string) => {
    setSelection(EMPTY_SELECTION);
    selectionRef.current = EMPTY_SELECTION;
    setResults(null);
    setPage(0);
    setModelCounts({});
    setSearchError(`No lots on ${dateLabel}. Filters cleared — pick another date.`);
    if (globalFiltersRef.current) {
      setFilters(globalFiltersRef.current);
    }
  }, []);

  const handleDateToggle = useCallback(async (value: string) => {
    const prev = selectionRef.current;
    const nextDates = prev.dates.includes(value)
      ? prev.dates.filter(v => v !== value)
      : [...prev.dates, value];

    const nextSelection = { ...prev, dates: nextDates };
    setSelection(nextSelection);
    selectionRef.current = nextSelection;

    if (nextDates.length === 0) {
      setResults(null);
      setPage(0);
      setSearchError(null);
      return;
    }

    const seq = ++searchSeqRef.current;
    setLoading(true);
    setSearchError(null);

    try {
      const res = await searchLots({
        ...buildSearchParams(0, perPageRef.current),
        auction_date: nextDates,
      });
      if (seq !== searchSeqRef.current) return;

      if (res.meta.total === 0) {
        clearFiltersForEmptyDate(formatAuctionDateLabel(value));
        return;
      }

      setResults(res);
      setPage(0);
      scrollToResults();
    } catch (err) {
      if (seq !== searchSeqRef.current) return;
      setSearchError(formatApiError(err, 'Search failed'));
    } finally {
      if (seq === searchSeqRef.current) setLoading(false);
    }
  }, [clearFiltersForEmptyDate]);

  const resultDate = useMemo(
    () => selection.dates[0] ?? results?.data[0]?.lotDate,
    [selection.dates, results?.data],
  );

  const chassisEmptyLabel = useMemo(() => {
    if (selection.makes.length === 0) return 'Select a make first';
    return 'No chassis codes for this selection';
  }, [selection.makes.length]);

  if (loadingFilters) {
    return (
      <div className="auction-page">
        <header className="auction-page-header">
          <p className="auction-page-eyebrow">Vehicles · Auction</p>
          <h1 className="auction-page-title">Auction Search</h1>
        </header>
        <div className="auction-loading-card">
          <div className="auction-loading-spinner" aria-hidden />
          <p>Loading auction data…</p>
          <p className="auction-lots-loading-hint">Connecting to the backend. This may take a few seconds.</p>
        </div>
      </div>
    );
  }

  if (filtersError || !filters) {
    return (
      <div className="auction-page">
        <header className="auction-page-header">
          <p className="auction-page-eyebrow">Vehicles · Auction</p>
          <h1 className="auction-page-title">Auction Search</h1>
        </header>
        <div className="auction-error-banner">
          <AlertCircle size={18} />
          <div>
            <strong>Cannot load auction data</strong>
            <p>{filtersError ?? 'Unknown error'}</p>
            <p className="auction-error-hint">
              Ensure NestJS is running on port 3001, then retry. API proxy: <code>/backend</code> →{' '}
              {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}
            </p>
            <button
              type="button"
              className="auction-error-retry-btn auction-error-retry-btn-block"
              disabled={loadingFilters}
              onClick={() => loadAuctionData()}
            >
              {loadingFilters ? 'Retrying…' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auction-page">
      <header className="auction-page-header">
        <div>
          <p className="auction-page-eyebrow">Vehicles · Auction</p>
          <h1 className="auction-page-title">Auction Search</h1>
          <p className="auction-page-subtitle">
            Filter by date, make, model, and grade — then search live auction lots.
          </p>
        </div>
      </header>

      {!filtersHidden && (
        <section className="auction-search-panel">
          <div className="auction-legacy-filter-grid">
            <DateColumn
              options={filters.dates}
              selected={selection.dates}
              onToggle={handleDateToggle}
            />
            <MakeColumn
              options={filters.makes}
              selected={selection.makes}
              onSelect={selectMake}
            />
            <ModelColumn
              options={filters.models}
              selected={selection.models}
              counts={selection.makes.length > 0 ? modelCounts : undefined}
              countsLoading={modelCountsLoading}
              onToggle={v => toggle('models', v)}
              emptyLabel={selection.makes.length === 0 ? 'Select a make first' : 'No models'}
            />
            <MoreFiltersPanel
              filters={filters}
              cascadeLoading={cascadeLoading}
              selection={selection}
              onToggle={toggle}
              onChange={patch => setSelection(prev => ({ ...prev, ...patch }))}
            />
            <ChassisModelColumn
              options={filters.modelTypes}
              selected={selection.chassisModels}
              onToggle={v => toggle('chassisModels', v)}
              emptyLabel={chassisEmptyLabel}
            />
            <AuctionColumn
              options={filters.auctions}
              selected={selection.auctions}
              onToggle={v => toggle('auctions', v)}
            />
          </div>

          <div className="auction-legacy-actions">
            <button
              type="button"
              className="auction-legacy-action-btn primary"
              disabled={loading}
              onClick={() => runSearch(0)}
            >
              {loading ? (
                <>
                  <span className="auction-btn-spinner" aria-hidden />
                  Searching…
                </>
              ) : (
                'Search lots'
              )}
            </button>
            <button
              type="button"
              className="auction-legacy-action-btn secondary"
              disabled={loading}
              onClick={reset}
            >
              Reset filters
            </button>
          </div>
        </section>
      )}

      <section ref={resultsSectionRef} className="auction-results-section">
      {searchError && (
        <div className="auction-error-banner compact auction-error-banner-with-action">
          <AlertCircle size={16} />
          <span>{searchError}</span>
          <button
            type="button"
            className="auction-error-retry-btn"
            disabled={loading}
            onClick={() => runSearch(page)}
          >
            Retry
          </button>
        </div>
      )}

      {loading && !results && (
        <div className="auction-lots-loading-panel" aria-busy="true" aria-live="polite">
          <div className="auction-loading-spinner" aria-hidden />
          <p>Loading lots…</p>
          <p className="auction-lots-loading-hint">This can take a few seconds on first load.</p>
        </div>
      )}

      {results && (
        <ResultsGrid
          result={results}
          page={page}
          perPage={perPage}
          resultDate={resultDate}
          filtersHidden={filtersHidden}
          onToggleFilters={() => setFiltersHidden(h => !h)}
          onPerPageChange={n => {
            setPerPage(n);
            runSearch(0, n);
          }}
          onPageChange={p => runSearch(p)}
          loading={loading}
        />
      )}

      {!results && !loading && !searchError && !filtersHidden && (
        <p className="auction-legacy-results-hint">
          Pick filters above, then click <strong>Search lots</strong> to view results.
        </p>
      )}
      </section>
    </div>
  );
}
