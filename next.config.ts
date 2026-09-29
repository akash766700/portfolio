import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  webpack: (config) => {
    config.module.rules.push({
      resourceQuery: /raw/,
      type: "asset/source",
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      "@designcodeio/threeui/style.css": path.resolve(__dirname, "src/shaders/threeui.css"),
      "@designcodeio/threeui": path.resolve(__dirname, "src/shaders/sylva-living-world/SylvaLivingWorldScene"),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@designcodeio/threeui/style.css": "./src/shaders/threeui.css",
      "@designcodeio/threeui": "./src/shaders/sylva-living-world/SylvaLivingWorldScene",
    },
    rules: {
      "*.html": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
      "*.min.js": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
