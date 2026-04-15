import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { PortfolioData } from '@/lib/api'

export default function AssetAllocationChart({ data }: { data: PortfolioData | null }) {
  const holdings = data?.summary?.holdings || {};
  const totalValue = data?.summary?.totalValue || 1; // Avoid divide by zero

  const chartData = Object.entries(holdings).map(([symbol, valueOrObj]) => {
    const val = typeof valueOrObj === 'number' ? valueOrObj : valueOrObj.value;
    return {
      name: symbol,
      value: parseFloat(((val / totalValue) * 100).toFixed(1)),
    };
  });

  // Add Cash if significant
  const cash = data?.summary?.cash || 0;
  if (cash > 1) {
    chartData.push({
      name: 'Cash',
      value: parseFloat(((cash / totalValue) * 100).toFixed(1))
    });
  }

  const colors = [
    'hsl(180 100% 50%)',
    'hsl(142 71% 45%)',
    'hsl(220 70% 50%)',
    'hsl(280 65% 60%)',
    'hsl(340 75% 55%)',
    'hsl(20 80% 60%)',
    'hsl(50 90% 50%)',
  ]

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-border/30 bg-card p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-1">Asset Allocation</h3>
        <div className="h-[300px] flex items-center justify-center text-foreground/50">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/30 bg-card p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Asset Allocation</h3>
          <p className="text-sm text-foreground/60">Current portfolio composition</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }: { name: string, value: number }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={true}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 20, 25, 0.95)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `${value}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
