import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'I am your PortfolioAI quantification engine. Ask me why I chose an asset, how my Sentiment engine works, or about Crypto volatility!' }
  ])
  const [inputMsg, setInputMsg] = useState('')
  const [loading, setLoading] = useState(false)
  
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const { data: session } = useSession()

  const sendMsg = async () => {
    if (!inputMsg.trim() || !session?.accessToken) return
    const text = inputMsg
    setInputMsg('')
    setMessages(prev => [...prev, { role: 'user', text }])
    
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ message: text }) // user_id is implicit via token
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Systems unreachable. Try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-transform hover:scale-110"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 rounded-2xl border border-white/10 p-0 overflow-hidden shadow-2xl z-40 glass-card flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="p-4 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center gap-3">
              <Bot className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-gradient-azure-emerald">AI Logic Engine</h3>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`p-2 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-primary/20 text-primary-foreground' : 'bg-white/5 border border-white/10'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                 <div className="flex gap-1 items-center p-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                 </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-black/40 backdrop-blur-xl border-t border-white/10 relative">
              <input
                type="text"
                placeholder="Ask about my internal logic..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
              />
              <button 
                className="absolute right-5 top-1/2 -translate-y-1/2 text-primary hover:text-emerald-400 disabled:opacity-50 transition-colors"
                onClick={sendMsg}
                disabled={loading || !inputMsg.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
