import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { seedDemoData } from '../lib/seed'
import StatsDashboard from '../components/StatsDashboard'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Plus, MapPin, Loader2, CheckCircle2, X, Zap } from 'lucide-react'

interface TournamentItem {
  id: string; title: string; location: string | null
  start_date: string | null; end_date: string | null
  status: string; created_at: string
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
}
const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function TournamentsPage() {
  const navigate = useNavigate()
  const [tournaments, setTournaments] = useState<TournamentItem[]>([])
  const [liveMatches, setLiveMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ tournaments: 0, matches: 0, teams: 0, live: 0 })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', location: '', start_date: '', end_date: '' })
  const [notify, setNotify] = useState<string | null>(null)
  const [notifyType, setNotifyType] = useState<'success'|'error'>('success')
  const [creating, setCreating] = useState(false)

  useEffect(() => { init() }, [])

  const init = async () => {
    let data = await api.getTournaments()
    if (data.length === 0) { await seedDemoData(); data = await api.getTournaments() }
    setTournaments(data)
    const [matches, teams] = await Promise.all([api.getMatches(), api.getTeams()])
    setLiveMatches(matches.filter((m: any) => m.status === 'live'))
    setStats({
      tournaments: data.length,
      matches: matches.length,
      teams: teams.length,
      live: matches.filter((m: any) => m.status === 'live').length
    })
    setLoading(false)
  }

  const showN = (msg: string, t: 'success'|'error' = 'success') => {
    setNotify(msg); setNotifyType(t)
    setTimeout(() => setNotify(null), 3000)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setCreating(true)
    try {
      const t = await api.createTournament({
        title: form.title, location: form.location || null,
        start_date: form.start_date || null, end_date: form.end_date || null, status: 'draft'
      })
      showN(`«${t.title}» создан`)
      setShowForm(false); setForm({ title: '', location: '', start_date: '', end_date: '' })
      setTournaments(await api.getTournaments())
      setTimeout(() => navigate(`/tournament/${t.id}`), 600)
    } catch (err: any) { showN(err?.message || 'Ошибка', 'error') }
    setCreating(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-6 h-6 text-[#8b5cf6] animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {notify && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${
              notifyType === 'success' ? 'bg-emerald-500/90 text-white border border-emerald-400/20' : 'bg-red-500/90 text-white border border-red-400/20'
            }`}
          >
            {notifyType === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {notify}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live matches */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-[#64748b] tracking-[0.15em] uppercase">LIVE матчи</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {liveMatches.map((m: any) => (
              <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(`/referee/${m.id}`)}
                className="card-hover p-4 flex items-center gap-4 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#cbd5e1] truncate">{m.team_a?.name || 'Team A'}</p>
                  <p className="text-xs text-[#475569]">vs</p>
                  <p className="text-sm font-medium text-[#cbd5e1] truncate">{m.team_b?.name || 'Team B'}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-[#a78bfa] tabular-nums">{m.score_a}:{m.score_b}</p>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3" />LIVE
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <StatsDashboard stats={stats} />

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[#64748b] text-xs tracking-[0.2em] uppercase mb-1">Tournaments</p>
          <h1 className="heading-xl">
            <span className="text-gradient">Турниры</span>
          </h1>
          <p className="text-[#475569] text-sm mt-1">
            {tournaments.length} {tournaments.length === 1 ? 'турнир' : tournaments.length < 5 ? 'турнира' : 'турниров'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Отмена' : 'Создать'}
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="glass-card p-6 space-y-4 overflow-hidden"
          >
            <div>
              <label className="block text-xs text-[#64748b] mb-1.5 tracking-wide uppercase">Название *</label>
              <input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required autoFocus placeholder="Летний кубок 2026" />
            </div>
            <div>
              <label className="block text-xs text-[#64748b] mb-1.5 tracking-wide uppercase">Место</label>
              <input className="input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Стадион" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#64748b] mb-1.5 tracking-wide uppercase">Начало</label>
                <input type="datetime-local" className="input" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1.5 tracking-wide uppercase">Конец</label>
                <input type="datetime-local" className="input" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={creating} className="btn-primary">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {creating ? 'Создание...' : 'Создать'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Отмена</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Grid */}
      {tournaments.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[#1a1a25] border border-[#2a2a3a]">
            <Trophy className="w-8 h-8 text-[#475569]" />
          </div>
          <p className="text-[#64748b] font-medium">Турниров пока нет</p>
          <p className="text-[#475569] text-sm mt-1">Создайте первый турнир</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((t) => (
            <motion.div
              key={t.id}
              variants={itemAnim}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/tournament/${t.id}`)}
              className="card-hover p-5 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center relative"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.15)' }}
                >
                  <Trophy className="w-5 h-5 text-[#a78bfa]" />
                </div>
                <span className={t.status === 'active' ? 'badge-active text-[11px]' : 'badge-draft text-[11px]'}>
                  {t.status === 'active' ? 'Активен' : 'Черновик'}
                </span>
              </div>

              <h3 className="font-semibold text-[15px] mb-1 line-clamp-1 group-hover:text-[#a78bfa] transition-colors">
                {t.title}
              </h3>

              {t.location && (
                <p className="text-xs text-[#64748b] flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3 h-3" />
                  {t.location}
                </p>
              )}

              {t.start_date && (
                <p className="text-[11px] text-[#475569] mt-2">
                  {new Date(t.start_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
