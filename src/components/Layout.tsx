import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, LogOut, Menu, Moon, Sun, User as UserIcon, BarChart3, Gamepad2, X } from 'lucide-react'

interface LayoutProps {
  user: User | null
  onLogout?: () => void
}

const navItems = [
  { path: '/', label: 'Турниры', icon: Trophy },
  { path: '/stats', label: 'Статистика', icon: BarChart3 },
  { path: '/games', label: 'Игры', icon: Gamepad2 },
  { path: '/profile', label: 'Профиль', icon: UserIcon }
]

export default function Layout({ user, onLogout }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef(0)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (dx < -80) setSidebarOpen(false)
  }

  const handleLogout = async () => {
    if (onLogout) onLogout()
    await supabase.auth.signOut().catch(() => {})
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            ref={sidebarRef}
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0f] border-r border-[#2a2a3a] lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a3a]/50">
              <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
                >
                  <span className="text-white font-black text-base">K</span>
                </div>
                <span className="font-bold text-sm text-gradient">Каяран</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-[#64748b] hover:text-[#e2e8f0]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item: any) => {
                const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
                return (
                  <button key={item.path} onClick={() => { setSidebarOpen(false); navigate(item.path) }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active ? 'bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/20' : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/[0.03]'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
            <div className="p-3 border-t border-[#2a2a3a]/50 space-y-1">
              <button onClick={() => setDark(!dark)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/[0.03] transition-all duration-200"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {dark ? 'Светлая тема' : 'Тёмная тема'}
              </button>
              {user && (
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-r border-[#2a2a3a]/50">
        <div className="p-6 border-b border-[#2a2a3a]/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg relative"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}
            >
              <span className="text-white font-black text-lg">K</span>
            </div>
            <div>
              <span className="font-bold text-base text-gradient">Каяран</span>
              <span className="block text-[10px] text-[#475569] tracking-[0.2em] uppercase">Platform</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item: any) => {
            const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active ? 'bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/20' : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/[0.03]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="p-3 border-t border-[#2a2a3a]/50 space-y-1">
          <button onClick={() => setDark(!dark)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/[0.03] transition-all duration-200"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {dark ? 'Светлая тема' : 'Тёмная тема'}
          </button>
          {user && (
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 bg-[#0a0a0f]/60 backdrop-blur-xl border-b border-[#2a2a3a]/30">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[#64748b] hover:text-[#e2e8f0] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-sm text-gradient">Каяран</span>
            </Link>
            {user && <span className="text-xs text-[#64748b] ml-auto hidden sm:block">{user.email}</span>}
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
