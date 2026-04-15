'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Brain, BarChart3, Settings, Menu, X } from 'lucide-react'

export default function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Decisions', href: '/explainability', icon: Brain },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Setup', href: '/setup', icon: Settings },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 md:hidden p-3 bg-primary text-primary-foreground rounded-full shadow-lg glow-cyan"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen border-r border-white/[0.06] bg-card/50 backdrop-blur-xl flex flex-col transition-all duration-300 z-40 ${
          isOpen ? 'left-0' : '-left-64 md:left-0'
        }`}
      >
        <div className="p-6 border-b border-white/[0.06]">
          <h3 className="font-semibold text-foreground/80 text-sm uppercase tracking-wider">Navigation</h3>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-foreground/50 hover:text-foreground hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-primary' : 'text-foreground/40 group-hover:text-foreground/70'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Powered by badge */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="glass-card rounded-xl p-4">
            <div className="text-xs text-foreground/40 mb-1">Powered by</div>
            <div className="text-sm font-semibold text-gradient-azure-emerald">PortfolioAI Engine</div>
            <div className="text-xs text-foreground/30 mt-1">v2.0 • Multi-Agent System</div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
