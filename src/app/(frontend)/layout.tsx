import React from 'react'
import './styles.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={inter.className}>
        <SpeedInsights />
        <main>{children}</main>
      </body>
    </html>
  )
}
