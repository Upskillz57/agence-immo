/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-9eb8ef13a7e04341affa18b106c3d6cd.r2.dev",
      },
    ],
  },
};

module.exports = nextConfig;