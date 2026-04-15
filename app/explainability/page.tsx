'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import DashboardNav from '@/components/dashboard/dashboard-nav'
import DecisionTimeline from '@/components/explainability/decision-timeline'
import AgentVisualization from '@/components/explainability/agent-visualization'

export default function ExplainabilityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                PortfolioAI
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" size="sm">
                  Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <DashboardNav />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold mb-2">AI Decision Timeline</h2>
              <p className="text-lg text-foreground/60">
                View all autonomous decisions made by your AI agents with full transparency and reasoning.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Timeline */}
              <div className="lg:col-span-2">
                <DecisionTimeline />
              </div>

              {/* Agent Visualization */}
              <div>
                <AgentVisualization />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
