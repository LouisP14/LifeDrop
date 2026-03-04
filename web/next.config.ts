import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Allow imports from ../shared/ and resolve their dependencies
  outputFileTracingRoot: path.resolve(__dirname, ".."),

  webpack: (config) => {
    // Alias @shared to the shared directory
    config.resolve.alias = {
      ...config.resolve.alias,
      "@shared": path.resolve(__dirname, "../shared"),
    };

    // Ensure shared/ files can resolve node_modules from web/
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, "node_modules"),
    ];

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
