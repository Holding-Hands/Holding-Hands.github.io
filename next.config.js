/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/GuideWords' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/GuideWords/' : '',
}

module.exports = nextConfig
