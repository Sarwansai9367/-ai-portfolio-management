import { motion, AnimatePresence } from 'framer-motion'
import { Activity } from 'lucide-react'

export interface NewsEvent {
  ticker: string
  headline: string
  sentiment: number
}

export default function NewsTicker({ news }: { news: NewsEvent[] }) {
  if (!news || news.length === 0) return null

  return (
    <div className="glass-card rounded-xl p-4 overflow-hidden mb-6 flex items-center border border-white/10">
      <div className="flex items-center gap-2 pr-4 border-r border-border min-w-[120px]">
        <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
        <span className="text-sm font-semibold tracking-wider text-emerald-400">LIVE FEED</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative h-6 ml-4">
        <AnimatePresence mode="popLayout">
          {news.slice(0, 1).map((item, idx) => (
            <motion.div
              key={`${item.ticker}-${idx}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center text-sm truncate"
            >
              <span className="font-bold text-blue-400 mr-2">[{item.ticker}]</span>
              <span className="text-foreground/80 truncate">{item.headline}</span>
              <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${item.sentiment >= 1.0 ? 'bg-success/20 text-success' : item.sentiment < 1.0 ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                Mult: {item.sentiment.toFixed(2)}x
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
