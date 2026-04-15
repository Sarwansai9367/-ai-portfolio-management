'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import AssetSelector from './asset-selector'
import RiskSelector from './risk-selector'
import ConstraintsConfig from './constraints-config'
import ReviewPortfolio from './review-portfolio'
import { Check, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

export default function SetupWizard() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['AAPL', 'MSFT', 'BND'])
  const [riskLevel, setRiskLevel] = useState('moderate')
  const [constraints, setConstraints] = useState({
    monthlyRebalance: true,
    autoRebalance: true,
    maxSinglePosition: 30,
    dividendReinvestment: true,
  })

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setDirection(1)
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setDirection(-1)
      setStep(step - 1)
    }
  }

  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (!session?.accessToken) return;
    setLoading(true);

    try {
      await fetch('http://localhost:5001/api/user/setup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          assets: selectedAssets,
          riskLevel: riskLevel,
          constraints: constraints,
          initial_cash: 100000.0
        })
      });
      router.push('/dashboard')
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  const stepLabels = ['Select Assets', 'Risk Level', 'Constraints', 'Review']

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Portfolio Setup</h2>
          <p className="text-lg text-foreground/50">
            Step {step} of {totalSteps} • Configure your AI-optimized portfolio
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <motion.div
                animate={{
                  scale: s === step ? 1.1 : 1,
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  s < step
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : s === step
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 glow-cyan'
                    : 'bg-white/[0.04] border border-white/[0.08] text-foreground/40'
                }`}
              >
                {s < step ? <Check className="h-5 w-5" /> : s}
              </motion.div>
              {s < 4 && (
                <div className="flex-1 h-1 mx-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: s < step ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="grid grid-cols-4 gap-2 mb-12 text-center text-xs text-foreground/40">
          {stepLabels.map((label, i) => (
            <span key={label} className={i + 1 === step ? 'text-primary font-medium' : ''}>
              {label}
            </span>
          ))}
        </div>

        {/* Step Content with AnimatePresence */}
        <div className="rounded-2xl glass-card p-8 mb-8 min-h-96 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {step === 1 && <AssetSelector selectedAssets={selectedAssets} onSelect={setSelectedAssets} />}
              {step === 2 && <RiskSelector riskLevel={riskLevel} onSelect={setRiskLevel} />}
              {step === 3 && <ConstraintsConfig constraints={constraints} onUpdate={setConstraints} />}
              {step === 4 && (
                <ReviewPortfolio
                  selectedAssets={selectedAssets}
                  riskLevel={riskLevel}
                  constraints={constraints}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
            className="border-white/[0.08] text-foreground/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed bg-transparent group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Previous
          </Button>

          <div className="flex-1" />

          {step === totalSteps ? (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan px-8 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Complete Setup
                  <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan px-8 group"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
