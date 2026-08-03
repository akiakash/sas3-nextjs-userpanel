import {
  clearCustomerSession,
  CUSTOMER_TOKEN_KEY,
  ensureSessionCookie,
  setCustomerSession,
} from "./auth-session";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "https://sas3.xorcodes.com";
const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    setCustomerSession(token);
  } else {
    clearCustomerSession();
  }
}

function redirectToLoginOnUnauthorized(): void {
  if (typeof window === "undefined") return;
  clearCustomerSession();
  const path = `${window.location.pathname}${window.location.search}`;
  const from =
    path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard";
  const loginUrl = `/login?from=${encodeURIComponent(from)}`;
  if (!window.location.pathname.startsWith("/login")) {
    window.location.assign(loginUrl);
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
  /** Skip global 401 redirect (e.g. bootstrap /me). */
  skipAuthRedirect?: boolean;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, headers, skipAuthRedirect, ...rest } = options;

  const authToken = token !== undefined ? token : getStoredToken();
  if (authToken) {
    ensureSessionCookie();
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && !skipAuthRedirect) {
      redirectToLoginOnUnauthorized();
    }

    const message =
      (data && typeof data.message === "string" && data.message) ||
      (Array.isArray(data?.message) && data.message.join(", ")) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}
