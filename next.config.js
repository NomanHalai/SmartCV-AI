/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pdf-parse', 'mammoth'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('canvas')
    }
    return config
  },
}

module.exports = nextConfig
