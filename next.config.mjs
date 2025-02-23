/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/mGames',
  assetPrefix: '/mGames/',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig; 