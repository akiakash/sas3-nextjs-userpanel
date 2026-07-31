import { apiClient, setStoredToken } from "./api-client";
import { clearCustomerSession } from "./auth-session";
import type {
  AuthResponse,
  Customer,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from "@/types/customer";

export async function register(
  payload: RegisterPayload,
): Promise<{ message: string; referenceCode: string }> {
  return apiClient<{ message: string; referenceCode: string }>(
    "/customer-auth/register",
    {
      method: "POST",
      body: payload,
      token: null,
    },
  );
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>("/customer-auth/login", {
    method: "POST",
    body: payload,
    token: null,
  });
  setStoredToken(response.accessToken);
  return response;
}

export async function getMe(token?: string): Promise<Customer> {
  return apiClient<Customer>("/customer-auth/me", {
    method: "GET",
    token,
    skipAuthRedirect: true,
  });
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<Customer> {
  return apiClient<Customer>("/customer-auth/me", {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteAccount(): Promise<{ message: string }> {
  return apiClient<{ message: string }>("/customer-auth/me", {
    method: "DELETE",
  });
}

export function logout(): void {
  clearCustomerSession();
}
