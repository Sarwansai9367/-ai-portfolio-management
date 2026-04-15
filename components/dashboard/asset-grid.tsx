import { useState } from 'react'
import { PortfolioData, api, CompanyInfo, Holding } from '@/lib/api'
import AssetDetailDialog from './asset-detail-dialog'

export default function AssetGrid({ data }: { data: PortfolioData | null }) {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [assetDetails, setAssetDetails] = useState<CompanyInfo | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const holdings = data?.summary?.holdings || {};
  const totalValue = data?.summary?.totalValue || 1;

  const handleRowClick = async (ticker: string) => {
    setSelectedTicker(ticker);
    setIsDialogOpen(true);
    setLoadingDetails(true);
    try {
      const details = await api.getAssetDetails(ticker);
      setAssetDetails(details);
    } catch (err) {
      console.error("Failed to fetch asset details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const assets = Object.entries(holdings).map(([symbol, valueOrObj], index) => {
    let value = 0;
    let quantity = 0;
    let price = 0;

    if (typeof valueOrObj === 'number') {
      value = valueOrObj;
    } else {
      value = valueOrObj.value;
      quantity = valueOrObj.quantity;
      price = valueOrObj.last_price;
    }

    const allocation = ((value / totalValue) * 100).toFixed(1);

    return {
      id: index,
      symbol,
      name: symbol,
      price,
      quantity,
      value,
      allocation: parseFloat(allocation),
    };
  });

  return (
    <>
      <div className="rounded-xl border border-border/30 bg-card overflow-hidden backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border/30 bg-background/50">
            <h3 className="text-lg font-semibold">Holdings</h3>
          </div>

          {/* Assets Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30 bg-background/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/60">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground/60">
                    Price
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground/60">
                    Qty
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground/60">
                    Value
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground/60">
                    Allocation
                  </th>
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-4 text-center text-foreground/50">No holdings yet. Start the agent to invest.</td></tr>
                ) : assets.map((asset, index) => (
                  <tr
                    key={asset.id}
                    onClick={() => handleRowClick(asset.symbol)}
                    className="border-b border-border/20 hover:bg-background/30 transition-colors group/row cursor-pointer"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-primary/90 group-hover/row:text-primary transition-colors">{asset.symbol}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm opacity-80">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm opacity-80">
                      {asset.quantity.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      ${asset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-2 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/50 transition-all duration-500"
                            style={{ width: `${asset.allocation}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">
                          {asset.allocation}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/30 bg-background/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/60">
                {assets.length} holdings
              </span>
              <span className="text-primary font-semibold">
                Total: ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AssetDetailDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        asset={assetDetails}
        loading={loadingDetails}
      />
    </>
  )
}
