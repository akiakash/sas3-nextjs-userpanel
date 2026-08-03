import { ApiError, getApiBaseUrl } from "./api-client";

export interface AuctionFilters {
  makes: string[];
  models: string[];
  auctions: string[];
  dates: string[];
  rates: string[];
  colors: string[];
  grades: string[];
  results: string[];
  years: string[];
  transmissions: string[];
  displacements: number[];
  modelTypes: string[];
}

export interface AuctionLot {
  lotId: string;
  bid: string;
  auctRef: string;
  lotDate: string;
  auctionName: string;
  company: string;
  modelNameEn: string;
  modelTypeEn: string;
  gradeEn: string;
  colorEn: string;
  scoresEn: string;
  modelYearEn: string;
  mileage: string;
  displacement: string;
  transmissionEn: string;
  equipmentEn?: string;
  startPrice: string;
  endPrice: string;
  resultEn?: string;
  imageUrls: string[];
}

export interface AuctionSyncStatus {
  configured: boolean;
  syncInProgress: boolean;
  lotCount: number;
  lastSyncAt: string | null;
  lastImported: number | null;
  lastError: string | null;
}

type AuctionLotRaw = Record<string, unknown>;

function pickString(raw: AuctionLotRaw, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = raw[key];
    if (value != null && value !== "") return String(value);
  }
  return fallback;
}

function pickNumberString(raw: AuctionLotRaw, keys: string[]): string {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    if (typeof value === "string" && value !== "") return value;
  }
  return "";
}

function pickImageUrls(raw: AuctionLotRaw): string[] {
  if (Array.isArray(raw.imageUrls)) {
    return raw.imageUrls.filter(
      (url): url is string => typeof url === "string" && url.length > 0,
    );
  }

  const picsUrls = raw.picsUrls;
  if (typeof picsUrls === "string" && picsUrls.length > 0) {
    return picsUrls.split("#").filter((url) => url.length > 0);
  }

  return [];
}

export function normalizeAuctionLot(raw: AuctionLotRaw): AuctionLot {
  const equipment = pickString(raw, ["equipmentEn", "modelDetail"]);
  return {
    lotId: pickString(raw, ["lotId"]),
    bid: pickString(raw, ["bid"]),
    auctRef: pickString(raw, ["auctRef"]),
    lotDate: pickString(raw, ["lotDate"]),
    auctionName: pickString(raw, ["auctionName"]),
    company: pickString(raw, ["company"]),
    modelNameEn: pickString(raw, ["modelNameEn"]),
    modelTypeEn: pickString(raw, ["modelTypeEn"]),
    gradeEn: pickString(raw, ["gradeEn"]),
    colorEn: pickString(raw, ["colorEn"]),
    scoresEn: pickString(raw, ["scoresEn"]),
    modelYearEn: pickString(raw, ["modelYearEn"]),
    mileage: pickNumberString(raw, ["mileageNum", "mileage", "mileageEn"]),
    displacement: pickNumberString(raw, [
      "displacementNum",
      "displacement",
      "displacementEn",
    ]),
    transmissionEn: pickString(raw, ["transmissionEn"]),
    equipmentEn: equipment || undefined,
    startPrice: pickNumberString(raw, [
      "startPriceEn",
      "startPrice",
      "startPriceNum",
    ]),
    endPrice: pickNumberString(raw, ["endPriceEn", "endPrice", "endPriceNum"]),
    resultEn: pickString(raw, ["resultEn"]) || undefined,
    imageUrls: pickImageUrls(raw),
  };
}

export interface SearchParams {
  marka_name?: string[];
  model_name?: string[];
  auction?: string[];
  auction_date?: string[];
  date_from?: string;
  date_to?: string;
  lot_no?: string;
  lot_nos?: string[];
  chassis?: string;
  model_type?: string[];
  rate?: string[];
  color?: string[];
  grade?: string[];
  result?: string[];
  year_from?: number;
  year_to?: number;
  mileage_from?: number;
  mileage_to?: number;
  transmission?: string[];
  displacement_from?: number;
  displacement_to?: number;
  sort?: string;
  seq?: "ASC" | "DESC";
  page?: number;
  per_page?: number;
}

export interface SearchResult {
  data: AuctionLot[];
  meta: { page: number; perPage: number; total: number };
}

function normalizeSearchMeta(
  raw: unknown,
  params: SearchParams,
): SearchResult["meta"] {
  const meta = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const page = typeof meta.page === "number" ? meta.page : (params.page ?? 0);
  const perPage =
    typeof meta.perPage === "number"
      ? meta.perPage
      : typeof meta.per_page === "number"
        ? meta.per_page
        : (params.per_page ?? 20);
  const total = typeof meta.total === "number" ? meta.total : 0;
  return { page, perPage, total };
}

export const EMPTY_AUCTION_FILTERS: AuctionFilters = {
  makes: [],
  models: [],
  auctions: [],
  dates: [],
  rates: [],
  colors: [],
  grades: [],
  results: [],
  years: [],
  transmissions: [],
  displacements: [],
  modelTypes: [],
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const items = value
    .map((item) => (item == null ? "" : String(item).trim()))
    .filter((item) => item.length > 0);
  return [...new Set(items)];
}

function unwrapFilterBody(raw: unknown): Partial<AuctionFilters> {
  if (!raw || typeof raw !== "object") return {};

  const record = raw as Record<string, unknown>;
  for (const key of ["data", "filters", "result"] as const) {
    const candidate = record[key];
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate as Partial<AuctionFilters>;
    }
  }

  if ("makes" in record || "dates" in record || "auctions" in record) {
    return record as Partial<AuctionFilters>;
  }

  return {};
}

