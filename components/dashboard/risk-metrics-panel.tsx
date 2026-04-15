'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PortfolioData } from '@/lib/api'
import { ShieldCheck, AlertTriangle, TrendingDown } from 'lucide-react'

export default function RiskMetricsPanel({ data }: { data: PortfolioData | null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const volatility = (data?.risk?.volatility || 0) * 100;
  const sharpe = data?.risk?.sharpeRatio || 0;
  const maxDrawdown = (data?.risk?.maxDrawdown || 0) * 100;

  const getRiskColor = (v: number) => {
    if (v < 20) return 'text-emerald-400'
    if (v < 30) return 'text-primary'
    return 'text-destructive'
  }

  const getRiskBarColor = (v: number) => {
    if (v < 20) return 'bg-emerald-400'
    if (v < 30) return 'bg-primary'
    return 'bg-destructive'
  }

  const riskLevel = volatility > 30 ? 'High' : volatility > 20 ? 'Medium' : 'Low';
  const riskIcon = volatility > 30 ? AlertTriangle : ShieldCheck;
  const RiskIcon = riskIcon;

  // Skeleton
  if (!data) {
    return (
      <div className="rounded-2xl glass-card p-6">
        <div className="skeleton w-32 h-5 rounded mb-6" />
        <div className="space-y-6">
          <div className="skeleton h-12 rounded-lg" />
          <div className="skeleton h-12 rounded-lg" />
          <div className="skeleton h-12 rounded-lg" />
          <div className="skeleton h-12 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-card p-6 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-6">
        <h3 className="text-lg font-semibold">Risk Metrics</h3>

        {/* Volatility */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground/50">Volatility (Ann.)</span>
            <span className={`text-lg font-semibold ${getRiskColor(volatility)}`}>
              {volatility.toFixed(2)}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: mounted ? `${Math.min(volatility, 100)}%` : 0 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className={`h-full rounded-full ${getRiskBarColor(volatility)}`}
            />
          </div>
        </div>

        {/* Sharpe Ratio */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground/50">Sharpe Ratio</span>
            <span className="text-lg font-semibold text-primary">
              {sharpe.toFixed(2)}x
            </span>
          </div>
          <p className="text-xs text-foreground/40">
            Risk-adjusted return efficiency
          </p>
        </div>

        {/* Risk Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground/50">Risk Level</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(volatility)} bg-white/[0.04] border border-white/[0.08]`}>
              <RiskIcon className="h-3.5 w-3.5" />
              {riskLevel}
            </span>
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/50 flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5" />
              Max Drawdown
            </span>
            <span className="text-lg font-semibold text-destructive">{maxDrawdown.toFixed(2)}%</span>
          </div>
          <p className="text-xs text-foreground/40 mt-1">
            Worst decline from peak
          </p>
        </div>
      </div>
    </div>
  )
}
