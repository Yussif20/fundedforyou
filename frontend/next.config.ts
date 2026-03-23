import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-popover",
      "@radix-ui/react-accordion",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-switch",
      "@radix-ui/react-slider",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nyc3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "sfo3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "www.worldometers.info",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "api.zenexcloud.com",
      },
      {
        protocol: "http",
        hostname: "api.zenexcloud.com",
      },
      {
        protocol: "http",
        hostname: "31.220.111.98",
      },
    ],
    minimumCacheTTL: 2592000,
    formats: ["image/avif", "image/webp"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
