'use client'

const riskProfiles = [
  {
    id: 'conservative',
    name: 'Conservative',
    description: 'Focus on capital preservation with lower volatility',
    allocation: '70% Bonds, 30% Stocks',
    expectedReturn: '4-6%',
    volatility: 'Low',
    icon: '🛡️',
  },
  {
    id: 'moderate',
    name: 'Moderate',
    description: 'Balanced growth with moderate risk tolerance',
    allocation: '50% Stocks, 50% Bonds',
    expectedReturn: '6-8%',
    volatility: 'Medium',
    icon: '⚖️',
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    description: 'Maximum growth focused with higher volatility',
    allocation: '80% Stocks, 20% Bonds',
    expectedReturn: '8-12%',
    volatility: 'High',
    icon: '🚀',
  },
]

interface RiskSelectorProps {
  riskLevel: string
  onSelect: (level: string) => void
}

export default function RiskSelector({ riskLevel, onSelect }: RiskSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Risk Level</h3>
        <p className="text-foreground/60 text-sm">
          Choose a risk profile that matches your investment goals and time horizon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {riskProfiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onSelect(profile.id)}
            className={`p-6 rounded-lg border transition-all text-left ${
              riskLevel === profile.id
                ? 'border-primary bg-primary/10'
                : 'border-border/30 hover:border-primary/30'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{profile.icon}</div>
              {riskLevel === profile.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm">
                  ✓
                </div>
              )}
            </div>

            <h4 className="text-lg font-semibold mb-1">{profile.name}</h4>
            <p className="text-sm text-foreground/60 mb-4">{profile.description}</p>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-foreground/60">Allocation:</span>
                <span className="ml-2 font-medium">{profile.allocation}</span>
              </div>
              <div>
                <span className="text-foreground/60">Expected Return:</span>
                <span className="ml-2 font-medium text-primary">{profile.expectedReturn}</span>
              </div>
              <div>
                <span className="text-foreground/60">Volatility:</span>
                <span className="ml-2 font-medium">{profile.volatility}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-foreground/70">
          You selected: <span className="text-primary font-semibold capitalize">{riskLevel}</span> risk profile
        </p>
      </div>
    </div>
  )
}
