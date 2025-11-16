import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
