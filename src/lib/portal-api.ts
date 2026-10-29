import { apiClient } from "./api-client";

export type PortalOrder = {
  id: string;
  stockNumber: string;
  make: string | null;
  modelName: string | null;
  modelCode: string | null;
  chassisNumber: string | null;
  manufactureYear: number | null;
  manufactureMonth: number | null;
  color: string | null;
  mileageKm: number | null;
  logisticsStatus: string | null;
  sold: boolean;
  salePrice: number | null;
  invoiceAmount: number | null;
  invoiceDate: string | null;
  payTerms: string | null;
  currency: string;
  photos: string[];
  makeModel: string;
  createdAt: string | null;
};

export type PortalPaymentRow = {
  id: string;
  method: "TT" | "LC";
  refNo: string;
  date: string | null;
  currency: string;
  amount: number;
  allocated: number;
  available: number;
};

export type PortalPaymentSummary = {
  ttAvailable: number;
  lcAvailable: number;
  spent: number;
  ttTotal: number;
  lcTotal: number;
};

export type PortalStock = {
  id: string;
  stockNumber: string;
  make: string | null;
  modelName: string | null;
  modelCode: string | null;
  chassisNumber: string | null;
  manufactureYear: number | null;
  manufactureMonth: number | null;
  color: string | null;
  mileageKm: number | null;
  fuelType: string | null;
  transmission: string | null;
  salePrice: number | null;
  photos: string[];
  makeModel: string;
  vehicleTitle: string;
  favouriteId?: string;
  createdAt?: string;
};

export type PortalSummary = {
  orders: number;
  bids: number;
  negotiations: number;
  wishlist: number;
  favourites?: number;
};

export async function getMyOrders(q?: string) {
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());
  const qs = params.toString();
  return apiClient<{ data: PortalOrder[]; total: number }>(
    `/customer-portal/my-orders${qs ? `?${qs}` : ""}`,
  );
}

export async function getMyPayments() {
  return apiClient<{
    summary: PortalPaymentSummary;
    data: PortalPaymentRow[];
    total: number;
  }>("/customer-portal/my-payments");
}

export async function getPortalSummary() {
  return apiClient<PortalSummary>("/customer-portal/summary");
}

export async function listPortalStock(args?: {
  q?: string;
  make?: string;
  year?: string;
}) {
  const params = new URLSearchParams();
  if (args?.q?.trim()) params.set("q", args.q.trim());
  if (args?.make?.trim()) params.set("make", args.make.trim());
  if (args?.year?.trim()) params.set("year", args.year.trim());
  const qs = params.toString();
  return apiClient<{ data: PortalStock[]; total: number }>(
    `/customer-portal/stock${qs ? `?${qs}` : ""}`,
  );
}

export async function getPortalStock(id: string) {
  return apiClient<PortalStock>(
    `/customer-portal/stock/${encodeURIComponent(id)}`,
  );
}
