/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function formatAuctionDateLabel(iso: string): string {
  const d = new Date(`${iso}T12:00:00+09:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${mm}/${dd} ${WEEKDAYS[d.getUTCDay()]}`;
}

export function formatResultsDateLabel(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()}-${months[d.getMonth()]}`;
}

/** Aleado auction prices are in 1,000-yen units (e.g. 1480 → ¥1,480,000). */
export function formatAuctionPrice(
  value?: string | number | null,
  options?: { allowZero?: boolean },
): string {
  if (value == null || value === '') return '—';
  const n = Number(String(value).replace(/,/g, ''));
  if (!Number.isFinite(n)) return '—';
  if (n === 0 && !options?.allowZero) return '—';
  return `¥${(n * 1000).toLocaleString()}`;
}

export function formatAuctionResultPrice(
  value?: string | number | null,
  resultTone?: 'available' | 'unsold' | 'sold' | 'neutral',
): string {
  if (resultTone === 'available') return '—';
  return formatAuctionPrice(value, { allowZero: true });
}

export function formatMetric(value?: string | number | null): string {
  if (value == null || value === '') return '—';
  const n = Number(String(value).replace(/,/g, ''));
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString();
}

export type AuctionResultDisplay = {
  label: string;
  tone: 'available' | 'unsold' | 'sold' | 'neutral';
};

export function formatAuctionResult(lot: {
  endPrice?: string;
  resultEn?: string;
}): AuctionResultDisplay {
  const result = (lot.resultEn ?? '').trim().toLowerCase();

  if (result === 'available') {
    return { label: 'Available', tone: 'available' };
  }
  if (result === 'unsold') {
    return { label: 'Unsold', tone: 'unsold' };
  }
  if (result.includes('sold') || result.includes('negotiate')) {
    return { label: 'Sold', tone: 'sold' };
  }

  const endNum = Number(String(lot.endPrice ?? '').replace(/,/g, ''));
  if (!Number.isFinite(endNum) || endNum === 0) {
    return { label: 'Available', tone: 'available' };
  }

  return { label: 'Sold', tone: 'sold' };
}

export const MILEAGE_BUCKETS = [
  10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000,
] as const;

export function sanitizeFilterYears(years: string[]): string[] {
  return years
    .filter(y => /^\d{4}$/.test(y) && y > '1950' && y < '2030')
    .sort((a, b) => b.localeCompare(a));
}

export function sanitizeFilterTransmissions(transmissions: string[]): string[] {
  return transmissions
    .filter(t => /^[A-Z0-9]{2,}$/.test(t))
    .sort((a, b) => a.localeCompare(b));
}

const AUCTION_RATE_ORDER = ['S', 'RA', 'R', '6', '5', '4.5', '4', '3.5', '3', '2', '1', '0-', '***', '-'] as const;

export function sortAuctionRates(rates: string[]): string[] {
  return [...new Set(rates)].sort((a, b) => {
    const ia = AUCTION_RATE_ORDER.indexOf(a as (typeof AUCTION_RATE_ORDER)[number]);
    const ib = AUCTION_RATE_ORDER.indexOf(b as (typeof AUCTION_RATE_ORDER)[number]);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function equipmentLetters(equipmentEn?: string | null): string[] {
  if (!equipmentEn) return [];
  const known = ['AB', 'ABS', 'AC', 'PS', 'PW', 'SR', 'RW', 'PM', 'ST'];
  const upper = equipmentEn.toUpperCase();
  return known.filter(k => upper.includes(k)).slice(0, 4);
}

export function mockTimeLeft(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash + seed.charCodeAt(i)) % 100;
  const hrs = (hash % 8) + 1;
  const mins = hash % 59;
  return `Left: ${hrs} hr ${mins} min`;
}
