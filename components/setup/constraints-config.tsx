'use client'

interface ConstraintsConfigProps {
  constraints: {
    monthlyRebalance: boolean
    autoRebalance: boolean
    maxSinglePosition: number
    dividendReinvestment: boolean
  }
  onUpdate: (constraints: any) => void
}

export default function ConstraintsConfig({ constraints, onUpdate }: ConstraintsConfigProps) {
  const handleToggle = (key: string) => {
    onUpdate({ ...constraints, [key]: !constraints[key as keyof typeof constraints] })
  }

  const handleSliderChange = (value: number) => {
    onUpdate({ ...constraints, maxSinglePosition: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Configure Constraints</h3>
        <p className="text-foreground/60 text-sm">
          Set rules for how your AI agents manage your portfolio.
        </p>
      </div>

      {/* Rebalancing Options */}
      <div className="space-y-4 p-4 rounded-lg border border-border/30 bg-background/50">
        <h4 className="font-semibold">Rebalancing Strategy</h4>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-background/50 p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={constraints.monthlyRebalance}
            onChange={() => handleToggle('monthlyRebalance')}
            className="w-4 h-4 rounded border-border/30 accent-primary"
          />
          <div>
            <div className="font-medium text-sm">Monthly Rebalancing</div>
            <div className="text-xs text-foreground/60">Auto-rebalance portfolio every month</div>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-background/50 p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={constraints.autoRebalance}
            onChange={() => handleToggle('autoRebalance')}
            className="w-4 h-4 rounded border-border/30 accent-primary"
          />
          <div>
            <div className="font-medium text-sm">Auto Rebalancing</div>
            <div className="text-xs text-foreground/60">Rebalance when allocations drift beyond threshold</div>
          </div>
        </label>
      </div>

      {/* Position Size Limit */}
      <div className="space-y-4 p-4 rounded-lg border border-border/30 bg-background/50">
        <h4 className="font-semibold">Position Size Limit</h4>
        <p className="text-sm text-foreground/60">
          Maximum percentage of portfolio in a single asset: {constraints.maxSinglePosition}%
        </p>

        <input
          type="range"
          min="10"
          max="50"
          value={constraints.maxSinglePosition}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
        />

        <div className="flex justify-between text-xs text-foreground/60">
          <span>Conservative (10%)</span>
          <span>Aggressive (50%)</span>
        </div>
      </div>

      {/* Income Options */}
      <div className="space-y-4 p-4 rounded-lg border border-border/30 bg-background/50">
        <h4 className="font-semibold">Income Strategy</h4>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-background/50 p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={constraints.dividendReinvestment}
            onChange={() => handleToggle('dividendReinvestment')}
            className="w-4 h-4 rounded border-border/30 accent-primary"
          />
          <div>
            <div className="font-medium text-sm">Dividend Reinvestment</div>
            <div className="text-xs text-foreground/60">Automatically reinvest all dividends</div>
          </div>
        </label>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
        <p className="text-sm font-semibold text-foreground">Your Configuration:</p>
        <ul className="text-xs text-foreground/70 space-y-1">
          <li>• {constraints.monthlyRebalance ? 'Monthly rebalancing enabled' : 'Monthly rebalancing disabled'}</li>
          <li>• {constraints.autoRebalance ? 'Automatic threshold-based rebalancing enabled' : 'Manual rebalancing only'}</li>
          <li>• Maximum single position: {constraints.maxSinglePosition}%</li>
          <li>• {constraints.dividendReinvestment ? 'Dividend reinvestment enabled' : 'Dividends paid in cash'}</li>
        </ul>
      </div>
    </div>
  )
}
