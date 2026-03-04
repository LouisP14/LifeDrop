import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Allow imports from ../shared/
  transpilePackages: [],

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@shared": path.resolve(__dirname, "../shared"),
    };
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Language", value: "fr" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
