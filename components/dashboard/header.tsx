'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function DashboardHeader({ userName }: { userName?: string }) {
  const [timeRange, setTimeRange] = useState('1Y')

  const timeRanges = ['1D', '1W', '1M', '3M', '1Y', '5Y', 'ALL']

  return (
    <div className="mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold mb-1">
            {userName ? `Welcome, ${userName}` : 'Portfolio Dashboard'}
          </h2>
          <p className="text-foreground/50">
            Real-time autonomous portfolio management and optimization
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-1 glass-card p-1 rounded-xl">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-foreground/50 hover:text-foreground hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Market Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 flex items-center gap-3 p-4 rounded-xl glass-card"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-glow" />
          <span className="text-sm font-medium">Market Status</span>
        </div>
        <span className="text-sm text-foreground/50">Live • Markets Open</span>
      </motion.div>
    </div>
  )
}
