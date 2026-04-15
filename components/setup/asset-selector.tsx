'use client'

const assets = [
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Tech' },
  { symbol: 'MSFT', name: 'Microsoft', category: 'Tech' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Tech' },
  { symbol: 'AMZN', name: 'Amazon', category: 'Tech' },
  { symbol: 'JPM', name: 'JPMorgan Chase', category: 'Finance' },
  { symbol: 'BND', name: 'Bond ETF', category: 'Bonds' },
  { symbol: 'VGK', name: 'Vanguard Europe', category: 'International' },
  { symbol: 'GLD', name: 'Gold ETF', category: 'Commodities' },
  { symbol: 'QQQ', name: 'Nasdaq ETF', category: 'Index' },
  { symbol: 'SPY', name: 'S&P 500 ETF', category: 'Index' },
]

interface AssetSelectorProps {
  selectedAssets: string[]
  onSelect: (assets: string[]) => void
}

export default function AssetSelector({ selectedAssets, onSelect }: AssetSelectorProps) {
  const toggleAsset = (symbol: string) => {
    if (selectedAssets.includes(symbol)) {
      onSelect(selectedAssets.filter((s) => s !== symbol))
    } else {
      onSelect([...selectedAssets, symbol])
    }
  }

  const categories = ['Tech', 'Finance', 'Bonds', 'International', 'Commodities', 'Index']

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Assets</h3>
        <p className="text-foreground/60 text-sm">
          Choose from a diverse selection of stocks, bonds, and ETFs. You have selected {selectedAssets.length} assets.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-foreground/70 mb-2">{category}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {assets
                .filter((asset) => asset.category === category)
                .map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => toggleAsset(asset.symbol)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedAssets.includes(asset.symbol)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/30 text-foreground/60 hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    <div className="font-semibold text-sm">{asset.symbol}</div>
                    <div className="text-xs opacity-70">{asset.name}</div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-foreground/70">
          Selected: <span className="text-primary font-semibold">{selectedAssets.join(', ')}</span>
        </p>
      </div>
    </div>
  )
}
