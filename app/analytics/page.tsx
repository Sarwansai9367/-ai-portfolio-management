'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import DashboardNav from '@/components/dashboard/dashboard-nav'
import PredictionChart from '@/components/analytics/prediction-chart'
import CorrelationHeatmap from '@/components/analytics/correlation-heatmap'
import PerformanceAttribution from '@/components/analytics/performance-attribution'

export default function AnalyticsPage() {
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
              <Link href="/explainability">
                <Button variant="ghost" size="sm">
                  Decisions
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
              <h2 className="text-4xl font-bold mb-2">Advanced Analytics</h2>
              <p className="text-lg text-foreground/60">
                Deep insights into predictions, correlations, and performance attribution.
              </p>
            </div>

            {/* Charts Grid */}
            <div className="space-y-8">
              {/* Prediction Chart */}
              <PredictionChart />

              {/* Heatmap and Attribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CorrelationHeatmap />
                <PerformanceAttribution />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
