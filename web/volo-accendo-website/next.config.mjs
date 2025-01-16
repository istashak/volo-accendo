/** @type {import('next').NextConfig} */
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: "export",
  output: "standalone",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/some-old-route",
  //       destination: "/new-route",
  //       permanent: true,
  //     },
  //   ];
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/about/",
  //       destination: "/about.html",
  //     },
  //   ];
  // },

  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value:
  //             "public, max-age=3600, s-maxage=86400, stale-while-revalidate",
  //         },
  //       ],
  //     },
  //   ];
  // },

  webpack(config, { dev, isServer }) {
    // Development: Enable detailed source maps for debugging
    if (dev) {
      config.devtool = "source-map";
    } else {
      // Production: Use hidden source maps for security
      config.devtool = "hidden-source-map";
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };

    if (!isServer) {
      // Ensure client-side compatibility by excluding unnecessary Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        stream: false,
        crypto: false,
      };
    }

    return config;
  },

  experimental: {
    outputFileTracing: true, // For including dependencies in the Lambda package
  },
};

export default nextConfig;
