import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Globe } from 'lucide-react'

interface Props { onDemoLogin: () => void }

export default function LoginPage({ onDemoLogin }: Props) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b5cf6] rounded-full opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#06b6d4] rounded-full opacity-[0.02] blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 0 40px rgba(139,92,246,0.25)' }}
          >
            <span className="text-white font-black text-2xl">K</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight"><span className="text-gradient">Каяран</span></h1>
          <p className="text-xs text-[#64748b] tracking-[0.2em] uppercase mt-2">Tournament Platform</p>
        </div>

        <div className="glass-card p-6 space-y-4">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-emerald-500/20 border border-emerald-500/30">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-sm text-[#cbd5e1] font-medium mb-1">Письмо отправлено</p>
              <p className="text-xs text-[#475569]">Проверьте почту {email}</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <input className="input text-sm text-center" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                  {loading ? 'Отправка...' : 'Войти через email'}
                </button>
              </form>

              <button onClick={handleGoogleLogin} disabled={loading} className="btn-cyber w-full justify-center text-sm">
                <Globe className="w-4 h-4" />Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#2a2a3a]" />
                <span className="text-[11px] text-[#475569]">или</span>
                <div className="flex-1 h-px bg-[#2a2a3a]" />
              </div>

              <button onClick={onDemoLogin} className="btn-ghost w-full justify-center text-xs">
                Демо-режим (без регистрации)
              </button>
            </>
          )}
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 text-center mt-4">
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}
