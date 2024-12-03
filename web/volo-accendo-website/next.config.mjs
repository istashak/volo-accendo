/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: process.env.NEXT_ENV === "prod" ? "out/prod" : "out/dev",
  images: {
    unoptimized: true,
  },
  webpack(config, { dev }) {
    if (dev) {
      // Enable source maps during development
      config.devtool = "source-map";
    } else {
      // Optionally enable source maps in production
      config.devtool = "hidden-source-map";
    }
    return config;
  },
};

export default nextConfig;
