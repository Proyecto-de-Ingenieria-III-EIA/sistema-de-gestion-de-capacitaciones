import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['1000marcas.net', 'sweezy-cursors.com', 'via.placeholder.com', 'cdn.shopify.com', 'images.fineartamerica.com']
  }
};

export default nextConfig;
