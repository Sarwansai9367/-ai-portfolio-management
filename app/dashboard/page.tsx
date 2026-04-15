'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { io } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import DashboardHeader from '@/components/dashboard/header'
import PortfolioHealthCard from '@/components/dashboard/portfolio-health-card'
import AssetAllocationChart from '@/components/dashboard/asset-allocation-chart'
import PerformanceChart from '@/components/dashboard/performance-chart'
import RiskMetricsPanel from '@/components/dashboard/risk-metrics-panel'
import AssetGrid from '@/components/dashboard/asset-grid'
import DashboardNav from '@/components/dashboard/dashboard-nav'
import NewsTicker, { NewsEvent } from '@/components/dashboard/news-ticker'
import AiChat from '@/components/dashboard/ai-chat'
import { api, PortfolioData } from '@/lib/api'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogOut, Zap, User, AlertCircle } from 'lucide-react'
import { DashboardSkeleton } from '@/components/ui/skeleton-loader'

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [newsFeed, setNewsFeed] = useState<NewsEvent[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';

  const fetchData = async () => {
    if (!session?.accessToken) return;
    try {
      const res = await api.getPortfolio(session.accessToken as string);
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  const runAgent = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await api.startAutonomousLoop(session.accessToken as string);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to start autonomous loop');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
      
      const socket = io(API_URL);
      socket.emit('join', { token: session.accessToken as string });
      
      socket.on('progress_update', (msg) => {
        if (msg.error) {
          setErrorMsg(`Loop Error: ${msg.error}`);
          setLoading(false);
        } else if (msg.step === 'error') {
           setErrorMsg(`Error: ${msg.message}`);
           setLoading(false);
        } else if (msg.step === 7) {
          setProgressMsg('Optimization Completed!');
          fetchData();
          setTimeout(() => setProgressMsg(""), 5000);
          setLoading(false);
        } else {
          setProgressMsg(msg.message);
        }
      });

      socket.on('news_event', (msg: NewsEvent) => {
        setNewsFeed(prev => [msg, ...prev].slice(0, 5));
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardNav />
        <div className="flex-1 p-8 ml-64">
           <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || 'Investor';

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link href="/">
              <motion.h1 
                whileHover={{ scale: 1.02 }}
                className="text-2xl font-bold text-gradient-azure-emerald cursor-pointer"
              >
                PortfolioAI
              </motion.h1>
            </Link>
            
            <div className="flex items-center gap-4">
              {/* User Identity */}
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-foreground/80">{userName}</span>
              </div>

              {/* Logout */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => signOut()}
                className="text-foreground/40 hover:text-red-400 hover:bg-red-500/10 rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-65px)]">
        {/* Sidebar Nav */}
        <DashboardNav />

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto bg-dot-pattern">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
          >
            {/* Header / Greeting */}
            <DashboardHeader userName={userName} />

            {/* Error Banner */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3"
                >
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{errorMsg}</p>
                  <Button variant="ghost" size="sm" onClick={() => setErrorMsg("")} className="ml-auto hover:bg-destructive/10">Dismiss</Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Run Agent CTA */}
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-emerald-500/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-1">
                <h4 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Autonomous Agent Optimization
                </h4>
                <p className="text-sm text-foreground/50">Run our multi-agent AI loop to rebalance your portfolio based on real-time sentiment and risk analysis.</p>
              </div>
              <Button
                size="lg"
                onClick={runAgent}
                disabled={loading}
                className={`min-w-[240px] px-8 py-6 rounded-xl font-bold shadow-lg transition-all duration-300 ${
                   loading ? 'bg-secondary' : 'bg-primary hover:bg-primary/90 glow-cyan hover:shadow-primary/40'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span className="animate-pulse">{progressMsg || "Optimizing..."}</span>
                  </div>
                ) : (
                  "Run Autonomous Optimization"
                )}
              </Button>
            </div>

            {/* News Feed */}
            <AnimatePresence>
              {newsFeed.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
                  <NewsTicker news={newsFeed} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid Layout for Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-6">
              <div className="lg:col-span-2">
                <PortfolioHealthCard data={data} />
              </div>
              <RiskMetricsPanel data={data} />
            </div>

            {/* Dynamic Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PerformanceChart />
              <AssetAllocationChart data={data} />
            </div>

            {/* Full Asset Table */}
            <AssetGrid data={data} />
          </motion.div>
        </main>
        
        {/* Introspection AI */}
        <AiChat />
      </div>
    </div>
  )
}
