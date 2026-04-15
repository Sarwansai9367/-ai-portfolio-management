'use client'

import { mockPortfolio } from '@/lib/mock-data'

export default function CorrelationHeatmap() {
  const symbols = mockPortfolio.assets.map((a) => a.symbol)

  // Create correlation matrix
  const correlationData: Record<string, Record<string, number>> = {}
  symbols.forEach((symbol) => {
    correlationData[symbol] = {}
    symbols.forEach((otherSymbol) => {
      if (symbol === otherSymbol) {
        correlationData[symbol][otherSymbol] = 1.0
      } else {
        // Generate symmetric correlation values
        correlationData[symbol][otherSymbol] = Math.random() * 0.6 + 0.3
      }
    })
  })

  const getCorrelationColor = (value: number) => {
    if (value > 0.7) return 'bg-success/60'
    if (value > 0.5) return 'bg-success/40'
    if (value > 0.3) return 'bg-primary/40'
    return 'bg-foreground/10'
  }

  return (
    <div className="rounded-xl border border-border/30 bg-card p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Asset Correlation Matrix</h3>
          <p className="text-sm text-foreground/60">How assets move together</p>
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto">
          <div className="inline-block">
            {/* Column headers */}
            <div className="flex mb-2">
              <div className="w-16" />
              {symbols.map((symbol) => (
                <div key={`header-${symbol}`} className="w-12 text-center text-xs font-semibold text-foreground/70">
                  {symbol}
                </div>
              ))}
            </div>

            {/* Rows */}
            {symbols.map((rowSymbol) => (
              <div key={`row-${rowSymbol}`} className="flex mb-1">
                <div className="w-16 text-xs font-semibold text-foreground/70 flex items-center pr-2">
                  {rowSymbol}
                </div>
                {symbols.map((colSymbol) => (
                  <div
                    key={`cell-${rowSymbol}-${colSymbol}`}
                    className={`w-12 h-12 flex items-center justify-center text-xs font-bold rounded transition-all hover:ring-2 hover:ring-primary/50 cursor-pointer ${getCorrelationColor(correlationData[rowSymbol][colSymbol])}`}
                    title={`${rowSymbol}-${colSymbol}: ${correlationData[rowSymbol][colSymbol].toFixed(2)}`}
                  >
                    {correlationData[rowSymbol][colSymbol].toFixed(2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-foreground/60 mb-3 font-semibold">Correlation Strength</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/60" />
              <span className="text-xs">High (0.7+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/40" />
              <span className="text-xs">Moderate (0.5-0.7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/40" />
              <span className="text-xs">Weak (0.3-0.5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-foreground/10" />
              <span className="text-xs">Low (&lt;0.3)</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-foreground/70 leading-relaxed">
            Lower correlations between assets provide better diversification and portfolio stability.
          </p>
        </div>
      </div>
    </div>
  )
}
