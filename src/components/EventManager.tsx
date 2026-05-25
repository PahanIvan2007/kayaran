import { useState } from 'react'
import { api } from '../lib/api'
import { motion } from 'framer-motion'
import { Plus, Trash2, Swords, ShieldAlert, RotateCcw, CornerDownRight, Target, Loader2 } from 'lucide-react'

const EVENT_TYPES = [
  { id: 'goal', label: 'Гол', icon: Swords },
  { id: 'own_goal', label: 'Автогол', icon: CornerDownRight },
  { id: 'penalty', label: 'Пенальти', icon: Target },
  { id: 'yellow_card', label: 'ЖК', icon: ShieldAlert },
  { id: 'red_card', label: 'КК', icon: ShieldAlert },
  { id: 'substitution', label: 'Замена', icon: RotateCcw },
]

interface Props { match: any; teamA: any; teamB: any; onUpdate: () => void }

export default function EventManager({ match, teamA, teamB, onUpdate }: Props) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'goal', player_name: '', team_id: '', minute: '' })
  const [creating, setCreating] = useState(false)

  useState(() => {
    api.getMatchEvents(match.id).then(e => { setEvents(e); setLoading(false) })
  })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setCreating(true)
    await api.createMatchEvent({ match_id: match.id, type: form.type, player_name: form.player_name || null, team_id: form.team_id, minute: form.minute ? Number(form.minute) : null })
    setForm({ type: 'goal', player_name: '', team_id: '', minute: '' })
    setShowForm(false); setCreating(false)
    const updated = await api.getMatchEvents(match.id)
    setEvents(updated); onUpdate()
  }

  const handleDelete = async (id: string) => {
    await api.deleteMatchEvent(id)
    setEvents(events.filter(e => e.id !== id)); onUpdate()
  }

  const getTeamName = (teamId: string) => {
    if (teamId === teamA?.id) return teamA?.name
    if (teamId === teamB?.id) return teamB?.name
    return 'Неизвестно'
  }

  const getEventIcon = (type: string) => {
    if (type === 'yellow_card') return <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
    if (type === 'red_card') return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
    if (type === 'goal') return <Swords className="w-3.5 h-3.5 text-emerald-400" />
    if (type === 'own_goal') return <CornerDownRight className="w-3.5 h-3.5 text-red-400" />
    if (type === 'penalty') return <Target className="w-3.5 h-3.5 text-amber-400" />
    return <RotateCcw className="w-3.5 h-3.5 text-[#06b6d4]" />
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase"><Swords className="w-3 h-3 inline" /> События матча</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-ghost text-xs"><Plus className="w-3 h-3" />Добавить</button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleAdd} className="glass-card p-4 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {EVENT_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setForm({...form, type: t.id})}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${form.type === t.id ? 'bg-[#8b5cf6]/20 text-[#a78bfa] border border-[#8b5cf6]/30' : 'bg-[#1a1a25] text-[#64748b] border border-[#2a2a3a] hover:border-[#8b5cf6]/30'}`}
              ><t.icon className="w-3 h-3 inline mr-1" />{t.label}</button>
            ))}
          </div>
          <div className="flex gap-3">
            <input className="input text-sm flex-1" placeholder="Имя игрока" value={form.player_name} onChange={e => setForm({...form, player_name: e.target.value})} />
            <input className="input text-sm w-20" placeholder="Мин" type="number" value={form.minute} onChange={e => setForm({...form, minute: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <select className="input text-sm flex-1" value={form.team_id} onChange={e => setForm({...form, team_id: e.target.value})} required>
              <option value="">Команда</option>
              {teamA && <option value={teamA.id}>{teamA.name}</option>}
              {teamB && <option value={teamB.id}>{teamB.name}</option>}
            </select>
            <button type="submit" disabled={creating} className="btn-primary text-xs">
              {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-1 max-h-60 overflow-y-auto">
        {events.map((e: any, i: number) => (
          <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
            className="card p-3 flex items-center gap-3 group"
          >
            {getEventIcon(e.type)}
            <span className="text-xs text-[#475569] w-8 tabular-nums">{e.minute ? `${e.minute}'` : '--'}</span>
            <span className="text-sm text-[#cbd5e1] flex-1">{e.player_name || '—'}</span>
            <span className="text-[11px] text-[#475569]">{getTeamName(e.team_id)}</span>
            <button onClick={() => handleDelete(e.id)} className="p-1 text-[#475569] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
        {events.length === 0 && !loading && (
          <p className="text-center py-6 text-xs text-[#475569]">Нет событий</p>
        )}
      </div>
    </div>
  )
}
