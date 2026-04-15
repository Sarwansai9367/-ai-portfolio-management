'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AnimatedCounter from '@/components/ui/animated-counter'
import { PortfolioData } from '@/lib/api'

interface PortfolioHealthCardProps {
  data: PortfolioData | null
}

export default function PortfolioHealthCard({ data }: PortfolioHealthCardProps) {
  const totalValue = data?.summary?.totalValue || 0
  const cash = data?.summary?.cash || 0
  const returns = 12450.42 // Mocked for visual impact in demo
  const isPositive = returns >= 0

  return (
    <Card className="relative overflow-hidden border-border/30 bg-card/50 backdrop-blur-xl group h-full">
      {/* Dynamic background effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-colors duration-500 group-hover:bg-primary/10" />
      
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-foreground/50 uppercase tracking-widest flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Total Portfolio Value
          </CardTitle>
          <div className="text-4xl font-bold tracking-tight">
            <AnimatedCounter end={totalValue} prefix="$" decimals={2} />
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border border-current/20 shadow-lg glow-cyan`}>
          {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
        </div>
      </CardHeader>
      
      <CardContent className="relative pt-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-foreground/40 font-medium uppercase tracking-wider">Trading Cash</p>
            <div className="text-xl font-bold font-mono">
              <AnimatedCounter end={cash} prefix="$" decimals={2} />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-foreground/30">
              <Activity className="h-3 w-3" />
              Available to deploy
            </div>
          </div>
          
          <div className="space-y-1 text-right">
            <p className="text-xs text-foreground/40 font-medium uppercase tracking-wider">Estimated P&L</p>
            <div className={`text-xl font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? '+' : '-'}$<AnimatedCounter end={Math.abs(returns)} decimals={2} />
            </div>
            <div className={`flex items-center justify-end gap-1 text-[10px] ${isPositive ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {isPositive ? '+8.4%' : '-2.1%'} total return
            </div>
          </div>
        </div>

        {/* Progress bar visual for allocation */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between text-[10px] font-medium text-foreground/40 uppercase tracking-widest">
            <span>Asset Allocation</span>
            <span>{totalValue > 0 ? '94%' : '0%'} Invested</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: totalValue > 0 ? '94%' : '0%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
