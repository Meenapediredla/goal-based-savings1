/**
 * API base URL resolution:
 * - VITE_API_URL set at build time → use it (separate frontend + backend deploy)
 * - Dev → Vite proxy at /api
 * - Production, unset → same origin (frontend served from Spring Boot)
 */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  if (import.meta.env.DEV) {
    return "/api";
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}
