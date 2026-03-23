import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Funded For You",
    short_name: "FFY",
    description: "Compare prop trading firms, challenges & spreads",
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
