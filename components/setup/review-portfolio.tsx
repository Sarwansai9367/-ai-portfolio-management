'use client'

interface ReviewPortfolioProps {
  selectedAssets: string[]
  riskLevel: string
  constraints: {
    monthlyRebalance: boolean
    autoRebalance: boolean
    maxSinglePosition: number
    dividendReinvestment: boolean
  }
}

export default function ReviewPortfolio({ selectedAssets, riskLevel, constraints }: ReviewPortfolioProps) {
  const getRiskDescription = (level: string) => {
    const descriptions: Record<string, string> = {
      conservative: '70% Bonds, 30% Stocks • Expected Return: 4-6%',
      moderate: '50% Stocks, 50% Bonds • Expected Return: 6-8%',
      aggressive: '80% Stocks, 20% Bonds • Expected Return: 8-12%',
    }
    return descriptions[level] || ''
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review Your Setup</h3>
        <p className="text-foreground/60 text-sm">
          Verify all settings before activating your AI-optimized portfolio.
        </p>
      </div>

      {/* Selected Assets */}
      <div className="p-4 rounded-lg border border-border/30 bg-background/50 space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <span className="text-lg">📊</span> Selected Assets
        </h4>
        <div className="flex flex-wrap gap-2">
          {selectedAssets.map((asset) => (
            <span
              key={asset}
              className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
            >
              {asset}
            </span>
          ))}
        </div>
        <p className="text-xs text-foreground/60">
          Total: {selectedAssets.length} assets selected for diversification
        </p>
      </div>

      {/* Risk Profile */}
      <div className="p-4 rounded-lg border border-border/30 bg-background/50 space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <span className="text-lg">⚖️</span> Risk Profile
        </h4>
        <div>
          <p className="font-medium capitalize text-primary">{riskLevel}</p>
          <p className="text-sm text-foreground/60 mt-1">{getRiskDescription(riskLevel)}</p>
        </div>
      </div>

      {/* Constraints Summary */}
      <div className="p-4 rounded-lg border border-border/30 bg-background/50 space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <span className="text-lg">⚙️</span> Constraints & Rules
        </h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>
              {constraints.monthlyRebalance ? 'Monthly rebalancing' : 'No monthly rebalancing'} is{' '}
              <span className="font-semibold">enabled</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>
              Automatic threshold-based rebalancing is{' '}
              <span className="font-semibold">{constraints.autoRebalance ? 'enabled' : 'disabled'}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>
              Maximum single position size: <span className="font-semibold">{constraints.maxSinglePosition}%</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>
              Dividend reinvestment is <span className="font-semibold">{constraints.dividendReinvestment ? 'enabled' : 'disabled'}</span>
            </span>
          </li>
        </ul>
      </div>

      {/* Confirmation Box */}
      <div className="p-4 rounded-lg bg-success/5 border border-success/20 space-y-2">
        <p className="text-sm font-semibold text-success">Portfolio Configuration Ready</p>
        <p className="text-xs text-foreground/70 leading-relaxed">
          Your AI agents will begin analyzing market data and optimizing your portfolio immediately upon completion. You can adjust these settings anytime from the dashboard.
        </p>
      </div>
    </div>
  )
}
