import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any domain
      },
      {
        protocol: 'https',
        hostname: 'payload-posts.vercel.app', // or your blob storage domain
        pathname: '/api/media/file/**',
      },
    ],
  },
  experimental: {
    reactCompiler: false,
  },
  // For best performance, ensure your blob storage sets:
  // Cache-Control: public, max-age=31536000, immutable
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
