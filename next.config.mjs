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
    ],
  },
  experimental: {
    reactCompiler: false,
  },
}
  
export default withPayload(nextConfig, { devBundleServerPackages: false })
