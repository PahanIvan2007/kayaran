import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Edit3, Trash2, CheckCircle2, Loader2 } from 'lucide-react'

interface Props { teamId?: string }

export default function PlayerManager({ teamId }: Props) {
  const [players, setPlayers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', number: '', position: '', team_id: teamId || '' })
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { load() }, [teamId])

  const load = async () => {
    const [p, t] = await Promise.all([api.getPlayers(), api.getTeams()])
    setPlayers(teamId ? p.filter((pl: any) => pl.team_id === teamId) : p)
    setTeams(t); setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) {
      await api.updatePlayer(editId, { name: form.name, number: form.number ? Number(form.number) : null, position: form.position || null, team_id: form.team_id || null })
    } else {
      await api.createPlayer({ name: form.name, number: form.number ? Number(form.number) : null, position: form.position || null, team_id: form.team_id || null })
    }
    setShowForm(false); setEditId(null); setForm({ name: '', number: '', position: '', team_id: teamId || '' }); load()
  }

  const handleEdit = (p: any) => {
    setForm({ name: p.name, number: String(p.number || ''), position: p.position || '', team_id: p.team_id || '' })
    setEditId(p.id); setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить игрока?')) return
    await api.deletePlayer(id); load()
  }

  const handleTransfer = async (playerId: string, newTeamId: string) => {
    await api.updatePlayer(playerId, { team_id: newTeamId }); load()
  }

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-4 h-4 text-[#8b5cf6] animate-spin" /></div>

  const positions = ['Вратарь', 'Защитник', 'Полузащитник', 'Нападающий']

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase"><Users className="w-3 h-3 inline" /> Игроки ({players.length})</p>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', number: '', position: '', team_id: teamId || '' }) }} className="btn-ghost text-xs">
          <Plus className="w-3 h-3" />{showForm ? 'Отмена' : 'Добавить'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} className="glass-card p-4 space-y-3 mb-4 overflow-hidden"
          >
            <input className="input text-sm" placeholder="Имя *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <div className="flex gap-3">
              <input className="input text-sm w-24" placeholder="№" type="number" value={form.number} onChange={e => setForm({...form, number: e.target.value})} />
              <select className="input text-sm flex-1" value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
                <option value="">Позиция</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {!teamId && (
              <select className="input text-sm" value={form.team_id} onChange={e => setForm({...form, team_id: e.target.value})}>
                <option value="">Нет команды</option>
                {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            )}
            <button type="submit" className="btn-primary text-xs">
              <CheckCircle2 className="w-3 h-3" />{editId ? 'Сохранить' : 'Добавить'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-1.5">
        {players.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
            className="card p-3 flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-[#a78bfa]"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.1)' }}
            >{p.number || '?'}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#cbd5e1] truncate">{p.name}</p>
              <p className="text-[10px] text-[#475569]">{p.position || ''}{p.position && p.team_id ? ' · ' : ''}{teams.find((t: any) => t.id === p.team_id)?.name || ''}</p>
            </div>
            {!teamId && (
              <select className="text-[10px] bg-[#1a1a25] border border-[#2a2a3a] rounded-lg px-2 py-1 text-[#64748b]"
                value={p.team_id || ''} onChange={e => handleTransfer(p.id, e.target.value)}
              >
                <option value="">Без команды</option>
                {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            )}
            <button onClick={() => handleEdit(p)} className="p-1 text-[#475569] hover:text-[#e2e8f0] opacity-0 group-hover:opacity-100 transition-all">
              <Edit3 className="w-3 h-3" />
            </button>
            <button onClick={() => handleDelete(p.id)} className="p-1 text-[#475569] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
        {players.length === 0 && !loading && (
          <div className="text-center py-8"><Users className="w-6 h-6 mx-auto mb-2 text-[#2a2a3a]" /><p className="text-xs text-[#475569]">Нет игроков</p></div>
        )}
      </div>
    </div>
  )
}
