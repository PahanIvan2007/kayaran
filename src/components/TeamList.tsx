import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Loader2, CheckCircle2 } from 'lucide-react'
import TeamActions from './TeamActions'
import PlayerManager from './PlayerManager'

export default function TeamList() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [notify, setNotify] = useState<string | null>(null)
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  useEffect(() => { loadTeams() }, [])
  const loadTeams = async () => { setTeams(await api.getTeams()); setLoading(false) }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.createTeam({ name })
    setNotify(`«${name}» создана`); setTimeout(() => setNotify(null), 2000)
    setName(''); setShowForm(false); loadTeams()
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-[#8b5cf6] animate-spin" /></div>

  return (
    <div>
      <AnimatePresence>
        {notify && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-emerald-500/90 text-white px-4 py-2.5 rounded-xl shadow-2xl text-sm flex items-center gap-2 border border-emerald-400/20"
          ><CheckCircle2 className="w-4 h-4" />{notify}</motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase">Команды ({teams.length})</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-ghost text-xs">
          <Plus className="w-3.5 h-3.5" />{showForm ? 'Отмена' : 'Добавить'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate} className="mb-4 flex gap-2 overflow-hidden"
          >
            <input className="input flex-1 text-sm" placeholder="Название команды" value={name} onChange={e => setName(e.target.value)} required autoFocus />
            <button type="submit" className="btn-primary">Создать</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {teams.map((team, i) => (
          <motion.div key={team.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="card p-4 flex items-center gap-4 relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{ background: `${team.color || '#8b5cf6'}20`, border: `1px solid ${team.color || '#8b5cf6'}40`, color: team.color || '#a78bfa' }}
              >{team.name.charAt(0)}</div>
              <button className="flex-1 text-left" onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}>
                <span className="font-medium text-sm text-[#cbd5e1]">{team.name}</span>
                {team.color && <span className="w-2 h-2 rounded-full inline-block ml-2" style={{ backgroundColor: team.color }} />}
              </button>
              <TeamActions team={team} onUpdate={loadTeams} />
            </div>
            <AnimatePresence>
              {expandedTeam === team.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pl-14"
                >
                  <div className="pb-4 pt-2">
                    <PlayerManager teamId={team.id} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {teams.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-8 h-8 mx-auto mb-2 text-[#475569]" />
            <p className="text-sm text-[#64748b]">Команд пока нет</p>
          </div>
        )}
      </div>
    </div>
  )
}
