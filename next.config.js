/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;