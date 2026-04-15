'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { io } from 'socket.io-client'
import { motion } from 'framer-motion'
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
import { LogOut, Zap, User } from 'lucide-react'

// Skeleton loading screen
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="skeleton w-32 h-8 rounded-lg" />
            <div className="flex gap-3">
              <div className="skeleton w-48 h-9 rounded-lg" />
              <div className="skeleton w-20 h-9 rounded-lg" />
            </div>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 ml-64">
        <div className="skeleton w-64 h-10 rounded-lg mb-4" />
        <div className="skeleton w-96 h-5 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 skeleton h-64 rounded-xl" />
          <div className="skeleton h-64 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="skeleton h-80 rounded-xl" />
          <div className="skeleton h-80 rounded-xl" />
        </div>
        <div className="skeleton h-48 rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [newsFeed, setNewsFeed] = useState<NewsEvent[]>([]);

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
    try {
      await api.startAutonomousLoop(session.accessToken as string);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setProgressMsg(err.message || 'Error starting autonomous loop');
      setTimeout(() => setProgressMsg(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
      
      const socket = io('http://localhost:5001');
      socket.emit('join', { token: session.accessToken as string });
      
      socket.on('progress_update', (msg) => {
        if (msg.error) {
          setProgressMsg(`Error: ${msg.error}`);
          setLoading(false);
        } else if (msg.step === 7) {
          setProgressMsg('Completed!');
          fetchData();
          setTimeout(() => setProgressMsg(""), 3000);
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
    return <DashboardSkeleton />;
  }

  const userName = session?.user?.name || 'Investor';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold animated-gradient-text cursor-pointer hover:opacity-80 transition-opacity"
              >
                PortfolioAI
              </motion.h1>
            </Link>
            <div className="flex items-center gap-3">
              {/* Run Agent Button */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Button
                  size="sm"
                  onClick={runAgent}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px] glow-cyan transition-all group"
                >
                  {loading && progressMsg ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {progressMsg}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                      Run Autonomous Agent
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* User Info + Logout */}
              <div className="flex items-center gap-2 ml-2">
                <div className="hidden sm:flex items-center gap-2 glass-card rounded-full px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-foreground/70 font-medium">{userName}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => signOut()}
                  className="text-foreground/50 hover:text-foreground hover:bg-white/5"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <DashboardNav />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
          >
            {/* Welcome + Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <DashboardHeader userName={userName} />
            </motion.div>

            {/* Live News Ticker */}
            {newsFeed.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <NewsTicker news={newsFeed} />
              </motion.div>
            )}

            {/* Portfolio Health */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-6">
              <div className="lg:col-span-2">
                <PortfolioHealthCard data={data} />
              </div>
              <RiskMetricsPanel data={data} />
            </motion.div>

            {/* Charts */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PerformanceChart />
              <AssetAllocationChart data={data} />
            </motion.div>

            {/* Asset Grid */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <AssetGrid data={data} />
            </motion.div>
          </motion.div>
        </main>
        
        {/* Floating Explainable AI Chatbot */}
        <AiChat />
      </div>
    </div>
  )
}
