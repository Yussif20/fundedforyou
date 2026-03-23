import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/overview/", "/onboarding/", "/auth/", "/api/"],
    },
    sitemap: "https://fundedforyou.com/sitemap.xml",
  };
}
