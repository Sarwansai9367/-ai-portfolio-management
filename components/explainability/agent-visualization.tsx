'use client'

import { mockAgents } from '@/lib/mock-data'

export default function AgentVisualization() {
  return (
    <div className="rounded-xl border border-border/30 bg-card p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-6">
        <h3 className="text-lg font-semibold">AI Agent Network</h3>

        {/* Agents List */}
        <div className="space-y-3">
          {mockAgents.map((agent, index) => (
            <div
              key={agent.name}
              className="p-4 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-all group/agent"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full animate-pulse-glow"
                    style={{ backgroundColor: agent.color, opacity: agent.status === 'active' ? 1 : 0.3 }}
                  />
                  <div>
                    <div className="font-semibold text-sm">{agent.name}</div>
                    <div className="text-xs text-foreground/60 capitalize">{agent.status}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${agent.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted/10 text-foreground/50'}`}>
                  {agent.status === 'active' ? 'Online' : 'Idle'}
                </span>
              </div>

              {/* Connections */}
              {agent.connections.length > 0 && (
                <div className="text-xs text-foreground/60">
                  <span className="block">Connects to:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.connections.map((conn) => (
                      <span key={conn} className="px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {conn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Network Stats */}
        <div className="pt-6 border-t border-border/30 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-foreground/60">Network Health</span>
              <span className="text-sm font-semibold text-success">98%</span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-success/50 rounded-full" style={{ width: '98%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-foreground/60">Active Agents</span>
              <span className="text-sm font-semibold text-primary">3/4</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-foreground/60">Decisions Today</span>
              <span className="text-sm font-semibold text-primary">24</span>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-foreground/70 leading-relaxed">
            Autonomous agents work together 24/7 to analyze market data, predict trends, and optimize your portfolio allocation.
          </p>
        </div>
      </div>
    </div>
  )
}
