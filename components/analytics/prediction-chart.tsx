'use client'

import { mockPredictions } from '@/lib/mock-data'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function PredictionChart() {
  return (
    <div className="rounded-xl border border-border/30 bg-card p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Portfolio Predictions</h3>
          <p className="text-sm text-foreground/60">AI-predicted vs actual portfolio value with confidence intervals</p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={mockPredictions} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(180 100% 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(180 100% 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(180 100% 50%)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="hsl(180 100% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" style={{ fontSize: '12px' }} />
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
            
            {/* Confidence interval as area */}
            <Area
              type="monotone"
              dataKey="high"
              name="Confidence Interval"
              fill="url(#colorConfidence)"
              stroke="none"
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="low"
              name=""
              fill="none"
              stroke="none"
              isAnimationActive={true}
              animationDuration={1500}
            />
            
            {/* Predicted line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="hsl(180 100% 50%)"
              name="Predicted"
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1500}
            />
            
            {/* Actual values */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(142 71% 45%)"
              name="Actual"
              dot={{ fill: 'hsl(142 71% 45%)', r: 4 }}
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
          <div>
            <p className="text-xs text-foreground/60 mb-1">Model Accuracy</p>
            <p className="text-lg font-semibold text-primary">92.3%</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Predictions Made</p>
            <p className="text-lg font-semibold text-primary">45</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Avg Confidence</p>
            <p className="text-lg font-semibold text-primary">87.6%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
