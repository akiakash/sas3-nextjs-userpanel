import { apiClient } from "./api-client";

export type CustomerWishlistItem = {
  id: string;
  lotId: string;
  bid: string | null;
  auctRef: string | null;
  lotDate: string | null;
  auctionName: string | null;
  company: string | null;
  modelNameEn: string | null;
  modelTypeEn: string | null;
  gradeEn: string | null;
  colorEn: string | null;
  scoresEn: string | null;
  modelYearEn: string | null;
  mileage: string | null;
  displacement: string | null;
  transmissionEn: string | null;
  equipmentEn: string | null;
  startPrice: string | null;
  endPrice: string | null;
  resultEn: string | null;
  imageUrls: string[];
  vehicleTitle: string;
  createdAt: string;
  updatedAt: string;
};

export async function listCustomerWishlist(): Promise<CustomerWishlistItem[]> {
  return apiClient<CustomerWishlistItem[]>("/customer-wishlist", {
    method: "GET",
  });
}

export async function getWishlistLotIds(): Promise<string[]> {
  const res = await apiClient<{ lotIds: string[] }>(
    "/customer-wishlist/lot-ids",
    { method: "GET" },
  );
  return res.lotIds ?? [];
}

export async function addToWishlist(
  lotId: string,
): Promise<CustomerWishlistItem> {
  return apiClient<CustomerWishlistItem>("/customer-wishlist", {
    method: "POST",
    body: { lotId },
  });
}

export async function removeWishlistItem(
  id: string,
): Promise<{ message: string; lotId: string }> {
  return apiClient<{ message: string; lotId: string }>(
    `/customer-wishlist/${id}`,
    { method: "DELETE" },
  );
}

export async function removeWishlistByLotId(
  lotId: string,
): Promise<{ message: string; lotId: string }> {
  return apiClient<{ message: string; lotId: string }>(
    `/customer-wishlist/by-lot/${encodeURIComponent(lotId)}`,
    { method: "DELETE" },
  );
}
