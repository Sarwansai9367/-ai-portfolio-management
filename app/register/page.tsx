'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

  // Password strength
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-400'][strength];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || 'Failed to register');
        return;
      }

      // Auto login after successful registration
      const signRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signRes?.error) {
        setError('Account created, but automatic sign-in failed. Please sign in manually.');
        return;
      }

      router.push('/setup');
    } catch (e) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-blue-600/10 to-violet-600/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        {/* Floating orbs */}
        <div className="absolute top-32 right-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-[90px] animate-float" />
        <div className="absolute bottom-32 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] animate-float-slow" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-violet-500/8 rounded-full blur-[120px]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Link href="/">
              <h1 className="text-4xl font-bold text-gradient-azure-emerald cursor-pointer hover:opacity-80 transition-opacity">
                PortfolioAI
              </h1>
            </Link>
            <p className="text-xl text-foreground/60 leading-relaxed max-w-md">
              Create your account and start building an AI-optimized portfolio in minutes.
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4"
          >
            {[
              { icon: TrendingUp, text: 'AI-optimized portfolio allocation' },
              { icon: Shield, text: 'Enterprise-grade security & encryption' },
              { icon: Zap, text: 'Real-time autonomous rebalancing' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-foreground/50">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Link href="/">
              <h1 className="text-3xl font-bold text-gradient-azure-emerald inline-block cursor-pointer">PortfolioAI</h1>
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="text-foreground/50">Start your AI-powered investing journey</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/70">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-card border border-border/50 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-foreground/30"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/70">Email</label>
              <input
                type="email"
                required
                className="w-full bg-card border border-border/50 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-foreground/30"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/70">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="w-full bg-card border border-border/50 rounded-xl py-3 px-4 pr-12 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-foreground/30"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5"
                >
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : 'bg-border/30'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-foreground/40">
                    Password strength: <span className={`font-medium ${strength >= 4 ? 'text-emerald-400' : strength >= 3 ? 'text-amber-400' : 'text-foreground/50'}`}>{strengthLabel}</span>
                  </p>
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Terms notice */}
            <p className="text-xs text-foreground/30 text-center leading-relaxed">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-foreground/50">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
