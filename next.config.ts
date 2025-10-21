import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
