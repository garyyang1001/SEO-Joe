/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // 使用 pages router
  },
  webpack: (config) => {
    // 處理 node_modules 中的 ESM 模組
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig