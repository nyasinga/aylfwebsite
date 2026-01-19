import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { env } from '@/lib/env'
import { Layout } from '@/components/layout/Layout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: env.APP_NAME,
    template: `%s | ${env.APP_NAME}`,
  },
  description:
    'A movement of friends nurturing a new breed of leaders in Africa, based on the leadership qualities, values, and principles of Jesus of Nazareth.',
  keywords: [
    'AYLF',
    'Africa Youth Leadership Forum',
    'NGO',
    'non-profit',
    'charity',
    'leadership',
    'youth development',
    'Kenya',
    'Africa',
  ],
  authors: [{ name: 'Africa Youth Leadership Forum' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: env.APP_URL,
    siteName: env.APP_NAME,
    title: env.APP_NAME,
    description:
      'A movement of friends nurturing a new breed of leaders in Africa, based on the leadership qualities, values, and principles of Jesus of Nazareth.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
