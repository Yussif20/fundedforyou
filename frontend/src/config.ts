const isDev = process.env.NODE_ENV === "development";

export const AppConfig = {
  // For client-side API calls (RTK Query)
  // In production, use proxy route to avoid mixed content issues
  // In development, call backend directly
  backendUrl: isDev
    ? process.env.NEXT_PUBLIC_BASE_SERVER_URL_DEV
    : "/api/proxy",

  // Direct backend URL for server-side calls
  directBackendUrl:
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BASE_SERVER_URL ||
    "https://api.fundedforyou.com",
};
