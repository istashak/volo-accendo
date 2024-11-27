/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  distDir: process.env.NEXT_ENV === "prod" ? "out/prod" : "out/dev",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
