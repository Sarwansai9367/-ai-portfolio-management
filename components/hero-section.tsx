'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      
      {/* Gradient orbs */}
      <div className="absolute top-10 left-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px] animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 animate-shimmer opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                AI-Powered • Autonomous • Explainable
              </span>
            </motion.div>

            {/* Main headline */}
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Intelligent
                <span className="block text-gradient-azure-emerald">Portfolio</span>
                <span className="block">Management</span>
              </h2>
              <p className="text-lg sm:text-xl text-foreground/60 max-w-xl leading-relaxed">
                AI-driven autonomous optimization with explainable decisions. Let multi-agent algorithms handle the complexity while you focus on your goals.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] px-8 py-6 text-base font-semibold transition-all duration-300 group"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/30 text-primary hover:bg-primary/5 px-8 py-6 text-base bg-transparent backdrop-blur-sm"
                >
                  View Live Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats showcase */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-4"
            >
              {[
                { value: '18.5%', label: 'Avg YTD Returns' },
                { value: '1.45x', label: 'Sharpe Ratio' },
                { value: '24/7', label: 'Autonomous' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-primary">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/50">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Preview Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="hidden lg:block relative"
          >
            {/* Floating dashboard mockup */}
            <div className="relative animate-float-slow">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-transparent to-emerald-500/20 rounded-3xl blur-xl" />
              
              {/* Dashboard preview card */}
              <div className="relative rounded-2xl border border-white/10 bg-card/90 backdrop-blur-xl p-6 shadow-2xl">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="text-xs text-foreground/30 font-mono">portfolioai.app</div>
                </div>

                {/* Portfolio value */}
                <div className="space-y-1 mb-6">
                  <p className="text-xs text-foreground/40">Total Portfolio Value</p>
                  <div className="text-3xl font-bold font-mono text-gradient-azure-emerald">
                    $125,437
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                    +18.5% YTD
                  </span>
                </div>

                {/* Mini chart placeholder */}
                <div className="h-24 rounded-lg bg-gradient-to-b from-primary/10 to-transparent border border-white/5 mb-4 flex items-end px-2 pb-2 gap-1">
                  {[35, 42, 38, 55, 48, 60, 52, 65, 58, 72, 68, 78, 75, 82, 80, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 1 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                      className="flex-1 rounded-t bg-gradient-to-t from-blue-500/60 to-emerald-500/40"
                    />
                  ))}
                </div>

                {/* Holdings preview */}
                <div className="space-y-2">
                  {[
                    { name: 'AAPL', alloc: '28%', change: '+2.4%', positive: true },
                    { name: 'MSFT', alloc: '24%', change: '+1.8%', positive: true },
                    { name: 'BND', alloc: '18%', change: '-0.2%', positive: false },
                  ].map((stock, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/3 border border-white/5"
                    >
                      <span className="text-sm font-mono font-semibold text-primary/80">{stock.name}</span>
                      <span className="text-xs text-foreground/40">{stock.alloc}</span>
                      <span className={`text-xs font-mono font-semibold ${stock.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.change}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* AI status indicator */}
                <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">AI Agent Active — Portfolio Optimized</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
