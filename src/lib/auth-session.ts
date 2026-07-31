export const CUSTOMER_TOKEN_KEY = "sas3_customer_token";
/** Lightweight flag cookie for Next.js middleware (JWT stays in localStorage). */
export const CUSTOMER_SESSION_COOKIE = "sas3_customer_session";

const DEFAULT_MAX_AGE = 60 * 60 * 24; // 1 day — matches typical JWT_EXPIRES_IN

export function setSessionCookie(maxAgeSeconds = DEFAULT_MAX_AGE): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CUSTOMER_SESSION_COOKIE}=1; path=/; SameSite=Lax; max-age=${maxAgeSeconds}`;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CUSTOMER_SESSION_COOKIE}=; path=/; max-age=0`;
}

/** Restore session cookie when localStorage still has a token. */
export function ensureSessionCookie(): void {
  if (typeof localStorage === "undefined" || typeof document === "undefined") return;
  if (!localStorage.getItem(CUSTOMER_TOKEN_KEY)) return;
  setSessionCookie();
}

export function clearCustomerSession(): void {
  clearSessionCookie();
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  }
}

export function setCustomerSession(token: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  }
  setSessionCookie();
}
