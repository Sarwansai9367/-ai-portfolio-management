'use client'

import { mockChartData } from '@/lib/mock-data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function PerformanceChart() {
  return (
    <div className="rounded-xl border border-border/30 bg-card p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Performance vs Benchmark</h3>
          <p className="text-sm text-foreground/60">Portfolio growth compared to market index</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={mockChartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.3)"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 20, 25, 0.95)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '8px',
              }}
              cursor={{ stroke: 'rgba(0, 217, 255, 0.3)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(180 100% 50%)"
              name="Portfolio"
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="rgba(255,255,255,0.3)"
              name="Benchmark"
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
