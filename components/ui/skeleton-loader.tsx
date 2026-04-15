'use client'

import { cn } from '@/lib/utils'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
}

export function SkeletonLoader({ className, variant = 'text', width, height }: SkeletonLoaderProps) {
  const baseClasses = "animate-skeleton bg-muted/50"
  
  const variantClasses = {
    text: "h-4 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-xl",
  }

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="space-y-3">
        <SkeletonLoader className="h-8 w-64" />
        <SkeletonLoader className="h-4 w-96" />
      </div>

      {/* Market status skeleton */}
      <SkeletonLoader variant="card" className="h-16 w-full" />

      {/* Portfolio health + risk metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonLoader variant="card" className="h-72 w-full" />
        </div>
        <SkeletonLoader variant="card" className="h-72 w-full" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonLoader variant="card" className="h-80 w-full" />
        <SkeletonLoader variant="card" className="h-80 w-full" />
      </div>

      {/* Holdings table */}
      <SkeletonLoader variant="card" className="h-64 w-full" />
    </div>
  )
}
