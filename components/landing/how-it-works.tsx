'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Settings, TrendingUp } from 'lucide-react'

const steps = [
  {
    icon: Settings,
    title: 'Configure',
    description: 'Select your assets, set risk tolerance, and define investment constraints in our guided setup wizard.',
    color: 'from-blue-500 to-blue-600',
    glowColor: 'rgba(59, 130, 246, 0.3)',
  },
  {
    icon: Cpu,
    title: 'AI Analyzes',
    description: 'Our multi-agent AI system processes market data, sentiment, and macro signals to find optimal allocations.',
    color: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139, 92, 246, 0.3)',
  },
  {
    icon: TrendingUp,
    title: 'Auto-Optimize',
    description: 'Your portfolio is autonomously rebalanced with transparent, explainable decisions — 24/7.',
    color: 'from-emerald-500 to-green-600',
    glowColor: 'rgba(16, 185, 129, 0.3)',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden">
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            Simple Yet Powerful
          </span>
          <h3 className="text-4xl sm:text-5xl font-bold">How It Works</h3>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            From setup to autonomous management in three simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-emerald-500/30" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              className="relative text-center group"
            >
              {/* Step number badge */}
              <div className="relative mx-auto mb-6">
                <div 
                  className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  style={{ boxShadow: `0 10px 40px ${step.glowColor}` }}
                >
                  <step.icon className="h-9 w-9 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-sm font-bold text-foreground/80">
                  {index + 1}
                </span>
              </div>

              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-foreground/60 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {/* Arrow connector (mobile) */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-6">
                  <ArrowRight className="h-5 w-5 text-foreground/20 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
