import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { mockPortfolio, mockChartData } from '@/lib/mock-data'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PortfolioData } from '@/lib/api'
import { TrendingUp, TrendingDown } from 'lucide-react'

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);
  
  useEffect(() => {
    if (target === 0) return;
    const start = prevTarget.current;
    const diff = target - start;
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(start + diff * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    prevTarget.current = target;
  }, [target, duration]);
  
  return count;
}

export default function PortfolioHealthCard({ data }: { data: PortfolioData | null }) {
  const totalValue = data?.summary?.totalValue || 0;
  const animatedValue = useAnimatedCounter(totalValue);
  const isPositive = true;

  // Skeleton state
  if (!data) {
    return (
      <div className="glass-card rounded-2xl p-8 overflow-hidden">
        <div className="space-y-6">
          <div>
            <div className="skeleton w-40 h-4 rounded mb-3" />
            <div className="skeleton w-64 h-12 rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="skeleton h-16 rounded-lg" />
            <div className="skeleton h-16 rounded-lg" />
            <div className="skeleton h-16 rounded-lg" />
          </div>
          <div className="skeleton h-24 rounded-lg -mx-8 -mb-8" />
        </div>
      </div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.005 }} className="glass-card rounded-2xl p-8 transition-all duration-300 overflow-hidden group relative">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-foreground/50 text-sm mb-2">Total Portfolio Value</p>
            <h3 className="text-4xl sm:text-5xl font-bold text-gradient-azure-emerald">
              ${animatedValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </h3>
          </div>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
          >
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {isPositive ? '+' : '-'}{Math.abs(mockPortfolio.dailyChangePercent)}%
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/[0.03] rounded-xl p-3">
            <p className="text-foreground/40 text-xs mb-1">Cash Balance</p>
            <p className="text-lg font-semibold text-foreground">
              ${(data?.summary?.cash || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3">
            <p className="text-foreground/40 text-xs mb-1">Positions</p>
            <p className="text-lg font-semibold text-emerald-400">{Object.keys(data?.summary?.holdings || {}).length}</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3">
            <p className="text-foreground/40 text-xs mb-1">Sharpe Ratio</p>
            <p className="text-lg font-semibold text-primary">{data?.risk?.sharpeRatio?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="pt-4 -mx-8 -mb-8">
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['dataMin - 5000', 'dataMax + 5000']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(3, 7, 18, 0.95)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)'
                }}
                cursor={{ stroke: 'rgba(59, 130, 246, 0.2)' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorValue)"
                isAnimationActive={true}
                animationDuration={1500}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
