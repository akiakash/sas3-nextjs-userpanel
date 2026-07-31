import { apiClient } from "./api-client";

export type NegotiationSenderType = "customer" | "agent";
export type NegotiationStatus = "active" | "closed" | "won" | "lost";

export type NegotiationMessage = {
  id: string;
  senderType: NegotiationSenderType;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
};

export type NegotiationThreadSummary = {
  id: string;
  referenceCode: string;
  customerId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerReference: string | null;
  lotId: string;
  lotNo: string | null;
  auctRef: string | null;
  lotDate: string | null;
  auctionName: string | null;
  company: string | null;
  modelNameEn: string | null;
  modelTypeEn: string | null;
  modelYearEn: string | null;
  gradeEn: string | null;
  scoresEn: string | null;
  mileage: string | null;
  startPrice: string | null;
  imageUrl: string | null;
  vehicleTitle: string;
  offerAmount: number;
  currency: string;
  listPriceYen: number | null;
  status: NegotiationStatus;
  replyNeeded: boolean;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
};

export type NegotiationThreadDetail = NegotiationThreadSummary & {
  messages: NegotiationMessage[];
  reused?: boolean;
};

export type CreateNegotiationPayload = {
  lotId: string;
  offerAmount: number;
  note?: string;
};

export async function createNegotiation(
  payload: CreateNegotiationPayload,
): Promise<NegotiationThreadDetail> {
  return apiClient<NegotiationThreadDetail>("/negotiations", {
    method: "POST",
    body: payload,
  });
}

export async function listNegotiations(): Promise<NegotiationThreadSummary[]> {
  return apiClient<NegotiationThreadSummary[]>("/negotiations", {
    method: "GET",
  });
}

export async function getNegotiation(
  id: string,
): Promise<NegotiationThreadDetail> {
  return apiClient<NegotiationThreadDetail>(`/negotiations/${id}`, {
    method: "GET",
  });
}

export async function sendNegotiationMessage(
  id: string,
  body: string,
): Promise<NegotiationThreadDetail> {
  return apiClient<NegotiationThreadDetail>(`/negotiations/${id}/messages`, {
    method: "POST",
    body: { body },
  });
}
