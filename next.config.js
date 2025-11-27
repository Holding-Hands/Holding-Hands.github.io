/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/GuideWords.github.io',
  assetPrefix: '/GuideWords.github.io/',
  trailingSlash: true,
}

module.exports = nextConfig
