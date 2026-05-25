import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Shield, LogIn, AlertCircle } from 'lucide-react'

interface LoginProps {
  onDemoLogin: () => void
}

export default function Login({ onDemoLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/` }
      })
      if (authError) {
        setError(authError.message?.includes('rate') ? 'Rate limit. Use demo mode.' : authError.message)
      } else {
        setError('Ссылка отправлена на почту')
        setEmail('')
      }
    } catch {
      setError('Server unavailable. Use demo mode.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#8b5cf6] rounded-full opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#06b6d4] rounded-full opacity-[0.02] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#8b5cf6]/[0.02] to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="relative w-20 h-20 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-[#8b5cf6]/20 blur-2xl rounded-full" />
            <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <span className="text-white font-black text-3xl tracking-tight">K</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-black tracking-tight"
          >
            <span className="text-gradient">Каяран</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#64748b] text-sm mt-1 tracking-widest uppercase"
          >
            Tournament Platform
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card-glow p-6 sm:p-8 space-y-5"
        >
          {/* Demo button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDemoLogin}
            className="btn-primary w-full py-3.5 text-base"
            autoFocus
          >
            <Shield className="w-5 h-5" />
            Войти в демо-режиме
          </motion.button>

          <div className="divider" />

          {/* Email form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              className="input text-sm"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${
                  error.includes('отправлена')
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="btn-ghost w-full py-2.5 text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#64748b] border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn className="w-4 h-4" />Войти по email</>
              )}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-[#475569] text-xs mt-6 tracking-wide">
          Данные сохраняются локально в браузере
        </p>
      </motion.div>
    </div>
  )
}