function hasFilterData(filters: AuctionFilters): boolean {
  return (
    filters.makes.length > 0 ||
    filters.dates.length > 0 ||
    filters.auctions.length > 0
  );
}

const FILTER_RETRY_ATTEMPTS = 4;
const FILTER_RETRY_DELAY_MS = 1500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function auctionFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

async function parseError(res: Response, fallback: string): Promise<never> {
  const data = await res.json().catch(() => null);
  const message =
    (data && typeof data.message === "string" && data.message) ||
    (Array.isArray(data?.message) && data.message.join(", ")) ||
    fallback;
  throw new ApiError(message, res.status);
}

async function readJsonResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  const text = await res.text();

  if (!text.trim()) {
    throw new Error("Empty response from auction API");
  }

  if (contentType.includes("text/html") || text.trimStart().startsWith("<!")) {
    throw new Error(
      "Received HTML instead of JSON. Confirm NEXT_PUBLIC_API_URL points to the NestJS backend.",
    );
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("Invalid JSON from auction API");
  }
}

function normalizeFilters(raw: unknown): AuctionFilters {
  const body = unwrapFilterBody(raw);
  const displacements = Array.isArray(body.displacements)
    ? [
        ...new Set(
          body.displacements.filter(
            (d): d is number => typeof d === "number" && d > 0,
          ),
        ),
      ]
    : [];
  return {
    makes: asStringArray(body.makes),
    models: asStringArray(body.models),
    auctions: asStringArray(body.auctions),
    dates: asStringArray(body.dates),
    rates: asStringArray(body.rates),
    colors: asStringArray(body.colors),
    grades: asStringArray(body.grades),
    results: asStringArray(body.results),
    years: asStringArray(body.years),
    transmissions: asStringArray(body.transmissions),
    displacements,
    modelTypes: asStringArray(body.modelTypes),
  };
}

/** Keep global driver lists when merging a cascaded filter response. */
export function mergeCascadeFilters(
  global: AuctionFilters,
  narrowed: AuctionFilters,
): AuctionFilters {
  return {
    ...narrowed,
    makes: global.makes,
    auctions: global.auctions,
    dates: global.dates,
  };
}

const MODEL_COUNT_CHUNK = 15;

/** Lot counts per model for the current make (uses search meta.total). */
export async function getModelCounts(
  makes: string[],
  models: string[],
  options?: { dates?: string[]; auctions?: string[] },
): Promise<Record<string, number>> {
  if (!makes.length || !models.length) return {};

  const counts: Record<string, number> = {};

  for (let i = 0; i < models.length; i += MODEL_COUNT_CHUNK) {
    const chunk = models.slice(i, i + MODEL_COUNT_CHUNK);
    const rows = await Promise.all(
      chunk.map(async (model) => {
        try {
          const res = await searchLots({
            marka_name: makes,
            model_name: [model],
            auction_date: options?.dates?.length ? options.dates : undefined,
            auction: options?.auctions?.length ? options.auctions : undefined,
            per_page: 1,
            page: 0,
          });
          return { model, total: res.meta.total };
        } catch {
          return { model, total: 0 };
        }
      }),
    );
    for (const { model, total } of rows) {
      counts[model] = total;
    }
  }

  return counts;
}

export async function getSyncStatus(): Promise<AuctionSyncStatus> {
  const res = await auctionFetch("/auction/sync-status");
  if (!res.ok) await parseError(res, "Failed to load auction sync status");
  return (await res.json()) as AuctionSyncStatus;
}

export async function getFilters(
  makes: string[] = [],
  models: string[] = [],
): Promise<AuctionFilters> {
  const params = new URLSearchParams();
  makes.forEach((m) => params.append("make", m));
  models.forEach((m) => params.append("model", m));
  const qs = params.toString();
  const path = `/auction/filters${qs ? `?${qs}` : ""}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < FILTER_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const res = await auctionFetch(path);
      if (!res.ok) await parseError(res, "Failed to load auction filters");

      const body = await readJsonResponse(res);
      const normalized = normalizeFilters(body);

      if (hasFilterData(normalized)) {
        return normalized;
      }

      lastError = new Error(
        "No auction filter data returned. The backend may still be syncing — retrying…",
      );
    } catch (err) {
      lastError =
        err instanceof Error ? err : new Error("Failed to load auction filters");
    }

    if (attempt < FILTER_RETRY_ATTEMPTS - 1) {
      await delay(FILTER_RETRY_DELAY_MS);
    }
  }

  throw new Error(
    lastError?.message === "Failed to fetch"
      ? "Could not reach the API. Ensure the NestJS backend is running and accessible."
      : (lastError?.message ??
          "No auction filter data returned. Check that the NestJS backend is running and has completed its Aleado sync."),
  );
}

export async function searchLots(params: SearchParams): Promise<SearchResult> {
  const res = await auctionFetch("/auction/search", {
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!res.ok) await parseError(res, "Search failed");
  const body = await res.json();
  return {
    data: Array.isArray(body.data) ? body.data.map(normalizeAuctionLot) : [],
    meta: normalizeSearchMeta(body.meta, params),
  };
}

export async function getLot(lotId: string): Promise<AuctionLot> {
  const res = await auctionFetch(`/auction/lots/${encodeURIComponent(lotId)}`);
  if (!res.ok) await parseError(res, "Lot not found");
  const body = await res.json();
  return normalizeAuctionLot(body);
}

export async function getUssImages(params: {
  date: string;
  auctionId: string;
  lotNumber: string;
}): Promise<{ imagesUrls: string[] }> {
  const res = await auctionFetch("/aleado/uss-images", {
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!res.ok) await parseError(res, "USS images unavailable");
  return res.json();
}
