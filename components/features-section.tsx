'use client'

import { motion } from 'framer-motion'
import { Brain, BarChart3, Zap, Shield, Target, Globe } from 'lucide-react'

const features = [
  {
    title: 'AI-Powered Optimization',
    description: 'Machine learning algorithms analyze market data in real-time to optimize your portfolio for maximum risk-adjusted returns.',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    glowColor: 'rgba(59, 130, 246, 0.15)',
  },
  {
    title: 'Explainable Decisions',
    description: 'Every autonomous decision is transparent and documented with clear reasoning, impact analysis, and confidence scores.',
    icon: BarChart3,
    color: 'from-violet-500 to-purple-500',
    glowColor: 'rgba(139, 92, 246, 0.15)',
  },
  {
    title: 'Real-Time Rebalancing',
    description: 'Automatically maintain optimal asset allocation as market conditions change — 24/7 without manual intervention.',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    title: 'Risk Management',
    description: 'Sophisticated VaR, volatility controls, and drawdown limits protect your portfolio during market turbulence.',
    icon: Shield,
    color: 'from-emerald-500 to-green-500',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
  {
    title: 'Predictive Analytics',
    description: 'AI predictions help anticipate market trends and identify emerging opportunities before they peak.',
    icon: Target,
    color: 'from-rose-500 to-pink-500',
    glowColor: 'rgba(244, 63, 94, 0.15)',
  },
  {
    title: 'Multi-Asset Support',
    description: 'Diversify across stocks, bonds, ETFs, crypto, and international assets with unified portfolio management.',
    icon: Globe,
    color: 'from-teal-500 to-cyan-500',
    glowColor: 'rgba(20, 184, 166, 0.15)',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">
            Enterprise-Grade Features
          </span>
          <h3 className="text-4xl sm:text-5xl font-bold">
            Everything You Need for
            <span className="text-gradient-azure-emerald"> Autonomous</span> Investing
          </h3>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Built on a multi-agent AI architecture with real-time data processing, advanced risk analytics, and full transparency.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative p-6 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 cursor-default"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${feature.glowColor}, transparent 70%)` }}
              />
              
              <div className="relative space-y-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h4 className="text-lg font-bold">{feature.title}</h4>
                <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
              </div>

              {/* Bottom border glow on hover */}
              <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 text-center space-y-4"
        >
          <h4 className="text-2xl sm:text-3xl font-bold">Ready to optimize your portfolio?</h4>
          <p className="text-foreground/60 text-lg max-w-xl mx-auto">
            Join thousands of investors who trust AI-powered management for their financial future.
          </p>
          <div className="pt-4">
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-semibold shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] group"
            >
              Get Started Today
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
