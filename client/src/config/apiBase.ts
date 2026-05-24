export interface AppConfig {
  apiUrl?: string;
}

let runtimeConfig: AppConfig | null = null;

/** Strip trailing slashes and mistaken /api suffix (Spring serves routes at root). */
export function normalizeApiUrl(url: string): string {
  let normalized = url.trim().replace(/\/+$/, "");
  if (normalized.endsWith("/api")) {
    normalized = normalized.slice(0, -4);
  }
  return normalized;
}

export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  if (fromEnv) {
    return normalizeApiUrl(fromEnv);
  }
  if (runtimeConfig?.apiUrl) {
    return normalizeApiUrl(runtimeConfig.apiUrl);
  }
  if (import.meta.env.DEV) {
    return "/api";
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

export async function loadRuntimeConfig(): Promise<void> {
  if (import.meta.env.VITE_API_URL?.trim()) {
    return;
  }
  try {
    const res = await fetch("/config.json", { cache: "no-store" });
    if (res.ok) {
      runtimeConfig = (await res.json()) as AppConfig;
    }
  } catch {
    runtimeConfig = null;
  }
}
