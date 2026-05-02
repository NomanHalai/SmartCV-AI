/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for pdf-parse to work in Next.js API routes
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // pdf-parse requires canvas which may not be available
      config.externals = config.externals || []
      config.externals.push('canvas')
    }
    return config
  },
}

module.exports = nextConfig
