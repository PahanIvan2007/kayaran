import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useTournamentStore } from '../store/useTournamentStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Loader2, CheckCircle2 } from 'lucide-react'
import ShareButton from '../components/ShareButton'

export default function MatchesPage() {
  const { id } = useParams<{ id: string }>()
  const { matches, setMatches } = useTournamentStore()
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [notify, setNotify] = useState<string | null>(null)
  const [form, setForm] = useState({ team_a: '', team_b: '', field_name: '', starts_at: '' })

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    if (!id) return
    const [m, t] = await Promise.all([api.getMatches(id), api.getTeams()])
    setMatches(m); setTeams(t); setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!id) return
    await api.createMatch({ tournament_id: id, team_a: form.team_a, team_b: form.team_b, field_name: form.field_name || null, starts_at: form.starts_at || null, status: 'pending', score_a: 0, score_b: 0 })
    setNotify('Матч создан'); setTimeout(() => setNotify(null), 2000)
    setShowForm(false); setForm({ team_a: '', team_b: '', field_name: '', starts_at: '' }); loadData()
  }

  const handleDelete = async (matchId: string) => {
    if (!confirm('Удалить матч?')) return
    await api.deleteMatch(matchId); loadData()
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 text-[#8b5cf6] animate-spin" /></div>

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {notify && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-emerald-500/90 text-white px-4 py-2.5 rounded-xl shadow-2xl text-sm flex items-center gap-2 border border-emerald-400/20"
          ><CheckCircle2 className="w-4 h-4" />{notify}</motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#64748b] text-xs tracking-[0.2em] uppercase mb-1">Matches</p>
          <h1 className="heading-lg"><span className="text-gradient">Матчи</span></h1>
          <p className="text-xs text-[#475569] mt-1">{matches.length} матчей</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" />{showForm ? 'Отмена' : 'Добавить'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate} className="glass-card p-6 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#64748b] mb-1.5 uppercase tracking-wide">Команда A *</label>
                <select className="input text-sm" value={form.team_a} onChange={e => setForm({...form, team_a: e.target.value})} required>
                  <option value="">Выберите</option>
                  {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1.5 uppercase tracking-wide">Команда B *</label>
                <select className="input text-sm" value={form.team_b} onChange={e => setForm({...form, team_b: e.target.value})} required>
                  <option value="">Выберите</option>
                  {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#64748b] mb-1.5 uppercase tracking-wide">Поле</label>
                <input className="input text-sm" value={form.field_name} onChange={e => setForm({...form, field_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-[#64748b] mb-1.5 uppercase tracking-wide">Время</label>
                <input type="datetime-local" className="input text-sm" value={form.starts_at} onChange={e => setForm({...form, starts_at: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn-primary"><Plus className="w-4 h-4" />Создать</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Отмена</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {matches.map((match: any, i: number) => (
          <motion.div key={match.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            className="card p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm text-[#94a3b8]">{match.team_a?.name || 'TBD'}</span>
                <span className="text-lg font-bold text-[#a78bfa] tabular-nums">{match.score_a}:{match.score_b}</span>
                <span className="font-medium text-sm text-[#94a3b8]">{match.team_b?.name || 'TBD'}</span>
              </div>
              {match.field_name && <p className="text-xs text-[#475569] mt-1">{match.field_name}</p>}
              {match.starts_at && (
                <div className="mt-2">
                  <ShareButton url={`${window.location.origin}/referee/${match.id}`} label="Поделиться матчем" />
                </div>
              )}
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(match.id)} className="text-[#475569] hover:text-red-400 p-2"
            ><Trash2 className="w-4 h-4" /></motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
