import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export const metadata: Metadata = {
  title: 'PortfolioAI — Autonomous AI Portfolio Management',
  description: 'AI-driven autonomous portfolio management system with explainable decisions, real-time optimization, and enterprise-grade risk analytics.',
  keywords: ['portfolio management', 'AI trading', 'autonomous investing', 'risk analytics', 'portfolio optimization'],
  authors: [{ name: 'PortfolioAI' }],
  openGraph: {
    title: 'PortfolioAI — Autonomous AI Portfolio Management',
    description: 'Let AI agents manage your portfolio with full transparency and explainable decisions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'PortfolioAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PortfolioAI — Autonomous AI Portfolio Management',
    description: 'Let AI agents manage your portfolio with full transparency.',
  },
}

import { Providers } from '@/components/providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
