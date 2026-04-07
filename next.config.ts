import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import {
  loadQueryShieldAliases,
  turbopackQueryShieldOptions,
} from "src/lib/shield/build/next-config-utils";

const nextConfig: NextConfig = {
  // Enable Turbopack file system caching for faster dev startup (beta)
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edge*.**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "xmc-*.**",
        port: "",
      },
    ],
  },
  // use this configuration to serve the sitemap.xml and robots.txt files from the API route handlers
  rewrites: async () => {
    return [
      {
        source: "/sitemap:id([\\w-]{0,}).xml",
        destination: "/api/sitemap",
        locale: false,
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
        locale: false,
      },
    ];
  },
  /* BEGIN QUERY SHIELD */
  turbopack: {
    // Primary implementation for shield import aliases
    ...turbopackQueryShieldOptions(),
  },
  webpack: (config, { isServer }) => {
    // Optional fallback for webpack aliases
    if (!isServer) {
      const shieldAliases = loadQueryShieldAliases();
      if (shieldAliases) {
        config.resolve.alias = { ...config.resolve.alias, ...shieldAliases };
      }
    }
    return config;
  },
  /* END QUERY SHIELD */
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
