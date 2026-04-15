'use client'

import { useState } from 'react'
import { mockDecisions } from '@/lib/mock-data'

export default function DecisionTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'bg-success/10 text-success'
      case 'sell':
        return 'bg-destructive/10 text-destructive'
      case 'rebalance':
        return 'bg-primary/10 text-primary'
      default:
        return 'bg-muted/10 text-foreground'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy':
        return '↑'
      case 'sell':
        return '↓'
      case 'rebalance':
        return '⚖️'
      default:
        return '—'
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {mockDecisions.map((decision, index) => (
        <div
          key={decision.id}
          className="rounded-xl border border-border/30 bg-card overflow-hidden hover:border-primary/30 transition-all duration-300 group cursor-pointer animate-slide-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => setExpandedId(expandedId === decision.id ? null : decision.id)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${getActionColor(decision.action)}`}>
                  {getActionIcon(decision.action)}
                </div>
                <div>
                  <div className="font-semibold capitalize flex items-center gap-2">
                    {decision.action} {decision.asset}
                    <span className="text-xs px-2 py-1 rounded bg-muted/50 text-foreground/60 font-mono font-normal">
                      {decision.quantity}
                    </span>
                  </div>
                  <div className="text-sm text-foreground/60">
                    {decision.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className={`text-right ${decision.impact > 0 ? 'text-success' : decision.impact < 0 ? 'text-destructive' : 'text-foreground/60'}`}>
                <div className="text-lg font-bold">
                  {decision.impact > 0 ? '+' : ''}{decision.impact}
                </div>
                <div className="text-xs text-foreground/60">Impact</div>
              </div>
            </div>

            {/* Reason - always visible */}
            <div className="p-3 bg-background/50 rounded-lg border border-border/20">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {decision.reason}
              </p>
            </div>

            {/* Expanded details */}
            {expandedId === decision.id && (
              <div className="mt-4 space-y-4 pt-4 border-t border-border/20 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Decision ID</p>
                    <p className="font-mono text-sm">{decision.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Status</p>
                    <p className="text-sm text-success font-semibold">Executed</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-foreground/60 mb-2">AI Reasoning</p>
                  <div className="space-y-2 bg-background/30 rounded-lg p-3 border border-primary/10">
                    <div className="text-sm">
                      <span className="text-foreground/60">Algorithm: </span>
                      <span className="text-primary font-semibold">Multi-Agent Optimization</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-foreground/60">Confidence: </span>
                      <span className="text-primary font-semibold">94.2%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-foreground/60">Risk Score: </span>
                      <span className="text-primary font-semibold">Low</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg border border-border/30 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium">
                    Revert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
