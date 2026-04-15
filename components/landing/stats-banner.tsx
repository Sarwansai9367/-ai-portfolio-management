'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Portfolios Managed', value: 10847, prefix: '', suffix: '+' },
  { label: 'Assets Analyzed Daily', value: 2500, prefix: '', suffix: '+' },
  { label: 'AI Decisions Made', value: 1200000, prefix: '', suffix: '+' },
  { label: 'Uptime', value: 99.9, prefix: '', suffix: '%', decimals: 1 },
]

function CountUp({ end, suffix = '', decimals = 0 }: { end: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const duration = 2000
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(eased * end)

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [hasStarted, end])

  const formatNumber = (num: number) => {
    if (decimals > 0) return num.toFixed(decimals)
    const rounded = Math.floor(num)
    if (rounded >= 1000000) return (rounded / 1000000).toFixed(1) + 'M'
    if (rounded >= 1000) return (rounded / 1000).toFixed(rounded >= 10000 ? 0 : 1) + 'K'
    return rounded.toLocaleString()
  }

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {formatNumber(count)}{suffix}
    </span>
  )
}

export default function StatsBanner() {
  return (
    <section className="py-16 border-y border-border/20 bg-card/50 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-emerald-500/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center space-y-2"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient-azure-emerald">
                <CountUp end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </div>
              <p className="text-sm text-foreground/50 font-medium tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
