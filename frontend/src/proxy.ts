import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/* -------------------- Rate Limit Config -------------------- */
const rateLimitStore = new Map<
  string,
  { lastRequestTime: number; requestCount: number }
>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 1000;

/* -------------------- next-intl middleware -------------------- */
const intlMiddleware = createMiddleware(routing);

/* -------------------- Main Middleware -------------------- */
export function proxy(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  const currentTime = Date.now();
  const record = rateLimitStore.get(clientIp);

  if (record) {
    const elapsedTime = currentTime - record.lastRequestTime;

    if (elapsedTime < RATE_LIMIT_WINDOW_MS) {
      record.requestCount += 1;

      if (record.requestCount > RATE_LIMIT_MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({
            error: "Too many requests. Please try again later.",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } else {
      record.lastRequestTime = currentTime;
      record.requestCount = 1;
    }
  } else {
    rateLimitStore.set(clientIp, {
      lastRequestTime: currentTime,
      requestCount: 1,
    });
  }

  // 👉 Pass request to next-intl middleware
  return intlMiddleware(req);
}

/* -------------------- Matcher -------------------- */
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
