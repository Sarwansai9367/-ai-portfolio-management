'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isLanding = pathname === '/'

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'border-b border-border/40 bg-background/90 backdrop-blur-xl shadow-lg shadow-black/10' 
        : 'border-b border-transparent bg-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer">
                PortfolioAI
              </h1>
            </Link>
            {isLanding && (
              <div className="hidden md:flex gap-8">
                <Link href="#features" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  How It Works
                </Link>
                <Link href="/dashboard" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground/70 hover:text-foreground"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-border/20 animate-slide-down space-y-3">
            {isLanding && (
              <>
                <Link href="#features" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="#how-it-works" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </>
            )}
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <div className="flex gap-3 px-4 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button size="sm" className="w-full bg-primary text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
