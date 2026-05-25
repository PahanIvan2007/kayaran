// Feature 6: Player roster for teams
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, X, User as UserIcon } from 'lucide-react'

interface Props { teamId: string }

export default function PlayerRoster({ teamId: _teamId }: Props) {
  const [players, setPlayers] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setPlayers([...players, name.trim()])
    setName(''); setShowForm(false)
  }

  const removePlayer = (i: number) => setPlayers(players.filter((_, idx) => idx !== i))

  return (
    <div className="mt-4 pt-4 border-t border-[#2a2a3a]/30">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase flex items-center gap-2">
          <Users className="w-3 h-3" />Состав ({players.length})
        </p>
        <button onClick={() => setShowForm(!showForm)} className="btn-ghost text-[11px] p-1.5">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={addPlayer} className="flex gap-2 mb-3 overflow-hidden"
          >
            <input className="input text-sm flex-1" placeholder="Имя игрока" value={name} onChange={e => setName(e.target.value)} required autoFocus />
            <button type="submit" className="btn-primary text-xs px-3">+</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-1">
        {players.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-[#2a2a3a]/20"
          >
            <span className="text-sm text-[#94a3b8] flex items-center gap-2">
              <UserIcon className="w-3.5 h-3.5 text-[#475569]" />{p}
            </span>
            <button onClick={() => removePlayer(i)} className="text-[#475569] hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
          </motion.div>
        ))}
        {players.length === 0 && <p className="text-[11px] text-[#475569] text-center py-2">Состав пуст</p>}
      </div>
    </div>
  )
}
