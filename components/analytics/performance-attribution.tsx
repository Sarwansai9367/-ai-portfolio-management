'use client'

import { mockPortfolio } from '@/lib/mock-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function PerformanceAttribution() {
  const data = mockPortfolio.assets.map((asset) => ({
    symbol: asset.symbol,
    contribution: asset.change24h * (asset.allocation / 100),
  }))

  const totalContribution = data.reduce((sum, item) => sum + item.contribution, 0)

  return (
    <div className="rounded-xl border border-border/30 bg-card p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Performance Attribution</h3>
          <p className="text-sm text-foreground/60">Which assets drove portfolio returns</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="symbol" stroke="rgba(255,255,255,0.3)" style={{ fontSize: '12px' }} />
            <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 20, 25, 0.95)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `${value.toFixed(3)}%`}
              cursor={{ fill: 'rgba(0, 217, 255, 0.1)' }}
            />
            <Bar
              dataKey="contribution"
              fill="hsl(180 100% 50%)"
              isAnimationActive={true}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Attribution breakdown */}
        <div className="pt-4 border-t border-border/30 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">Total Contribution</span>
            <span className={`font-semibold ${totalContribution > 0 ? 'text-success' : 'text-destructive'}`}>
              {totalContribution > 0 ? '+' : ''}{totalContribution.toFixed(3)}%
            </span>
          </div>

          {/* Top contributor */}
          {data.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/60">Top Contributor</span>
              <span className="text-primary font-semibold">
                {data.reduce((max, item) => (item.contribution > max.contribution ? item : max)).symbol}
              </span>
            </div>
          )}
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-foreground/70 leading-relaxed">
            Attribution shows how each asset's price change combined with its portfolio weight affected overall returns.
          </p>
        </div>
      </div>
    </div>
  )
}
