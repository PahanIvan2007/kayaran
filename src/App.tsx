import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'
import Layout from './components/Layout'
import { Loader2 } from 'lucide-react'
import { analytics } from './lib/analytics'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const TournamentsPage = lazy(() => import('./pages/TournamentsPage'))
const TournamentPage = lazy(() => import('./pages/TournamentPage'))
const MatchesPage = lazy(() => import('./pages/MatchesPage'))
const RefereePage = lazy(() => import('./pages/RefereePage'))
const PlayerPage = lazy(() => import('./pages/PlayerPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const StatsPage = lazy(() => import('./pages/StatsPage'))
const GamesPage = lazy(() => import('./pages/GamesPage'))

const DEMO_USER_KEY = 'kayaran_demo_user'

function PageLoader() {
  return (
    <div className="flex justify-center py-32">
      <Loader2 className="w-6 h-6 text-[#8b5cf6] animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analytics.pageView(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const demoUser = localStorage.getItem(DEMO_USER_KEY)
    if (demoUser) {
      setUser(JSON.parse(demoUser))
      setLoading(false)
      return
    }

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch(() => { setLoading(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        if (!document.fullscreenElement) document.documentElement.requestFullscreen()
        else document.exitFullscreen()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@kayaran.app',
      user_metadata: { full_name: 'Демо-пользователь' },
      created_at: new Date().toISOString()
    } as unknown as User
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const handleLogout = () => {
    localStorage.removeItem(DEMO_USER_KEY)
    supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]" />
      </div>
    )
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <LoginPage onDemoLogin={handleDemoLogin} />
        } />
        <Route path="/player/:userId" element={<PlayerPage />} />
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={
            user ? <Suspense fallback={<PageLoader />}><TournamentsPage /></Suspense> : <Navigate to="/login" />
          } />
          <Route path="/tournament/:id" element={<Suspense fallback={<PageLoader />}><TournamentPage /></Suspense>} />
          <Route path="/tournament/:id/matches" element={<Suspense fallback={<PageLoader />}><MatchesPage /></Suspense>} />
          <Route path="/referee/:matchId" element={<Suspense fallback={<PageLoader />}><RefereePage /></Suspense>} />
          <Route path="/stats" element={<Suspense fallback={<PageLoader />}><StatsPage /></Suspense>} />
          <Route path="/games" element={<Suspense fallback={<PageLoader />}><GamesPage /></Suspense>} />
          <Route path="/profile" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
        </Route>
      </Routes>
    </Suspense>
  )
}
