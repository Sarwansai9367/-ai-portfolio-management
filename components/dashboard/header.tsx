'use client'

import { motion } from 'framer-motion'
import { Bell, Search, Sparkles } from 'lucide-react'

interface DashboardHeaderProps {
  userName: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          {greeting}, {userName}
          <motion.span
            animate={{ rotate: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            👋
          </motion.span>
        </h2>
        <p className="text-foreground/50 font-medium">
          Here is what is happening with your portfolio today.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search bar mockup */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
          <input
            type="text"
            placeholder="Search assets..."
            className="bg-card/50 border border-border/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 w-64 transition-all"
          />
        </div>

        {/* AI Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="h-3 w-3" />
          AI Optimizer Active
        </div>

        {/* Notifications button */}
        <button className="relative p-2.5 rounded-xl border border-border/50 bg-card/50 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>
      </div>
    </div>
  )
}
