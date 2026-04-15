'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CompanyInfo } from "@/lib/api"

interface AssetDetailDialogProps {
    isOpen: boolean
    onClose: () => void
    asset: CompanyInfo | null
    loading: boolean
}

export default function AssetDetailDialog({ isOpen, onClose, asset, loading }: AssetDetailDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-card border-border/50 text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                        {loading ? 'Loading...' : asset?.symbol}
                        {asset?.sector && (
                            <span className="text-sm font-normal px-2 py-1 rounded bg-primary/10 text-primary">
                                {asset.sector}
                            </span>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-foreground/60">
                        {loading ? 'Fetching company details...' : asset?.name}
                    </DialogDescription>
                </DialogHeader>

                {!loading && asset && (
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/50 p-3 rounded-lg">
                                <p className="text-xs text-foreground/50 mb-1">Market Cap</p>
                                <p className="font-mono text-lg">${(asset.marketCap / 1e9).toFixed(2)}B</p>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg">
                                <p className="text-xs text-foreground/50 mb-1">P/E Ratio</p>
                                <p className="font-mono text-lg">{asset.peRatio?.toFixed(2) || 'N/A'}</p>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg">
                                <p className="text-xs text-foreground/50 mb-1">52W High</p>
                                <p className="font-mono text-lg">${asset.fiftyTwoWeekHigh?.toFixed(2)}</p>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg">
                                <p className="text-xs text-foreground/50 mb-1">Industry</p>
                                <p className="text-sm font-medium break-words leading-tight">{asset.industry}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2 text-sm text-foreground/80">Business Summary</h4>
                            <div className="max-h-[200px] overflow-y-auto text-sm text-foreground/70 leading-relaxed pr-2">
                                {asset.description}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
