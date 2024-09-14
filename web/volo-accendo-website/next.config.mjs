/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: process.env.NEXT_ENV === 'prod' ? 'out/prod' : 'out/dev',
};

export default nextConfig;
