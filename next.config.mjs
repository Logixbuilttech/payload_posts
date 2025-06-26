import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
    images: {
    remotePatterns: [
      {
        protocol: 'https', // Specify the protocol (e.g., 'https')
        hostname: 'payload-vercel-website-demo.vercel.app', // Replace with the actual hostname of your external image
        // Optional: Add a pathname if you want to restrict to specific paths
        // pathname: '/path/to/images/**', 
      },
      // Add more objects for other external domains if needed
    ],
  },
  experimental: {
    reactCompiler: false,
  },
}
  
export default withPayload(nextConfig, { devBundleServerPackages: false })
