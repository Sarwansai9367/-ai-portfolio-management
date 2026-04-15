'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'Quantitative Analyst',
    quote: 'PortfolioAI transformed how I manage client portfolios. The explainability feature alone is worth it — every decision is transparent and backed by data.',
    rating: 5,
    initials: 'AT',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Sarah Chen',
    role: 'Independent Investor',
    quote: 'I was skeptical about AI-driven investing, but the risk management and real-time rebalancing have consistently outperformed my manual strategies.',
    rating: 5,
    initials: 'SC',
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'Marcus Rivera',
    role: 'Portfolio Manager',
    quote: 'The multi-agent architecture is brilliant. Having specialized agents for sentiment, risk, and allocation working together gives a holistic view I\'ve never had before.',
    rating: 5,
    initials: 'MR',
    color: 'from-emerald-500 to-green-500',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 }
  }
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
}

export default function Testimonials() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            Trusted by Investors
          </span>
          <h3 className="text-4xl sm:text-5xl font-bold">What Our Users Say</h3>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Join thousands of investors who trust AI to manage their financial future.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative p-6 rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="relative space-y-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground/70 text-sm leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/20">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-foreground/50">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
