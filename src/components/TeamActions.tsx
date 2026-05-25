import { useState } from 'react'
import { api } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, Trash2, CheckCircle2, X, Palette } from 'lucide-react'

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6']

interface Props { team: any; onUpdate: () => void }

export default function TeamActions({ team, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(team.name)
  const [color, setColor] = useState(team.color || '#8b5cf6')

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.updateTeam(team.id, { name, color })
    setEditing(false); onUpdate()
  }

  const handleDelete = async () => {
    if (!confirm(`Удалить команду «${team.name}»?`)) return
    await api.deleteTeam(team.id); onUpdate()
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setEditing(!editing)} className="p-1.5 text-[#475569] hover:text-[#e2e8f0] transition-colors">
        <Edit3 className="w-3.5 h-3.5" />
      </button>
      <button onClick={handleDelete} className="p-1.5 text-[#475569] hover:text-red-400 transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-0 left-0 right-0 z-20 glass-card p-4 space-y-3"
          >
            <form onSubmit={handleEdit} className="space-y-3">
              <input className="input text-sm" value={name} onChange={e => setName(e.target.value)} required autoFocus />
              <div>
                <p className="text-[10px] text-[#475569] uppercase tracking-wider mb-2"><Palette className="w-3 h-3 inline" /> Цвет</p>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-lg border-2 transition-all"
                      style={{ backgroundColor: c, borderColor: color === c ? '#fff' : 'transparent' }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-xs"><CheckCircle2 className="w-3 h-3" />Сохранить</button>
                <button type="button" onClick={() => setEditing(false)} className="btn-ghost text-xs"><X className="w-3 h-3" /></button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
