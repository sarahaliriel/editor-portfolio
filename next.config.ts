import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [560, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
