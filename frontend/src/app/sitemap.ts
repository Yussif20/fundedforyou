import type { MetadataRoute } from "next";

const BASE_URL = "https://fundedforyou.com";
const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BASE_SERVER_URL ||
  "https://api.fundedforyou.com";

const locales = ["en", "ar"] as const;
const firmTypes = ["forex", "futures"] as const;

const staticPages = [
  "",
  "/about",
  "/challenges",
  "/offers",
  "/exclusive-offers",
  "/spreads",
  "/best-sellers",
  "/high-impact-news",
  "/how-it-works",
  "/faq",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale + firm type
  for (const locale of locales) {
    for (const type of firmTypes) {
      for (const page of staticPages) {
        entries.push({
          url: `${BASE_URL}/${locale}/${type}${page}`,
          lastModified: new Date(),
          changeFrequency: page === "" ? "daily" : "weekly",
          priority: page === "" ? 1.0 : 0.7,
        });
      }
    }
  }

  // Dynamic firm pages
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/firms?limit=1000`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const json = await res.json();
      const firms: { slug: string; firmType: string }[] = json?.data?.data || json?.data || [];

      for (const firm of firms) {
        for (const locale of locales) {
          const type = firm.firmType?.toLowerCase() === "futures" ? "futures" : "forex";
          entries.push({
            url: `${BASE_URL}/${locale}/${type}/firms/${firm.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      }
    }
  } catch {
    // If API is unavailable, continue with static pages only
  }

  return entries;
}
